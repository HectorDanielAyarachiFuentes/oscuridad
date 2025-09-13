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


### Salida de la Consola

```bash
PS C:\Users\Ramoncito\Documents\GitHub\oscuridad> cd server
PS C:\Users\Ramoncito\Documents\GitHub\oscuridad\server> npm start
>>

> server@1.0.0 start
> node server.js