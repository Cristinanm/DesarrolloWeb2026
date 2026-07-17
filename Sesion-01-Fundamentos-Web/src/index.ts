/**
 * HTTP Inspector CLI
 *
 * Tarea de la Sesión 1: Fundamentos de la Web
 *
 * Esta tarea NO usa la red, ni async/await, ni librerías externas.
 * Solo la biblioteca estándar de Node + tipos básicos de TypeScript.
 *
 * Idea: aplicar lo que aprendiste sobre HTTP (URLs, métodos, códigos
 * de estado y cabeceras) implementando pequeñas funciones puras.
 */

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

/** Resultado de analizar una URL. */
export interface UrlParts {
  /** Protocolo tal como lo devuelve la WHATWG URL, p. ej. "https:". */
  protocol: string;
  /** Host (puede incluir puerto), p. ej. "api.ejemplo.com:443". */
  host: string;
  /** Ruta, p. ej. "/users". */
  pathname: string;
  /** Query string con el "?" inicial, p. ej. "?id=1&name=Ana". */
  search: string;
  /** Lista de pares [clave, valor] de los query params. */
  query: Array<[string, string]>;
}

/** Categoría de un código de estado HTTP. */
export type StatusCategory =
  | "1xx Informativo"
  | "2xx Éxito"
  | "3xx Redirección"
  | "4xx Error del cliente"
  | "5xx Error del servidor"
  | "Desconocido";

/** Mapa de cabeceras HTTP. */
export type Headers = Record<string, string>;

// ---------------------------------------------------------------------------
// Funciones a implementar
// ---------------------------------------------------------------------------

/**
 * Analiza una URL y devuelve sus componentes principales.
 * @param url URL que se desea analizar.
 * @returns Un objeto con protocolo, host, ruta, búsqueda y parámetros.
 * @throws {TypeError} Si la URL proporcionada no es válida.
 */
export function parseUrl(url: string): UrlParts {
  const u = new URL(url);
  return {
    protocol: u.protocol,
    host: u.host,
    pathname: u.pathname,
    search: u.search,
    query: Array.from(u.searchParams.entries()),
  };
}

/**
 * Clasifica un código de estado HTTP según su categoría.
 * @param code Código de estado HTTP.
 * @returns La categoría correspondiente o "Desconocido".
 */
 
export function classifyStatus(code: number): StatusCategory {
  if (code >= 100 && code < 200) {
    return "1xx Informativo";
  }else if (code >= 200 && code < 300){
    return "2xx Éxito";
  }else if(code >=300 && code <400){
    return "3xx Redirección";
  }else if(code >=400 && code <500){
    return "4xx Error del cliente";
  }else if(code >=500 && code <600){
    return "5xx Error del servidor";
  }else{
    return "Desconocido";
  }
}

/**
 * Convierte un texto de cabeceras HTTP en un objeto clave-valor.
 * @param text Texto con una cabecera por línea.
 * @returns Un objeto con los nombres y valores de las cabeceras válidas.
 */

export function parseHeaders(text: string): Headers {
  const headers: Headers = {};
  const lineas = text.split("\n");
  for (const linea of lineas) {
    const lineasinespacios = linea.trim();
    if (lineasinespacios && lineasinespacios.includes(":")) {
      const partes = lineasinespacios.split(":");
      const nombre = partes[0].trim();
      const valor = partes[1].trim();

      headers[nombre] = valor;
    }
  }

  return headers;
}

/**
 * Genera un resumen legible de una petición HTTP.
 * @param url URL completa de la petición.
 * @param status Código de estado HTTP.
 * @param headersText Cabeceras HTTP en formato de texto.
 * @returns Un resumen que incluye la URL, el estado y las cabeceras.
 */
export function summarizeRequest(
  url: string,
  status: number,
  headersText: string,
): string {
  const urlAnalizada = parseUrl(url);
  const estadoClasificado = classifyStatus(status);
  const headers = parseHeaders(headersText);
  return `Resumen de la petición HTTP: 
  URL: ${url}
  Host: ${urlAnalizada.host}
  Numero de Estado: ${status}
  Estado: ${estadoClasificado}
  Headers: ${JSON.stringify(headers, null, 2)}`;
}

// ---------------------------------------------------------------------------
// CLI (opcional, pero recomendado para probar manualmente)
// ---------------------------------------------------------------------------

if (require.main === module) {
  const [, , cmd, ...args] = process.argv;
  try {
    if (cmd === "parse-url" && args[0]) {
      const parts = parseUrl(args[0]);
      console.log(JSON.stringify(parts, null, 2));
    } else if (cmd === "status" && args[0]) {
      const cat = classifyStatus(Number(args[0]));
      console.log(cat);
    } else if (cmd === "headers" && args.length > 0) {
      const h = parseHeaders(args.join(" "));
      console.log(JSON.stringify(h, null, 2));
    } else if (cmd === "summary" && args.length >= 2) {
      const [url, status, ...rest] = args;
      console.log(summarizeRequest(url, Number(status), rest.join(" ")));
    } else {
      console.log("Uso:");
      console.log('  npm start parse-url "https://ejemplo.com/path?a=1"');
      console.log("  npm start status 404");
      console.log('  npm start headers "Content-Type: application/json"');
      console.log('  npm start summary "https://x.com" 200 "Content-Type: application/json"');
    }
  } catch (e) {
    console.error("Error:", (e as Error).message);
    process.exit(1);
  }
}
