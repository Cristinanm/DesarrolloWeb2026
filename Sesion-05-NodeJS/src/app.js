

import http from 'node:http';
import { EventEmitter } from 'node:events';
import os from 'node:os';
import path from 'node:path';
import fs from 'node:fs/promises';
import { url } from 'node:inspector';


export function generarId() {
    return `m-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

/**
 * Lee el body (cuerpo) de una petición HTTP como string.
 */
function leerBody(req) {
    return new Promise((resolve, reject) => {
        let data = '';
        req.on('data', (chunk) => (data += chunk));
        req.on('end', () => resolve(data));
        req.on('error', reject);
    });
}

//Parsea los argumentos de la línea de comandos (process.argv).
export function parsearArgumentos(argv) {
    const args = argv.slice(2);

    let nombre= "invitado";
    let puerto = 3000;

    const IndiceNombre = args.findIndex(args => args === "--nombre");
    const IndicePuerto = args.findIndex(args => args === "--puerto");

    if(IndiceNombre !== -1){
        nombre = args[IndiceNombre +1];
    }
    if(IndicePuerto !== -1){
        puerto = Number(args[IndicePuerto + 1]);
    }

    return {
        nombre, puerto
    };
    
}

// Construye la configuración de la app a partir de variables de entorno.

export function obtenerConfig(env) {
    const puerto = env.PORT ? Number(env.PORT) : 3000;
    const nombreApp = env.NOMBRE_APP ? env.NOMBRE_APP : "mensajes-api";
    const archivoDatos = env.ARCHIVO_DATOS ? env.ARCHIVO_DATOS : "data/mensajes.json";

    return {
        puerto,
        nombreApp,
        archivoDatos
    };
}

/**
 * Devuelve información del sistema usando el módulo os.
 */
export function infoSistema() {
    const plataforma =  os.platform(); 
    const nucleos= os.cpus().length;
    const memoriaLibreMB = Math.round(os.freemem() / 1024 / 1024);
    const hostname = os.hostname();

    return{
        plataforma,
        nucleos,
        memoriaLibreMB,
        hostname
    };
}

/**
 * Crea un logger basado en EventEmitter.
 */
export function crearLogger() {
    const emitter = new EventEmitter();

    function registrar(mensaje){
        const linea = `[${new Date().toISOString()}] ${mensaje}`;
        emitter.emit("registro", linea)

    }

    function onRegistro(fn){
        emitter.on("registro", fn)
    }

    return{
        registrar,
        onRegistro
    }

    logger.registrar("hola");
    
}

/**
 * Lee el arreglo de mensajes desde un archivo JSON.
 */
export async function leerMensajes(archivoDatos) {
    try{

        const texto = await fs.readFile(archivoDatos, "utf-8");
        const datos = JSON.parse(texto)

        const EsArreglo = Array.isArray(datos)

        if(EsArreglo === true){
            return datos;
        }
        else 
        {
            return[];
        }

    }
    catch (error){
        return []
    }
    
}

/**
 * Agrega un mensaje al archivo y lo devuelve.
 */
export async function agregarMensaje(archivoDatos, texto) {
    if (texto.trim() === "") {
        return null;
    }

    const mensajes = await leerMensajes(archivoDatos);

    const newMensaje ={
        id: Date.now().toString(),
        texto,
        fecha: new Date().toISOString()
    };

    mensajes.push(newMensaje);
    const directorio = path.dirname(archivoDatos);
    await fs.mkdir(directorio, { recursive: true });

    await fs.writeFile(
    archivoDatos,
    JSON.stringify(mensajes, null, 2),
    "utf-8"
);

return newMensaje;

}

/**
 * Crea un servidor HTTP
 */
export function crearServidor(config = {}) {
    const archivoDatos = config.archivoDatos || "data/mensajes.json";
    const nombreApp = config.nombreApp || "mensajes-api";
    const logger = config.logger || crearLogger();

    const server = http.createServer(async (req, res) => {
        const metodo = req.method;
        const ruta = req.url;

        logger.registrar(`${metodo} ${ruta}`);

        if (metodo === "GET" && ruta === "/") {
            const respuesta = {
                mensaje: nombreApp,
                hora: new Date().toISOString(),
                sistema: infoSistema()
            };

            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(respuesta));
            return;
        }

        if (metodo === "GET" && ruta === "/mensajes") {
            const mensajes = await leerMensajes(archivoDatos);

            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(mensajes));
            return;
        }

        if (metodo === "POST" && ruta === "/mensajes") {
            try {
                let cuerpo = "";

                for await (const chunk of req) {
                    cuerpo += chunk;
                }

                const datos = JSON.parse(cuerpo || "{}");

                if (!datos.texto || datos.texto.trim() === "") {
                    res.statusCode = 400;
                    res.setHeader("Content-Type", "application/json");
                    res.end(JSON.stringify({
                        error: "El texto es obligatorio"
                    }));
                    return;
                }

                const nuevoMensaje = await agregarMensaje(
                    archivoDatos,
                    datos.texto
                );

                res.statusCode = 201;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify(nuevoMensaje));
                return;

            } catch (error) {
                res.statusCode = 500;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({
                    error: "Error interno del servidor"
                }));
                return;
            }
        }

        res.statusCode = 404;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({
            error: "Ruta no encontrada"
        }));
    });

    return server;
}

/**
 * Crea y arranca el servidor en el puerto indicado por config.puerto.
 */
export function iniciarServidor(config = {}) {

    const puerto = config.puerto || 3000;
    const logger = config.logger || crearLogger();

    const server = crearServidor({
        ...config,
        logger
    });

    server.listen(puerto, () => {
        logger.registrar(`Servidor en http://localhost:${puerto}`);
    });

    return server;
}

