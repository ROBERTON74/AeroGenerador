# Progreso final de despliegue y responsive

Fecha: 2026-07-03

## Objetivo de esta fase

Dejar la aplicacion **AeroGenerador** preparada para abrirse desde cualquier dispositivo habitual:

- ordenador de escritorio
- portatil
- tablet
- movil

Tambien dejar registrado el despliegue publico, los cambios tecnicos y el procedimiento de rollback.

## URL publica

```text
https://aerogenerador-robert.vercel.app
```

Esta URL esta alojada en Vercel y no depende de que el Mac mini este encendido.

## Commits principales de esta fase

```text
d285d17 Prepare Vercel deployment with rollback notes
1c968f6 Document Vercel deployment steps
1a6c3f5 Fix Vercel API rewrites
2b09aef Use simple Vercel API proxy functions
72530e4 Record verified Vercel deployment
c05e567 Improve narrow mobile dashboard controls
674e9cb Show full sea scene when mobile dashboard is collapsed
```

## Cambios de despliegue

Se preparo el proyecto para Vercel con:

- `vercel.json`
- `api/_proxy.js`
- `api/esios.js`
- `api/ree.js`
- `api/open-meteo.js`

La aplicacion sigue usando rutas internas conocidas:

```text
/ree-api
/esios-api
/open-meteo-api
```

En local, esas rutas las resuelve Vite mediante `vite.config.js`.

En Vercel, esas rutas se reescriben hacia funciones serverless:

```text
/ree-api/:path* -> /api/ree?path=:path*
/esios-api/:path* -> /api/esios?path=:path*
/open-meteo-api/:path* -> /api/open-meteo?path=:path*
```

## Por que se usaron funciones simples

Primero se intento usar funciones tipo catch-all con carpetas:

```text
api/ree/[...path].js
api/esios/[...path].js
api/open-meteo/[...path].js
```

En el despliegue real, esas rutas no respondian como se esperaba y devolvian `404`.

La solucion estable fue usar funciones simples:

```text
api/ree.js
api/esios.js
api/open-meteo.js
```

El path real se pasa por query con `path`.

## Datos y APIs

### REData

REData funciona como respaldo publico sin token.

Comprobacion realizada:

```text
/ree-api/... -> HTTP 200 con JSON real
```

### ESIOS

ESIOS queda preparado para produccion mediante variable de entorno:

```text
ESIOS_API_KEY=tu_token_personal_de_esios
```

Esta variable debe configurarse en Vercel, no escribirse en el codigo.

Si no existe `ESIOS_API_KEY`, la app puede usar REData o simulacion local como respaldo.

## Cambios responsive

Se ajusto `src/styles/index.css` para mejorar:

- pantallas de escritorio
- tablets
- moviles
- ventanas estrechas
- zonas seguras de iPhone mediante `env(safe-area-inset-*)`
- scroll interno del dashboard movil
- boton de minimizar en pantallas pequenas

## Comportamiento movil del dashboard

El dashboard en movil funciona como un panel inferior con scroll interno.

Cuando se pulsa `Minimizar`:

- el dashboard baja
- su fondo se vuelve transparente
- no queda una franja verde/oscura sobre la escena
- la escena 3D ocupa toda la pantalla
- se ve el mar animado por detras
- queda solo el boton para volver a subir el dashboard

Regla clave:

```css
.app-shell:has(.dashboard.collapsed) .scene-wrap {
  inset: 0;
}
```

## Verificaciones realizadas

### Build local

```bash
npm run build
```

Resultado:

```text
Build correcta
```

El aviso de bundle grande es esperado por el uso de Three.js.

### Produccion Vercel

```text
https://aerogenerador-robert.vercel.app -> HTTP 200
```

### API REData por Vercel

Consulta `GET` real:

```text
/ree-api/es/datos/generacion/estructura-generacion?... -> HTTP 200
```

Nota: una prueba `HEAD` puede devolver error porque el servicio externo no se comporta igual que con `GET`. La app usa `GET`.

### Capturas visuales

Se revisaron capturas en:

- escritorio
- tablet
- movil
- movil con dashboard minimizado

Estado final visual:

```text
Correcto
```

## Estado final

```text
GitHub sincronizado
Vercel desplegado
URL publica activa
Responsive movil/escritorio revisado
Rollback documentado
```

## Rollback

Documento principal:

```text
documentacion/rollback_vercel.md
```

Punto base antes de preparar Vercel:

```text
a948b1d
```

Ultimo commit de esta fase:

```text
674e9cb Show full sea scene when mobile dashboard is collapsed
```
