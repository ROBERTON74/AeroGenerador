# Despliegue en Vercel

Fecha: 2026-07-02

## Repositorio

```text
https://github.com/ROBERTON74/AeroGenerador.git
```

Rama:

```text
main
```

Commit preparado para Vercel:

```text
d285d17 - Prepare Vercel deployment with rollback notes
```

Commit de documentacion:

```text
1c968f6 - Document Vercel deployment steps
```

## Despliegue creado

Fecha/hora local: 2026-07-02 14:26 CEST

Proyecto Vercel:

```text
roberton74s-projects/aerogenerador-robert
```

URL publica:

```text
https://aerogenerador-robert.vercel.app
```

Deployment id:

```text
dpl_746xBqBvZLgQGTfqX569c1JRf2Vf
```

URL de inspeccion:

```text
https://vercel.com/roberton74s-projects/aerogenerador-robert/746xBqBvZLgQGTfqX569c1JRf2Vf
```

Estado:

```text
Ready
```

Nota: el despliegue manual funciono. La CLI no pudo conectar automaticamente el repositorio GitHub al proyecto Vercel. Para despliegues automaticos desde `main`, conectar el repositorio desde el panel web de Vercel en `Settings > Git`.

## Configuracion recomendada en Vercel

Framework:

```text
Vite
```

Build command:

```text
npm run build
```

Output directory:

```text
dist
```

Install command:

```text
npm install
```

## Variable de entorno

En `Settings > Environment Variables`:

```text
ESIOS_API_KEY=tu_token_personal_de_esios
```

No poner el token dentro del codigo.

Estado actual: pendiente de configurar en Vercel. Sin esta variable, ESIOS puede fallar y la app usara el respaldo/simulacion.

## Nota tecnica de rutas

No usar un rewrite global `/:path* -> /index.html`, porque en Vercel puede capturar tambien `/api/...` y bloquear las funciones serverless.

Las API se publican como funciones simples:

```text
api/esios.js
api/ree.js
api/open-meteo.js
```

Los rewrites pasan el path original como query `path`.

## Pasos

1. Entrar en Vercel.
2. Pulsar `Add New Project`.
3. Importar `ROBERTON74/AeroGenerador`.
4. Revisar que Vercel detecta `Vite`.
5. Poner la variable `ESIOS_API_KEY`.
6. Pulsar `Deploy`.
7. Abrir la URL final en movil y ordenador.

## Comprobacion despues del despliegue

- La web abre con HTTPS.
- El aerogenerador aparece en el mar.
- El dashboard no se corta en movil.
- Los paneles `Modelo` y `Mecanica` abren.
- Si ESIOS falla, la app debe seguir usando simulacion local/respaldo.

## Si algo falla

Usar:

```text
documentacion/rollback_vercel.md
```
