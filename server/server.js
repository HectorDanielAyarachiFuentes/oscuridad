// server.js - v4.1 "Phantom" (Corrección de Proxies)
const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.post('/execute-visit', async (req, res) => {
    let { targetUrl, proxy, headers } = req.body;
    
    console.log(`[Orden FANTASMA Recibida] Visitar: ${targetUrl}` + (proxy ? ` via ${proxy}` : ''));

    let browser = null;
    const startTime = Date.now();
    try {
        const launchOptions = {
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage'
            ]
        };

        // --- CORRECCIÓN DE LÓGICA DE PROXY ---
        if (proxy) {
            const proxyUrl = new URL(proxy);
            // ANTES: Pasábamos la URL completa y confusa.
            // AHORA: Pasamos SÓLO la IP y el PUERTO al navegador.
            launchOptions.args.push(`--proxy-server=${proxyUrl.host}`);
        }

        browser = await puppeteer.launch(launchOptions);
        const page = await browser.newPage();

        // DESPUÉS: La autenticación se maneja por separado y de forma limpia.
        if (proxy && proxy.includes('@')) {
            const proxyUrl = new URL(proxy);
            await page.authenticate({
                username: proxyUrl.username,
                password: proxyUrl.password
            });
        }
        
        if (headers && headers['User-Agent']) {
            await page.setUserAgent(headers['User-Agent']);
        }
        
        const response = await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 30000 }); // Aumentamos timeout por si acaso
        const duration = Date.now() - startTime;
        
        const status = response.status();

        if (status >= 200 && status < 400) {
            console.log(`[Éxito] ${targetUrl} visitado en ${duration}ms. Estado: ${status}`);
            return res.json({ success: true, status: status, duration, message: `Visita exitosa con navegador real.` });
        } else {
            console.log(`[Fallo de Objetivo] ${targetUrl} devolvió estado ${status}`);
            return res.status(400).json({ success: false, status: status, duration, message: `Error de servidor de destino: ${status}` });
        }

    } catch (error) {
        const duration = Date.now() - startTime;
        console.log(`[Fallo Crítico] Error al visitar ${targetUrl}: ${error.message}`);
        return res.status(500).json({ success: false, status: 'BROWSER_ERROR', duration, message: `Error de navegador/proxy: ${error.message.slice(0, 100)}` });
    } finally {
        if (browser) {
            await browser.close();
        }
    }
});

// La ruta de verificación no cambia
const axios = require('axios');
const { HttpsProxyAgent } = require('https-proxy-agent');
app.post('/verify-proxy', async (req, res) => {
    const { proxy } = req.body;
    console.log(`[Verificando Flota] Probando proxy: ${proxy}`);
    if (!proxy) return res.status(400).json({ success: false, proxy, message: 'No se proporcionó proxy.' });
    try {
        const agent = new HttpsProxyAgent(proxy);
        const response = await axios.get('https://httpbin.org/get', { httpsAgent: agent, proxy: false, timeout: 10000 });
        if (response.status === 200) res.json({ success: true, proxy });
        else res.json({ success: false, proxy, message: `Respuesta inesperada: ${response.status}` });
    } catch (error) {
        res.json({ success: false, proxy, message: `Fallo de conexión: ${error.message.slice(0, 100)}` });
    }
});

app.listen(PORT, () => {
    console.log(`Estación de Batalla v4.1 (Protocolo Corregido) operativa en el puerto ${PORT}`);
});