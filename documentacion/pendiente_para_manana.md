# Estado actual y pendientes

Proyecto: **AeroGenerador**
Autor: **Robert Jesus Melendez Nunez**
Destino academico: **Departamento de Robotica de la Universidad Complutense de Madrid**
Ultima revision: **2026-07-04**

## Estado actual del proyecto

La aplicacion ya esta preparada como prototipo academico web y esta subida a GitHub.

Repositorio:

```text
https://github.com/ROBERTON74/AeroGenerador.git
```

Rama principal:

```text
main
```

URL publica:

```text
https://aerogenerador-robert.vercel.app
```

## Lo que ya esta hecho

- Aplicacion Vite / React / Three.js funcionando.
- Escena principal offshore con aerogenerador en el mar.
- Mar animado, espuma, barco y turbinas de fondo.
- Dashboard SCADA con datos de ESIOS/REData y metricas derivadas.
- Paneles `Modelo` y `Mecanica` documentados.
- Responsive revisado para escritorio, tablet y movil.
- Dashboard movil minimizado mostrando la escena del mar por detras.
- Build comprobada con `npm run build`.
- Despliegue en Vercel documentado.
- Rollback de Vercel documentado.
- Documentacion principal agrupada en `documentacion/`.
- Imagen anotada del dashboard en `documentacion/assets/dashboard_anotado_flechas.png`.

## Archivos que no se deben subir

No subir nunca:

- `.env`
- `.env - copia.robert`
- `node_modules/`
- `dist/`
- archivos `.blend1`
- logs temporales
- tokens personales

El archivo permitido para explicar variables es:

```text
.env.example
```

Ese archivo solo debe contener ejemplos, nunca el token real.

## Pendientes reales antes de entregar

### 1. Revisar la web publica

Abrir:

```text
https://aerogenerador-robert.vercel.app
```

Comprobar:

- La web abre en ordenador.
- La web abre en movil.
- El aerogenerador aparece en el mar.
- El mar se ve animado y no como cristal fijo.
- Las aspas giran.
- El dashboard se puede minimizar.
- En movil, al minimizar el dashboard, se ve el mar de la escena.
- Los paneles `Modelo` y `Mecanica` abren correctamente.

### 2. Revisar la app en local

Ejecutar:

```bash
npm install
npm run dev
```

Abrir:

```text
http://localhost:5177/
```

Comprobar lo mismo que en produccion.

### 3. Revisar datos reales

Si se quiere usar ESIOS en local, crear `.env` con:

```bash
VITE_ESIOS_API_KEY=token_personal
```

Si se quiere usar ESIOS en Vercel, configurar en el panel de Vercel:

```text
ESIOS_API_KEY=token_personal
```

Si ESIOS no esta configurado, la app puede seguir funcionando con REData o simulacion local.

### 4. Preparar entrega para tutor

Enviar o presentar:

- URL publica de Vercel.
- Enlace al repositorio GitHub.
- Carpeta `documentacion/`.
- Documento `resumen_para_tutor.md`.
- Documento `explicacion_dashboard_esios_modelos_matematicos.md`.
- Documento `manual_tecnico_codigo_mantenimiento.md`.
- Documento `despliegue_vercel.md`.
- Documento `rollback_vercel.md`.

## Comando rapido de comprobacion

Antes de entregar, ejecutar:

```bash
npm run build
git status
```

Resultado esperado:

```text
Build correcta
Git sin cambios pendientes, salvo cambios nuevos de documentacion que se quieran confirmar
```

## Nota de rollback

Si algo falla en la version publica, revisar:

```text
documentacion/rollback_vercel.md
```

El punto base antes de preparar Vercel quedo registrado como:

```text
a948b1d
```

El ultimo commit documentado de despliegue responsive fue:

```text
674e9cb Show full sea scene when mobile dashboard is collapsed
```

**Autor:** Robert Jesus Melendez Nunez
