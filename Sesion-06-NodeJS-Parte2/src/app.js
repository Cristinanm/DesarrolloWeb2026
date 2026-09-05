import { createReadStream, createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import { Readable } from 'node:stream';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

// __dirname y __filename reproducidos con import.meta.url (ES Modules)
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);


/**
 * Crea un id único.
 * @returns {string}
 */
export function generarId() {
    return `r-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}


/**
 * Filtra las líneas de un archivo de log que contienen un texto y
 */
export async function filtrarLogs(origen, destino, texto) {
    let contador = 0;
    let pendiente = "";

    const entrada = createReadStream(origen, { encoding: "utf-8" });

    async function* filtrar(fuente) {
        for await (const chunk of fuente) {
            pendiente += chunk;
            const lineas = pendiente.split("\n");
            pendiente = lineas.pop();

            for (const linea of lineas) {

                if(linea.includes(texto)){
                    contador++;
                    yield linea + "\n";
                }
            }
        }

        if (pendiente.includes(texto)) {
            contador++;
            yield pendiente + "\n";
        }
    }

    const salida = createWriteStream(destino, { encoding: "utf-8" });
    await pipeline(entrada, filtrar ,salida);
    return contador;
}

/**
 * Lee un archivo de texto y devuelve las líneas como arreglo,
 */

export async function leerLineas(ruta) {
    const archivo = createReadStream(ruta, {encoding:'utf-8'});

  let contenido = '';
  const stream = Readable.from(archivo);

  for await (const chunk of stream){
    contenido += chunk;
  }

  return contenido
    .split('\n')
    .map(linea => linea.trim())
    .filter(linea => linea.length > 0);
}

/**
 * Devuelve una ruta absoluta a partir de una ruta relativa al proyecto.
 */
export function rutaAbsoluta(rutaRelativa) {
    return join(__dirname, rutaRelativa);

}

/**
 * Parsea el contenido de un archivo de configuración ".env" (simple).
 */
export function parsearEnv(contenido) {
    const resultado = {};

    const lineas = contenido.split('\n');

    for (const linea of lineas) {
        const lineaLimpia = linea.trim();

        if (lineaLimpia === '' || lineaLimpia.startsWith('#')) {
            continue;
        }

        const [clave, valor] = lineaLimpia.split('=');

        resultado[clave.toUpperCase()] = valor;
    }

    return resultado;
}