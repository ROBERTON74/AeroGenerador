import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Carga variables .env locales, incluida VITE_ESIOS_API_KEY si Robert quiere usar ESIOS en desarrollo.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      // Puerto fijo para que la documentacion y las pruebas siempre apunten al mismo localhost.
      host: '0.0.0.0',
      port: 5177,
      strictPort: true,
      proxy: {
        // Proxy local hacia REData: evita problemas CORS durante desarrollo.
        '/ree-api': {
          target: 'https://apidatos.ree.es',
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/ree-api/, ''),
        },
        // Proxy local hacia ESIOS: adjunta la API key si existe en .env.
        '/esios-api': {
          target: 'https://api.esios.ree.es',
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/esios-api/, ''),
          headers: env.VITE_ESIOS_API_KEY
            ? {
                Accept: 'application/json; application/vnd.esios-api-v1+json',
                'Content-Type': 'application/json',
                'x-api-key': env.VITE_ESIOS_API_KEY,
              }
            : {
                Accept: 'application/json; application/vnd.esios-api-v1+json',
                'Content-Type': 'application/json',
              },
        },
        // Proxy reservado para meteorologia opcional y futuras ampliaciones.
        '/open-meteo-api': {
          target: 'https://api.open-meteo.com',
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/open-meteo-api/, ''),
        },
      },
    },
  };
});
