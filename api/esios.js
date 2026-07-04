import { proxyGet } from './_proxy.js';

export default async function handler(req, res) {
  // Proxy de ESIOS: mantiene el token en Vercel y evita exponerlo en el navegador.
  const apiKey = process.env.ESIOS_API_KEY ?? process.env.VITE_ESIOS_API_KEY;

  await proxyGet(req, res, {
    baseUrl: 'https://api.esios.ree.es',
    headers: {
      Accept: 'application/json; application/vnd.esios-api-v1+json',
      'Content-Type': 'application/json',
      ...(apiKey ? { 'x-api-key': apiKey } : {}),
    },
    cacheSeconds: 60,
  });
}
