/** @type {import('tailwindcss').Config} */
export default {
  // Tailwind escanea el HTML y los componentes React para generar solo las clases usadas.
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
