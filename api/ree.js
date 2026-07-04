import { proxyGet } from './_proxy.js';

export default async function handler(req, res) {
  // Proxy publico de REData usado como respaldo cuando ESIOS no responde o no tiene token.
  await proxyGet(req, res, {
    baseUrl: 'https://apidatos.ree.es',
    headers: {
      Accept: 'application/json',
    },
    cacheSeconds: 300,
  });
}
