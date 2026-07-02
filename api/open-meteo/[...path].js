import { proxyGet } from '../_proxy.js';

export default async function handler(req, res) {
  await proxyGet(req, res, {
    baseUrl: 'https://api.open-meteo.com',
    headers: {
      Accept: 'application/json',
    },
    cacheSeconds: 300,
  });
}
