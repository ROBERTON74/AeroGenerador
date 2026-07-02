import { proxyGet } from '../_proxy.js';

export default async function handler(req, res) {
  await proxyGet(req, res, {
    baseUrl: 'https://apidatos.ree.es',
    headers: {
      Accept: 'application/json',
    },
    cacheSeconds: 300,
  });
}
