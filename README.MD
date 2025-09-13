# 🌑 Oscuridad: Módulo de Misiones

Este proyecto es una aplicación web para orquestar y ejecutar "misiones" de visitas web automatizadas. Permite configurar y lanzar visitas masivas a una lista de URLs con opciones avanzadas como concurrencia, uso de proxies, suplantación de user-agents y referers.

---
## ✨ Características

*   **Interfaz Gráfica Completa**: Gestiona tus misiones desde una interfaz web intuitiva.
*   **Configuración Flexible**: Define URLs, número de visitas, concurrencia y reintentos.
*   **Modos de Ataque**: Elige entre un modo "Brutal" (máxima velocidad) o "Táctico" (con retrasos aleatorios para simular comportamiento humano).
*   **Evasión y Suplantación**: Utiliza listas de proxies, user-agents y referers para enmascarar el tráfico.
*   **Verificación de Proxies**: Comprueba la flota de proxies para descartar los que no funcionan.
*   **Gestión de Presets**: Guarda y carga configuraciones de misiones para reutilizarlas fácilmente.
*   **Historial de Misiones**: Revisa los resultados de misiones anteriores.
*   **Reportes y Logs**: Exporta los resultados de la misión y los logs detallados.

## 📋 Requisitos Previos

*   [Node.js](https://nodejs.org/) (v18+ recomendado, debido a las dependencias como Puppeteer).
*   `npm` (normalmente se instala junto con Node.js).

## 🚀 Puesta en Marcha

La aplicación consta de un **servidor** (backend) que ejecuta las visitas con Puppeteer y un **cliente** (frontend) que sirve como interfaz de control.

### 1. Iniciar el Servidor (Backend)

El servidor es el motor que ejecuta las visitas. Sigue estos pasos para ponerlo en marcha:

1.  Abre una terminal y navega hasta el directorio `server`:
    ```bash
    cd server
    ```

2.  Instala las dependencias del proyecto. Este paso solo es necesario la primera vez o si las dependencias cambian.
    ```bash
    npm install
    ```

3.  Inicia el servidor:
    ```bash
    npm start
    ```

4.  Si el inicio es correcto, verás un mensaje de confirmación en la consola:
    ```console
    > server@1.0.0 start
    > node server.js
    
    Estación de Batalla v4.1 (Protocolo Corregido) operativa en el puerto 3000
    ```

### 2. Abrir el Cliente (Frontend)

El cliente es la interfaz web desde donde controlarás las misiones.

1.  Navega al directorio raíz del proyecto.
2.  Abre el archivo `index.html` en tu navegador web preferido (por ejemplo, haciendo doble clic sobre él).

¡Listo! Ahora puedes configurar y ejecutar tus misiones desde la interfaz del "Módulo Imperial".

## 📚 Datos de Ejemplo para Configuración

Aquí tienes listas de ejemplo que puedes copiar y pegar en la aplicación para empezar rápidamente.

<details>
<summary>📋 Lista de Referrers</summary>

```
https://www.google.com/
https://t.co/
https://www.facebook.com/
https://www.bing.com/
https://www.linkedin.com/
https://www.pinterest.com/
https://www.youtube.com/
https://www.instagram.com/
https://www.reddit.com/
https://es.wikipedia.org/
https://www.yahoo.com/
https://www.tumblr.com/
https://www.tiktok.com/
https://www.medium.com/
https://es.quora.com/
https://www.forbes.com/
https://www.bbc.com/
https://www.theguardian.com/
https://www.nytimes.com/
https://www.cnn.com/
https://www.cnet.com/
https://www.stackoverflow.com/
https://www.github.com/
https://bitly.com/
https://www.pinterest.es/
https://es.slideshare.net/
https://www.amazon.com/
https://www.ebay.com/
https://www.vimeo.com/
https://www.dailymotion.com/
https://www.twitch.tv/
https://www.elconfidencial.com/
https://www.elmundo.es/
https://elpais.com/
https://www.huffingtonpost.es/
https://www.bbc.co.uk/
https://www.forosdecoches.com/
https://www.mercadolibre.com/
https://www.rtve.es/
https://www.googleads.g.doubleclick.net/
https://duckduckgo.com/
https://yandex.com/
https://www.bing.es/
https://www.aliexpress.com/
https://www.yelp.com/
https://www.tripadvisor.es/
https://www.forocoches.com/
https://www.nationalgeographic.com/
https://www.abc.es/
```

</details>

<details>
<summary>🎭 Lista de User-Agents</summary>

```
Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36
Mozilla/5.0 (iPhone; CPU iPhone OS 16_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.3 Mobile/15E148 Safari/604.1
Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36
Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36
Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:108.0) Gecko/20100101 Firefox/108.0
Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:108.0) Gecko/20100101 Firefox/108.0
Mozilla/5.0 (X11; Linux i686; rv:108.0) Gecko/20100101 Firefox/108.0
Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Edge/108.0.1462.64
Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Opera/94.0.4606.19
Mozilla/5.0 (iPad; CPU OS 16_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.3 Mobile/15E148 Safari/604.1
Mozilla/5.0 (Android 13; Mobile; rv:108.0) Gecko/108.0 Firefox/108.0
Mozilla/5.0 (Android 13; Tablet; rv:108.0) Gecko/108.0 Firefox/108.0
Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.5359.128 Mobile Safari/537.36
Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.5359.128 Tablet Safari/537.36
Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; AS; rv:11.0) like Gecko
Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; rv:11.0) like Gecko
Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:108.0) Gecko/20100101 Firefox/108.0
Mozilla/5.0 (PlayStation 4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36
Mozilla/5.0 (Nintendo Switch; WifiWebAuthApp) AppleWebKit/601.6 (KHTML, like Gecko) NintendoBrowser/5.1.0.22349 Mobile Safari/537.36
Mozilla/5.0 (Linux; Android 10; SM-A205U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Mobile Safari/537.36
Mozilla/5.0 (Linux; Android 11; SM-G960F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Mobile Safari/537.36
Mozilla/5.0 (Linux; Android 12; Pixel 6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.87 Mobile Safari/537.36
Mozilla/5.0 (Linux; Android 9; LLD-L31) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.162 Mobile Safari/537.36
Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36
Mozilla/5.0 (Linux; Android 10; SM-G973U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Mobile Safari/537.36
Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.111 Safari/537.36
Mozilla/5.0 (Windows NT 6.2; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36
Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36
Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.2 Safari/605.1.15
Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Safari/605.1.15
Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1 Safari/605.1.15
Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:78.0) Gecko/20100101 Firefox/78.0
Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36 Edge/98.0.1108.56
Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36 OPR/94.0.0.0
Mozilla/5.0 (iPhone; CPU iPhone OS 15_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.6 Mobile/15E148 Safari/604.1
Mozilla/5.0 (Android 10; Mobile; rv:99.0) Gecko/99.0 Firefox/99.0
Mozilla/5.0 (Linux; Android 11; VIVO 1920) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.85 Mobile Safari/537.36
Mozilla/5.0 (Linux; Android 10; SM-N975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.85 Mobile Safari/537.36
Mozilla/5.0 (Linux; Android 12; M2101K6G) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Mobile Safari/537.36
Mozilla/5.0 (Linux; Android 9; SM-G950U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.136 Mobile Safari/537.36
Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:89.0) Gecko/20100101 Firefox/89.0
Mozilla/5.0 (X11; Fedora; Linux x86_64; rv:95.0) Gecko/20100101 Firefox/95.0
Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.0.0 Mobile Safari/537.36
Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/95.0.4638.50 Mobile/15E148 Safari/604.1
Mozilla/5.0 (Windows Phone 10.0; Android 4.2.1; Microsoft; Lumia 950) AppleWebKit/537.36 (KHTML, like Gecko) Edge/15.15063
Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)
Mozilla/5.0 (compatible; Bingbot/2.0; +http://www.bing.com/bingbot.htm)
Mozilla/5.0 (compatible; Yahoo! Slurp/3.0; +http://help.yahoo.com/help/us/slurp)
Mozilla/5.0 (iPad; CPU OS 15_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.2 Mobile/15E148 Safari/604.1
Mozilla/5.0 (iPhone; CPU iPhone OS 15_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.2 Mobile/15E148 Safari/604.1
```

</details>

## 📝 Recursos y Notas Adicionales

*   **Pruebas de Peticiones**: Para verificar que las visitas se están registrando correctamente, puedes usar un servicio como Beeceptor. Crea un endpoint gratuito y úsalo como URL objetivo.
    *   Ejemplo: `https://app.beeceptor.com/console/mis-visitas-prueba-free`

*   **Proxies de Calidad**: Para misiones más serias, considera usar servicios de proxy de pago como Webshare para obtener IPs más fiables y rápidas.
