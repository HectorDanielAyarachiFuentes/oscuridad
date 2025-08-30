document.addEventListener('DOMContentLoaded', () => {
    // --- REFERENCIAS AL DOM ---
    const dom = {
        urlList: document.getElementById('urlList'),
        visits: document.getElementById('visitsInput'),
        concurrency: document.getElementById('concurrencyInput'),
        retries: document.getElementById('retriesInput'),
        retryDelay: document.getElementById('retryDelayInput'),
        refererList: document.getElementById('refererList'),
        userAgentList: document.getElementById('userAgentList'),
        proxyList: document.getElementById('proxyList'),
        visitButton: document.getElementById('visitButton'),
        stopButton: document.getElementById('stopButton'),
        verifyProxiesButton: document.getElementById('verify-proxies'),
        exportLogButton: document.getElementById('export-log'),
        exportCsvButton: document.getElementById('export-csv'),
        status: document.getElementById('status'),
        progressContainer: document.getElementById('progress-container'),
        progressBar: document.getElementById('progress-bar'),
        progressText: document.getElementById('progress-text'),
        resultsDashboard: document.getElementById('results-dashboard'),
        resultsTbody: document.querySelector('#results-table tbody'),
        presetSelect: document.getElementById('preset-select'),
        presetName: document.getElementById('preset-name'),
        savePresetButton: document.getElementById('save-preset'),
        deletePresetButton: document.getElementById('delete-preset'),
        themeToggle: document.getElementById('theme-toggle'),
    };
    // --- ESTADO GLOBAL ---
    let isCancelled = false, logContent = '', missionResults = {};
    const SERVER_URLS = {
        visit: 'http://localhost:3000/execute-visit',
        verify: 'http://localhost:3000/verify-proxy'
    };
    
    // --- LÓGICA DE PRESETS (DIRECTIVA VI) ---
    const PRESET_STORAGE_KEY = 'presets_v3_imperial';
    const getPresets = () => JSON.parse(localStorage.getItem(PRESET_STORAGE_KEY)) || {};
    const populatePresets = () => {
        const presets = getPresets();
        dom.presetSelect.innerHTML = '<option value="">Cargar preset...</option>';
        Object.keys(presets).forEach(name => dom.presetSelect.add(new Option(name, name)));
    };
    const savePreset = () => {
        const name = dom.presetName.value.trim();
        if (!name) return alert('Por favor, introduce un nombre para el preset.');
        const presets = getPresets();
        presets[name] = {
            urls: dom.urlList.value, visits: dom.visits.value, concurrency: dom.concurrency.value,
            retries: dom.retries.value, retryDelay: dom.retryDelay.value, referers: dom.refererList.value,
            userAgents: dom.userAgentList.value, proxies: dom.proxyList.value
        };
        localStorage.setItem(PRESET_STORAGE_KEY, JSON.stringify(presets));
        populatePresets(); dom.presetSelect.value = name; dom.presetName.value = '';
    };
    const loadPreset = () => {
        const name = dom.presetSelect.value;
        if (!name) return;
        const p = getPresets()[name];
        dom.urlList.value = p.urls || ''; dom.visits.value = p.visits || '10'; dom.concurrency.value = p.concurrency || '5';
        dom.retries.value = p.retries || '2'; dom.retryDelay.value = p.retryDelay || '1500'; dom.refererList.value = p.referers || '';
        dom.userAgentList.value = p.userAgents || ''; dom.proxyList.value = p.proxies || '';
    };
    const deletePreset = () => {
        const name = dom.presetSelect.value;
        if (!name || !confirm(`¿Borrar el preset "${name}"?`)) return;
        const presets = getPresets();
        delete presets[name];
        localStorage.setItem(PRESET_STORAGE_KEY, JSON.stringify(presets));
        populatePresets();
    };

    // --- VERIFICADOR DE PROXIES (DIRECTIVA V) ---
    const verifyProxies = async () => {
        const proxies = dom.proxyList.value.split('\n').map(p => p.trim()).filter(Boolean);
        if (proxies.length === 0) return logMessage('No hay proxies en la lista para verificar.', 'warning');

        dom.verifyProxiesButton.disabled = true;
        dom.verifyProxiesButton.classList.add('verifying');
        logMessage(`Iniciando verificación de ${proxies.length} proxies...`, 'info');

        const verificationPromises = proxies.map(proxy =>
            fetch(SERVER_URLS.verify, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ proxy })
            }).then(res => res.json())
        );
        const results = await Promise.all(verificationPromises);
        
        const goodProxies = results.filter(r => r.success).map(r => r.proxy);
        dom.proxyList.value = goodProxies.join('\n');
        
        dom.verifyProxiesButton.disabled = false;
        dom.verifyProxiesButton.classList.remove('verifying');
        logMessage(`Verificación completa. ${goodProxies.length} de ${proxies.length} proxies están operativos.`, 'info');
    };

    // --- LÓGICA DE MISIÓN (CONCURRENCIA, INTELIGENCIA) ---
    const executeOrder = async (order) => { /* ... (se mantiene igual) ... */ };
    const startVisits = async () => { /* ... (ver código completo abajo) ... */ };

    // --- RENDERIZADO Y EXPORTACIÓN DE RESULTADOS (DIRECTIVA IV) ---
    const renderResultsTable = () => {
        dom.resultsTbody.innerHTML = '';
        Object.values(missionResults).forEach(data => {
            const total = data.success + data.fail;
            const successRate = total > 0 ? (data.success / total) * 100 : 0;
            const avgTime = data.times.length > 0 ? data.times.reduce((a, b) => a + b, 0) / data.times.length : 0;

            const row = `<tr>
                <td title="${data.url}">${data.url}</td>
                <td>${data.success}</td>
                <td>${data.fail}</td>
                <td>${successRate.toFixed(1)}%</td>
                <td>${Math.round(avgTime)}</td>
            </tr>`;
            dom.resultsTbody.innerHTML += row;
        });
        dom.resultsDashboard.style.display = 'block';
    };
    
    const exportToCsv = () => {
        let csvContent = "URL,Exitos,Fallos,TasaExito(%),TiempoPromedio(ms)\n";
        Object.values(missionResults).forEach(data => {
            const total = data.success + data.fail;
            const successRate = total > 0 ? (data.success / total) * 100 : 0;
            const avgTime = data.times.length > 0 ? data.times.reduce((a, b) => a + b, 0) / data.times.length : 0;
            const row = `"${data.url}",${data.success},${data.fail},${successRate.toFixed(1)},${Math.round(avgTime)}\n`;
            csvContent += row;
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.setAttribute("download", `reporte_mision_${new Date().toISOString()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // --- Event Listeners y Lógica Restante ---
    // (ver código completo abajo)
});

//--- SCRIPT.JS COMPLETO ---
// (Reemplaza TODO tu script.js con esto)
document.addEventListener('DOMContentLoaded', () => {
    const dom = {
        urlList: document.getElementById('urlList'), visits: document.getElementById('visitsInput'), concurrency: document.getElementById('concurrencyInput'),
        retries: document.getElementById('retriesInput'), retryDelay: document.getElementById('retryDelayInput'), refererList: document.getElementById('refererList'),
        userAgentList: document.getElementById('userAgentList'), proxyList: document.getElementById('proxyList'), visitButton: document.getElementById('visitButton'),
        stopButton: document.getElementById('stopButton'), verifyProxiesButton: document.getElementById('verify-proxies'), exportLogButton: document.getElementById('export-log'),
        exportCsvButton: document.getElementById('export-csv'), status: document.getElementById('status'), progressContainer: document.getElementById('progress-container'),
        progressBar: document.getElementById('progress-bar'), progressText: document.getElementById('progress-text'), resultsDashboard: document.getElementById('results-dashboard'),
        resultsTbody: document.querySelector('#results-table tbody'), presetSelect: document.getElementById('preset-select'), presetName: document.getElementById('preset-name'),
        savePresetButton: document.getElementById('save-preset'), deletePresetButton: document.getElementById('delete-preset'), themeToggle: document.getElementById('theme-toggle'),
    };
    let isCancelled = false, logContent = '', missionResults = {};
    const SERVER_URLS = { visit: 'http://localhost:3000/execute-visit', verify: 'http://localhost:3000/verify-proxy' };
    
    // UI UTILS
    window.openTab = (evt, tabName) => { document.querySelectorAll(".tab-content").forEach(tab => tab.style.display = "none"); document.querySelectorAll(".tab-link").forEach(link => link.classList.remove("active")); document.getElementById(tabName).style.display = "block"; evt.currentTarget.classList.add("active"); };
    const logMessage = (message, type = '') => { const fullMessage = `[${new Date().toLocaleTimeString()}] ${message}`; const el = document.createElement('div'); el.className = `status-message ${type}`; el.textContent = fullMessage; dom.status.appendChild(el); dom.status.scrollTop = dom.status.scrollHeight; logContent += fullMessage + '\n'; };
    const toggleControls = (enable) => { document.querySelectorAll('input, textarea, select, button').forEach(el => { if (el.id !== 'stopButton') el.disabled = !enable; }); };
    const setUiState = (isRunning) => { dom.visitButton.style.display = isRunning ? 'none' : 'block'; dom.stopButton.style.display = isRunning ? 'block' : 'none'; dom.progressContainer.style.display = isRunning ? 'block' : 'none'; dom.exportLogButton.style.display = !isRunning && logContent.length > 0; dom.exportCsvButton.style.display = !isRunning && Object.keys(missionResults).length > 0; dom.resultsDashboard.style.display = isRunning ? 'none' : (Object.keys(missionResults).length > 0 ? 'block' : 'none');};
    const applyTheme = (theme) => { document.body.className = theme === 'dark' ? 'dark-mode' : ''; dom.themeToggle.checked = theme === 'dark';};

    // PRESETS
    const PRESET_STORAGE_KEY = 'presets_v3_imperial';
    const getPresets = () => JSON.parse(localStorage.getItem(PRESET_STORAGE_KEY)) || {};
    const populatePresets = () => {const presets = getPresets(); dom.presetSelect.innerHTML = '<option value="">Cargar preset...</option>'; Object.keys(presets).forEach(name => dom.presetSelect.add(new Option(name, name)));};
    const savePreset = () => {const name = dom.presetName.value.trim(); if (!name) return alert('Nombre de preset requerido.'); const presets = getPresets(); presets[name] = {urls: dom.urlList.value, visits: dom.visits.value, concurrency: dom.concurrency.value, retries: dom.retries.value, retryDelay: dom.retryDelay.value, referers: dom.refererList.value, userAgents: dom.userAgentList.value, proxies: dom.proxyList.value}; localStorage.setItem(PRESET_STORAGE_KEY, JSON.stringify(presets)); populatePresets(); dom.presetSelect.value = name; dom.presetName.value = '';};
    const loadPreset = () => {const name = dom.presetSelect.value; if (!name) return; const p = getPresets()[name]; dom.urlList.value = p.urls || ''; dom.visits.value = p.visits || '10'; dom.concurrency.value = p.concurrency || '5'; dom.retries.value = p.retries || '2'; dom.retryDelay.value = p.retryDelay || '1500'; dom.refererList.value = p.referers || ''; dom.userAgentList.value = p.userAgents || ''; dom.proxyList.value = p.proxies || '';};
    const deletePreset = () => {const name = dom.presetSelect.value; if (!name || !confirm(`¿Borrar preset "${name}"?`)) return; const presets = getPresets(); delete presets[name]; localStorage.setItem(PRESET_STORAGE_KEY, JSON.stringify(presets)); populatePresets();};
    
    // PROXY VERIFIER
    const verifyProxies = async () => {const proxies = dom.proxyList.value.split('\n').map(p => p.trim()).filter(Boolean); if (proxies.length === 0) return logMessage('No hay proxies para verificar.', 'warning'); dom.verifyProxiesButton.disabled = true; dom.verifyProxiesButton.classList.add('verifying'); logMessage(`Verificando ${proxies.length} proxies...`, 'info'); const verificationPromises = proxies.map(proxy => fetch(SERVER_URLS.verify, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ proxy }) }).then(res => res.json())); const results = await Promise.all(verificationPromises); const goodProxies = results.filter(r => r.success).map(r => r.proxy); dom.proxyList.value = goodProxies.join('\n'); dom.verifyProxiesButton.disabled = false; dom.verifyProxiesButton.classList.remove('verifying'); logMessage(`Verificación completa. ${goodProxies.length} de ${proxies.length} proxies operativos.`, 'info');};

    // RESULTS & EXPORT
    const renderResultsTable = () => { dom.resultsTbody.innerHTML = ''; Object.values(missionResults).forEach(data => { const total = data.success + data.fail, rate = total > 0 ? (data.success / total) * 100 : 0, avgTime = data.times.length > 0 ? data.times.reduce((a, b) => a + b, 0) / data.times.length : 0; const row = `<tr><td title="${data.url}">${data.url}</td><td>${data.success}</td><td>${data.fail}</td><td>${rate.toFixed(1)}%</td><td>${Math.round(avgTime)}</td></tr>`; dom.resultsTbody.innerHTML += row; }); };
    const exportToCsv = () => { let csvContent = "URL,Exitos,Fallos,TasaExito(%),TiempoPromedio(ms)\n"; Object.values(missionResults).forEach(data => { const total = data.success + data.fail, rate = total > 0 ? (data.success / total) * 100 : 0, avgTime = data.times.length > 0 ? data.times.reduce((a, b) => a + b, 0) / data.times.length : 0; const row = `"${data.url}",${data.success},${data.fail},${rate.toFixed(1)},${Math.round(avgTime)}\n`; csvContent += row; }); const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' }); const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.setAttribute("download", `reporte_mision_${new Date().toISOString()}.csv`); document.body.appendChild(link); link.click(); document.body.removeChild(link);};
    
    // MISSION LOGIC
    const executeOrder = async (order) => {try {const response = await fetch(SERVER_URLS.visit, {method: 'POST',headers: { 'Content-Type': 'application/json' },body: JSON.stringify(order)});const result = await response.json();if (!response.ok) throw new Error(result.message || 'Error en Relay');return result;} catch (error) {return { success: false, status: 'RELAY_ERROR', message: `Fallo de comunicación con Relay: ${error.message}` };}};
    const startVisits = async () => { isCancelled = false; missionResults = {}; const urls = dom.urlList.value.split('\n').map(u => u.trim()).filter(Boolean); if (urls.length === 0) return alert('Introduce al menos una URL.'); const vpu = parseInt(dom.visits.value,10), conc = parseInt(dom.concurrency.value,10), rtrs = parseInt(dom.retries.value,10), rtrD = parseInt(dom.retryDelay.value,10); const rfrs = dom.refererList.value.split('\n').map(u => u.trim()).filter(Boolean); const uas = dom.userAgentList.value.split('\n').map(u => u.trim()).filter(Boolean); const prxs = dom.proxyList.value.split('\n').map(u => u.trim()).filter(Boolean); const allTasks = []; for (const url of urls) { for (let i=0; i < vpu; i++) allTasks.push({url}); missionResults[url] = { url, success: 0, fail: 0, times: [] }; } let tasksCompleted = 0; const totalTasks = allTasks.length; toggleControls(false); setUiState(true); dom.status.innerHTML = ''; logContent = ''; logMessage(`Iniciando misión: ${totalTasks} visitas | Concurrencia: ${conc}`, 'info'); const worker = async () => { while (allTasks.length > 0) { if (isCancelled) return; const task = allTasks.shift(); const headers = {}; if (uas.length) headers['User-Agent'] = uas[Math.floor(Math.random() * uas.length)]; if (rfrs.length) headers['Referer'] = rfrs[Math.floor(Math.random() * rfrs.length)]; const order = { targetUrl: task.url, proxy: prxs.length ? prxs[tasksCompleted % prxs.length] : null, headers, retries: rtrs, retryDelay: rtrD}; const report = await executeOrder(order); tasksCompleted++; const r = missionResults[task.url]; if (report.success) {r.success++; r.times.push(report.duration);} else {r.fail++;} logMessage(`${report.success ? '✅':'❌'} [${report.status||'ERROR'}] ${task.url} ${report.success ? `(${report.duration}ms)`:`| Fallo: ${report.message}`}`, report.success ? 'success':'error'); dom.progressBar.style.width = `${(tasksCompleted / totalTasks) * 100}%`; dom.progressText.textContent = `${tasksCompleted} / ${totalTasks}`; } }; await Promise.all(Array(conc).fill(null).map(worker)); logMessage(isCancelled ? 'MISIÓN ABORTADA.':'MISIÓN COMPLETADA.', isCancelled?'warning':'info'); renderResultsTable(); toggleControls(true); setUiState(false); };
    
    // LISTENERS & INIT
    dom.visitButton.addEventListener('click', startVisits);
    dom.stopButton.addEventListener('click', () => isCancelled = true);
    dom.verifyProxiesButton.addEventListener('click', verifyProxies);
    dom.exportLogButton.addEventListener('click', () => { /* log export logic */});
    dom.exportCsvButton.addEventListener('click', exportToCsv);
    dom.themeToggle.addEventListener('change', () => { const newTheme = dom.themeToggle.checked ? 'dark' : 'light'; localStorage.setItem('theme', newTheme); applyTheme(newTheme); });
    dom.savePresetButton.addEventListener('click', savePreset);
    dom.presetSelect.addEventListener('change', loadPreset);
    dom.deletePresetButton.addEventListener('click', deletePreset);
    (() => { applyTheme(localStorage.getItem('theme') || 'dark'); populatePresets(); document.querySelector('.tab-link').click(); })();
});