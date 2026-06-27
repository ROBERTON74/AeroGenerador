import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      port: 5177,
      strictPort: true,
      proxy: {
        '/ree-api': {
          target: 'https://apidatos.ree.es',
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/ree-api/, ''),
        },
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
