// Módulo Imperial v3.4 - Ed. Táctica (Con Timeouts)
document.addEventListener('DOMContentLoaded', () => {
    const dom = {
        urlList: document.getElementById('urlList'), visits: document.getElementById('visitsInput'), concurrency: document.getElementById('concurrencyInput'), retries: document.getElementById('retriesInput'), retryDelay: document.getElementById('retryDelayInput'), refererList: document.getElementById('refererList'), userAgentList: document.getElementById('userAgentList'), proxyList: document.getElementById('proxyList'), visitButton: document.getElementById('visitButton'), stopButton: document.getElementById('stopButton'), verifyProxiesButton: document.getElementById('verify-proxies'), exportLogButton: document.getElementById('export-log'), exportCsvButton: document.getElementById('export-csv'), exportTxtButton: document.getElementById('export-txt'), status: document.getElementById('status'), progressContainer: document.getElementById('progress-container'), progressBar: document.getElementById('progress-bar'), progressText: document.getElementById('progress-text'), resultsDashboard: document.getElementById('results-dashboard'), resultsTbody: document.querySelector('#results-table tbody'), presetSelect: document.getElementById('preset-select'), presetName: document.getElementById('preset-name'), savePresetButton: document.getElementById('save-preset'), deletePresetButton: document.getElementById('delete-preset'), themeToggle: document.getElementById('theme-toggle'),
        attackModeRadios: document.querySelectorAll('input[name="attackMode"]'), delaySettingsContainer: document.getElementById('delay-settings-container'), minDelay: document.getElementById('min-delay'), maxDelay: document.getElementById('max-delay'),
        resetMissionButton: document.getElementById('reset-mission'), resetLogButton: document.getElementById('reset-log'),
        showHistoryButton: document.getElementById('show-history'), historyModal: document.getElementById('history-modal'), closeHistoryButton: document.getElementById('close-history'), historyListContainer: document.getElementById('history-list-container'), clearHistoryButton: document.getElementById('clear-history'), logActionsGroup: document.getElementById('log-actions-group')
    };
    let isCancelled = false, logContent = '', missionResults = {};
    const SERVER_URLS = { visit: 'http://localhost:3000/execute-visit', verify: 'http://localhost:3000/verify-proxy' };
    
    const logMessage = (message, type = '') => { const fullMessage = `[${new Date().toLocaleTimeString()}] ${message}`; const el = document.createElement('div'); el.className = `status-message ${type}`; el.textContent = fullMessage; dom.status.appendChild(el); dom.status.scrollTop = dom.status.scrollHeight; logContent += fullMessage + '\n'; };
    const toggleControls = (enable) => { document.querySelectorAll('input, textarea, select, button').forEach(el => { if (el.id !== 'stopButton') el.disabled = !enable; }); };
    const setUiState = (isRunning) => { dom.visitButton.classList.toggle('hidden', isRunning); dom.stopButton.classList.toggle('hidden', !isRunning); dom.progressContainer.classList.toggle('hidden', !isRunning); const missionEnded = !isRunning && logContent.length > 0; dom.logActionsGroup.classList.toggle('hidden', !missionEnded); dom.resultsDashboard.classList.toggle('hidden', isRunning || Object.keys(missionResults).length === 0);};
    const applyTheme = (theme) => { document.body.className = theme === 'dark' ? 'dark-mode' : ''; dom.themeToggle.checked = theme === 'dark';};
    const getDelay = () => { const min = parseInt(dom.minDelay.value, 10); const max = parseInt(dom.maxDelay.value, 10); return Math.floor(Math.random() * (max - min + 1) + min); };
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const loadConfig = (p) => { try { dom.urlList.value = p.urls || ''; dom.visits.value = p.visits || '10'; dom.concurrency.value = p.concurrency || '5'; dom.retries.value = p.retries || '2'; dom.retryDelay.value = p.retryDelay || '1500'; dom.refererList.value = p.referers || ''; dom.userAgentList.value = p.userAgents || ''; dom.proxyList.value = p.proxies || ''; dom.minDelay.value = p.minDelay || '300'; dom.maxDelay.value = p.maxDelay || '1500'; if (p.attackMode) { document.querySelector(`input[name="attackMode"][value="${p.attackMode}"]`).checked = true; } else { document.querySelector('input[name="attackMode"][value="brutal"]').checked = true; } const changeEvent = new Event('change'); dom.attackModeRadios[0].dispatchEvent(changeEvent); } catch (error) { console.error("Error al cargar la configuración:", p, error); logMessage("No se pudo cargar la configuración. Los datos podrían estar corruptos.", "error"); }};
    const PRESET_STORAGE_KEY = 'presets_v3_imperial_final';
    const getPresets = () => { try { return JSON.parse(localStorage.getItem(PRESET_STORAGE_KEY)) || {}; } catch (e) { console.error("Error al parsear presets desde localStorage:", e); return {}; } };
    const populatePresets = () => {const presets = getPresets(); dom.presetSelect.innerHTML = '<option value="">Cargar preset...</option>'; Object.keys(presets).forEach(name => dom.presetSelect.add(new Option(name, name)));};
    const savePreset = () => { try { const name = dom.presetName.value.trim(); if (!name) return alert('Nombre de preset requerido.'); const presets = getPresets(); presets[name] = {urls: dom.urlList.value, visits: dom.visits.value, concurrency: dom.concurrency.value, retries: dom.retries.value, retryDelay: dom.retryDelay.value, referers: dom.refererList.value, userAgents: dom.userAgentList.value, proxies: dom.proxyList.value, attackMode: document.querySelector('input[name="attackMode"]:checked').value, minDelay: dom.minDelay.value, maxDelay: dom.maxDelay.value}; localStorage.setItem(PRESET_STORAGE_KEY, JSON.stringify(presets)); populatePresets(); dom.presetSelect.value = name; dom.presetName.value = ''; } catch (e) { console.error("Error al guardar preset en localStorage:", e); logMessage("Error al guardar preset. La memoria podría estar llena.", "error"); } };
    const loadPreset = () => {const name = dom.presetSelect.value; if (!name) return; const p = getPresets()[name]; loadConfig(p);};
    const deletePreset = () => { try { const name = dom.presetSelect.value; if (!name || !confirm(`¿Borrar preset "${name}"?`)) return; const presets = getPresets(); delete presets[name]; localStorage.setItem(PRESET_STORAGE_KEY, JSON.stringify(presets)); populatePresets(); } catch (e) { console.error("Error al borrar preset de localStorage:", e); logMessage("Error al borrar preset.", "error"); } };
    const HISTORY_STORAGE_KEY = 'mission_history_imperial';
    const getHistory = () => { try { return JSON.parse(localStorage.getItem(HISTORY_STORAGE_KEY)) || []; } catch (e) { console.error("Error al parsear historial desde localStorage:", e); return []; } };
    const saveMissionToHistory = (config, results) => { try { let history = getHistory(); const summary = `Misión a ${config.urls.split('\n')[0].trim().substring(0,40)}... (${parseInt(config.visits,10)*config.urls.split('\n').filter(Boolean).length} visitas)`; const newEntry={id:Date.now(),date:new Date().toLocaleString(),summary,config,results}; history.unshift(newEntry); if(history.length>30)history=history.slice(0,30); localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history)); } catch (e) { console.error("Error al guardar historial en localStorage:", e); logMessage("Error al guardar historial.", "error"); } };
    const renderHistoryModal = () => { try { const history=getHistory();dom.historyListContainer.innerHTML = '';if(history.length === 0){dom.historyListContainer.innerHTML = '<p style="text-align:center; color: var(--label-color);">El archivo está vacío.</p>'; return;} history.forEach(entry=>{const item=document.createElement('div');item.className='history-item';item.innerHTML=`<div class="history-item-info"><strong>${entry.summary}</strong><span>${entry.date}</span></div><div class="history-item-actions"><button class="btn-primary" data-id="${entry.id}" data-action="reload">Recargar</button><button class="btn-danger" data-id="${entry.id}" data-action="delete">Borrar</button></div>`;dom.historyListContainer.appendChild(item);}); } catch (e) { console.error("Error al renderizar el historial:", e); logMessage("Error al mostrar el historial.", "error"); } };
    const verifyProxies = async () => {
        try {
            const proxies = dom.proxyList.value.split('\n').map(p => p.trim()).filter(Boolean);
            if (proxies.length === 0) return logMessage('No hay proxies para verificar.', 'warning');
            dom.verifyProxiesButton.disabled = true;
            dom.verifyProxiesButton.classList.add('verifying');
            logMessage(`Verificando ${proxies.length} proxies...`, 'info');
            const verificationPromises = proxies.map(proxy =>
                fetch(SERVER_URLS.verify, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ proxy }) })
                .then(res => res.json())
                .catch(err => {
                    console.error(`Error verificando proxy ${proxy}:`, err);
                    return { success: false, proxy }; // Marcar como fallido si hay un error de red
                })
            );
            const results = await Promise.all(verificationPromises);
            const goodProxies = results.filter(r => r.success).map(r => r.proxy);
            dom.proxyList.value = goodProxies.join('\n');
            logMessage(`Verificación completa. ${goodProxies.length} de ${proxies.length} proxies operativos.`, 'info');
        } catch (error) {
            console.error("Error en la función verifyProxies:", error);
            logMessage("Ocurrió un error inesperado durante la verificación de proxies.", "error");
        } finally {
            dom.verifyProxiesButton.disabled = false;
            dom.verifyProxiesButton.classList.remove('verifying');
        }
    };
    const renderResultsTable = () => { dom.resultsTbody.innerHTML = ''; Object.values(missionResults).forEach(data => { const total = data.success + data.fail, rate = total > 0 ? (data.success / total) * 100 : 0, avgTime = data.times.length > 0 ? data.times.reduce((a, b) => a + b, 0) / data.times.length : 0; const row = `<tr><td title="${data.url}">${data.url}</td><td>${data.success}</td><td>${data.fail}</td><td>${rate.toFixed(1)}%</td><td>${Math.round(avgTime)}</td></tr>`; dom.resultsTbody.innerHTML += row; }); };
    const exportFile = (content, fileName, mimeType) => { const blob = new Blob([content], { type: mimeType }); const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.setAttribute("download", fileName); document.body.appendChild(link); link.click(); document.body.removeChild(link);};
    const exportToCsv = () => { let content = "URL,Exitos,Fallos,TasaExito(%),TiempoPromedio(ms)\n"; Object.values(missionResults).forEach(data => { const total = data.success + data.fail, rate = total > 0 ? (data.success / total) * 100 : 0, avgTime = data.times.length > 0 ? data.times.reduce((a, b) => a + b, 0) / data.times.length : 0; const row = `"${data.url}",${data.success},${data.fail},${rate.toFixed(1)},${Math.round(avgTime)}\n`; content += row; }); exportFile(content, `reporte_mision_${new Date().toISOString()}.csv`, 'text/csv;charset=utf-8;'); };
    const exportToTxt = () => { let report = "--- REPORTE DE INTELIGENCIA DE MISIÓN IMPERIAL ---\n\n"; const urls = Object.values(missionResults); const totalVisits = urls.reduce((s, d) => s + d.success + d.fail, 0); const totalSuccess = urls.reduce((s, d) => s + d.success, 0); const totalFail = urls.reduce((s, d) => s + d.fail, 0); const overallRate = totalVisits > 0 ? (totalSuccess/totalVisits)*100:0; report += `FECHA: ${new Date().toLocaleString()}\nOBJETIVOS: ${urls.length}\nVISITAS TOTALES: ${totalVisits}\nRESULTADO: ${totalSuccess} Éxitos / ${totalFail} Fallos (${overallRate.toFixed(1)}%)\n--------------------------------------------------\n\n`; urls.forEach(data => { const total = data.success + data.fail, rate = total > 0 ? (data.success/total)*100:0, avgTime = data.times.length > 0 ? data.times.reduce((a, b) => a + b, 0)/data.times.length:0; report += `URL: ${data.url}\n  - Éxitos/Fallos: ${data.success}/${data.fail}\n  - Tasa de Éxito: ${rate.toFixed(1)}%\n  - Tiempo Promedio: ${Math.round(avgTime)}ms\n\n`;}); exportFile(report, `resumen_mision_${new Date().toISOString()}.txt`, 'text/plain;charset=utf-8;'); };
    
    // --- LÓGICA DE MISIÓN v3.4 ---
    const executeOrder = async (order) => {
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('La orden excedió el tiempo de espera (15s).')), 15000);
        });
        try {
            const response = await Promise.race([
                fetch(SERVER_URLS.visit, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(order) }),
                timeoutPromise
            ]);
            if (!response.headers.get("content-type")?.includes("application/json")) {
                 throw new Error("Respuesta inesperada del servidor, no es JSON.");
            }
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Error en el Relay');
            return result;
        } catch (error) {
            console.error(`[executeOrder] Fallo de comunicación para la orden:`, order, error);
            return { success: false, status: 'RELAY_ERROR', message: `Fallo de comunicación: ${error.message}` };
        }
    };
    const startVisits = async () => {
        try {
            isCancelled = false; missionResults = {}; const urls = dom.urlList.value.split('\n').map(u => u.trim()).filter(Boolean); if (urls.length === 0) return alert('Introduce al menos una URL.'); const vpu = parseInt(dom.visits.value,10), conc = parseInt(dom.concurrency.value,10), rtrs = parseInt(dom.retries.value,10), rtrD = parseInt(dom.retryDelay.value,10); const rfrs = dom.refererList.value.split('\n').map(u => u.trim()).filter(Boolean); const uas = dom.userAgentList.value.split('\n').map(u => u.trim()).filter(Boolean); const prxs = dom.proxyList.value.split('\n').map(u => u.trim()).filter(Boolean); const attackMode = document.querySelector('input[name="attackMode"]:checked').value; const allTasks = []; for (const url of urls) { for (let i=0; i < vpu; i++) allTasks.push({url}); missionResults[url] = { url, success: 0, fail: 0, times: [] }; } let tasksCompleted = 0; const totalTasks = allTasks.length; toggleControls(false); setUiState(true); dom.status.innerHTML = ''; logContent = ''; logMessage(`Iniciando Misión [Modo: ${attackMode.charAt(0).toUpperCase() + attackMode.slice(1)}] | ${totalTasks} visitas | Concurrencia: ${conc}`, 'info'); const worker = async () => { while (allTasks.length > 0) { if (isCancelled) return; const task = allTasks.shift(); const headers = {}; if (uas.length) headers['User-Agent'] = uas[Math.floor(Math.random() * uas.length)]; if (rfrs.length) headers['Referer'] = rfrs[Math.floor(Math.random() * rfrs.length)]; const order = { targetUrl: task.url, proxy: prxs.length ? prxs[tasksCompleted % prxs.length] : null, headers, retries: rtrs, retryDelay: rtrD}; const report = await executeOrder(order); tasksCompleted++; const r = missionResults[task.url]; if (report.success) {r.success++; r.times.push(report.duration);} else {r.fail++;} logMessage(`${report.success ? '✅':'❌'} [${report.status||'ERROR'}] ${task.url} ${report.success ? `(${report.duration}ms)`:`| Fallo: ${report.message}`}`, report.success ? 'success':'error'); dom.progressBar.style.width = `${(tasksCompleted / totalTasks) * 100}%`; dom.progressText.textContent = `${tasksCompleted} / ${totalTasks}`; if (attackMode === 'tactical' && !isCancelled && allTasks.length > 0) {await sleep(getDelay());} } }; await Promise.all(Array(conc).fill(null).map(worker)); const finalMessage = isCancelled ? 'MISIÓN ABORTADA.' : 'MISIÓN COMPLETADA.'; logMessage(finalMessage, isCancelled ? 'warning' : 'info'); renderResultsTable(); const currentConfig = {urls:dom.urlList.value, visits:dom.visits.value, concurrency:dom.concurrency.value, retries:dom.retries.value, retryDelay:dom.retryDelay.value, attackMode, minDelay:dom.minDelay.value, maxDelay:dom.maxDelay.value, referers:dom.refererList.value, userAgents:dom.userAgentList.value, proxies:dom.proxyList.value}; if (!isCancelled) saveMissionToHistory(currentConfig, missionResults);
        } catch (error) {
            console.error("Error crítico durante la ejecución de la misión:", error);
            logMessage(`Error fatal en la misión: ${error.message}. Revisa la consola para más detalles.`, 'error');
        } finally {
            toggleControls(true);
            setUiState(false);
        }
    };
    
    // --- LISTENERS & INICIALIZACIÓN ---
    const resetMission = () => { if (confirm("¿Seguro que quieres reiniciar? Se perderá el reporte actual.")) { location.reload(); }};

    // Lógica de Pestañas (Tabs)
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');
    tabLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tabId = link.getAttribute('aria-controls');

            tabContents.forEach(content => content.classList.remove('active'));
            tabLinks.forEach(innerLink => {
                innerLink.classList.remove('active');
                innerLink.setAttribute('aria-selected', 'false');
            });

            document.getElementById(tabId).classList.add('active');
            link.classList.add('active');
            link.setAttribute('aria-selected', 'true');
        });
    });

    dom.visitButton.addEventListener('click', startVisits);
    dom.stopButton.addEventListener('click', () => isCancelled = true);
    dom.attackModeRadios.forEach(radio => radio.addEventListener('change', () => { dom.delaySettingsContainer.classList.toggle('hidden', document.querySelector('input[name="attackMode"]:checked').value !== 'tactical'); }));
    dom.savePresetButton.addEventListener('click', savePreset);
    dom.presetSelect.addEventListener('change', loadPreset);
    dom.deletePresetButton.addEventListener('click', deletePreset);
    dom.verifyProxiesButton.addEventListener('click', verifyProxies);
    dom.exportLogButton.addEventListener('click', () => exportFile(logContent, `log_mision_${new Date().toISOString()}.txt`, 'text/plain;charset=utf-8;'));
    dom.exportCsvButton.addEventListener('click', exportToCsv);
    dom.exportTxtButton.addEventListener('click', exportToTxt);
    dom.themeToggle.addEventListener('change', () => { const newTheme = dom.themeToggle.checked ? 'dark' : 'light'; localStorage.setItem('theme', newTheme); applyTheme(newTheme); });
    dom.resetMissionButton.addEventListener('click', resetMission);
    dom.resetLogButton.addEventListener('click', resetMission);
    dom.showHistoryButton.addEventListener('click', () => { renderHistoryModal(); dom.historyModal.showModal(); });
    dom.closeHistoryButton.addEventListener('click', () => dom.historyModal.close());
    dom.clearHistoryButton.addEventListener('click', () => { if (confirm('¿Borrar TODO el historial? Esta acción es irreversible.')) { localStorage.removeItem(HISTORY_STORAGE_KEY); renderHistoryModal(); } });
    dom.historyListContainer.addEventListener('click', (e) => { const target = e.target.closest('button'); if (!target) return; const id = Number(target.dataset.id); const action = target.dataset.action; let history = getHistory(); if (action === 'delete') { if (confirm('¿Borrar esta entrada del historial?')) { const newHistory = history.filter(entry => entry.id !== id); localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(newHistory)); renderHistoryModal(); } } if (action === 'reload') { const entry = history.find(entry => entry.id === id); if (entry) { loadConfig(entry.config); dom.historyModal.close(); logMessage(`Configuración de misión cargada desde el archivo: "${entry.summary}".`, 'info'); } } });

    (() => {
        try {
            applyTheme(localStorage.getItem('theme') || 'dark');
            populatePresets();
            // La pestaña inicial ya se muestra con la clase 'active' en el HTML, no es necesario un click.
            const changeEvent = new Event('change');
            dom.attackModeRadios[0].dispatchEvent(changeEvent);
        } catch (error) {
            console.error("Error durante la inicialización:", error);
            logMessage("La aplicación no pudo iniciarse correctamente.", "error");
        }
    })();
});