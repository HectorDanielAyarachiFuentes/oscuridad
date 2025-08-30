// server.js - v3.1 con parche de estabilidad y reporte de órdenes

const express = require('express');
const cors = require('cors');
const { HttpsProxyAgent } = require('https-proxy-agent');
const axios = require('axios');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

app.post('/execute-visit', async (req, res) => {
    let { targetUrl, proxy, headers, retries, retryDelay } = req.body;
    
    // ¡AÑADIDO! El Oficial de Comunicaciones reportando para el servicio.
    console.log(`[Orden Recibida] Visitar: ${targetUrl}` + (proxy ? ` via ${proxy}` : ''));

    retries = retries || 0; retryDelay = retryDelay || 1000;
    
    let startTime; 

    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            startTime = Date.now();
            const requestConfig = { headers: headers || {}, timeout: 10000 };
            
            if (proxy) {
                requestConfig.httpsAgent = new HttpsProxyAgent(proxy);
                requestConfig.proxy = false;
            }
            if (attempt > 0) {
                console.log(`[Reintento ${attempt}/${retries}] Esperando ${retryDelay}ms para ${targetUrl}`);
                await sleep(retryDelay);
            }

            const response = await axios.get(targetUrl, requestConfig);
            const duration = Date.now() - startTime;
            return res.json({ success: true, status: response.status, statusText: response.statusText, duration, message: `Éxito en intento #${attempt + 1}`});
        
        } catch (error) {
            const duration = Date.now() - (startTime || Date.now()); 
            const isRetryable = !error.response || error.response.status >= 500;
            
            if (attempt === retries || !isRetryable) {
                console.log(`[Fallo Definitivo] ${targetUrl}`);
                if (error.response) {
                    return res.status(400).json({ success: false, status: error.response.status, duration, message: `Error de servidor de destino: ${error.response.status}`});
                }
                return res.status(500).json({ success: false, status: 'NETWORK_ERROR', duration, message: `Error de red/proxy: ${error.message.slice(0, 100)}`});
            }
        }
    }
});

// La ruta /verify-proxy se mantiene igual.
app.post('/verify-proxy', async (req, res) => {
    const { proxy } = req.body;

    // Reporte de verificación en la terminal del servidor
    console.log(`[Verificando Flota] Probando proxy: ${proxy}`);

    if (!proxy) return res.status(400).json({ success: false, proxy, message: 'No se proporcionó proxy.' });
    try {
        const agent = new HttpsProxyAgent(proxy);
        const response = await axios.get('https://httpbin.org/get', {
            httpsAgent: agent,
            proxy: false,
            timeout: 7000
        });
        if (response.status === 200) res.json({ success: true, proxy });
        else res.json({ success: false, proxy, message: `Respuesta inesperada: ${response.status}` });
    } catch (error) {
        res.json({ success: false, proxy, message: `Fallo de conexión: ${error.message.slice(0, 100)}` });
    }
});

app.listen(PORT, () => {
    console.log(`Estación de Batalla v3.1 (Estable) operativa en el puerto ${PORT}`);
});