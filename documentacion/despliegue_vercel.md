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
