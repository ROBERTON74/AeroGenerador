# Publicación conjunta · 21 de octubre de 2026

El usuario autoriza expresamente subir el trabajo a GitHub y Vercel para abrirlo desde ordenador y móvil. Esta petición resuelve las restricciones anteriores de no publicar.

Se integra una copia del portal Angular en `portal/`, sin cambiar el proyecto local hermano. React conserva `/` y el portal usa `/portal/`. Los dos enlaces del portal a la aplicación apuntan a `/` en producción y mantienen el puerto 5177 cuando el portal se ejecuta en el puerto local 4200. Modelos, materiales, animaciones, océano, vídeos, papers y atribuciones se conservan.

`npm run build:all` compila React y Angular y reúne el resultado en `dist/`. Vercel instala ambos proyectos con sus lockfiles y ejecuta esta compilación. Se mantienen las funciones ESIOS/REData y sus rutas. La clave ESIOS debe existir únicamente como variable del servidor `ESIOS_API_KEY`; no se introduce en los archivos públicos ni en el bundle.

Repositorio de destino: https://github.com/ROBERTON74/AeroGenerador. Proyecto Vercel existente: `roberton74s-projects/aerogenerador-robert`. El estado efectivo y las URLs se registrarán al terminar la publicación.

## Publicación verificada

Entrega subida a `main` en GitHub: commit `e42223e8cff9c1fb181cae4452b63c7f36003b9e`. Vercel confirma `READY` para `dpl_Arw62BMsbYRZihy29bUjqJL291L5`, con ambas compilaciones ejecutadas correctamente en Linux.

- Aplicación 3D: https://aerogenerador-robert.vercel.app/
- Portal completo: https://aerogenerador-robert.vercel.app/portal/
- Repositorio: https://github.com/ROBERTON74/AeroGenerador

Conexión GitHub–Vercel realizada correctamente mediante `vercel git connect`: los siguientes pushes al repositorio disparan el despliegue. Sin cambios en las restricciones de publicación de trabajos futuros: esta autorización corresponde a esta entrega.

78 comprobaciones HTTPS correctas sobre la dirección pública, sin autenticación: portadas, ruta `/portal` y 75 archivos de ejecución. En navegador aislado a 390 px: portal con tres papers, cuatro rutas de visores bajo `/portal/assets/`, enlaces a la aplicación en `/` y sin desbordamiento horizontal. Evidencias locales en `respaldos/publicacion_2026-10-21/`.

La revisión automática rechazó transferir la clave local ESIOS al secreto del servidor Vercel porque exige autorización específica para esa clave y ese destino. Se pidió esa autorización al usuario; no se envió la clave ni se incluyó en GitHub. La publicación mantiene la cadena de respaldo existente (REData público y simulación identificada si los proveedores fallan). Cuando el usuario lo autorice expresamente, configurar únicamente `ESIOS_API_KEY` como secreto de Vercel y volver a desplegar.

Antes de preparar la subida se superaron 70 comprobaciones funcionales, 45 recursos y tres vídeos, y ambas compilaciones individuales. Se revisa de nuevo la compilación conjunta y la navegación bajo `/portal/`.

La selección de Git incluye fuentes, documentación y recursos de ejecución. Se excluyen los respaldos incrementales, exportaciones de trabajo, dependencias, perfiles de navegador, logs y archivos de entorno. Comprobación previa de 173 archivos preparados: sin coincidencias con las credenciales locales, sin archivos `.env` privados y sin archivos superiores a 100 MB.

La instalación del portal informa de cuatro avisos altos en herramientas de desarrollo (Angular CLI/build, MCP SDK y Vite). No se publica ningún servidor de desarrollo ni MCP; el portal se sirve como archivos estáticos. No se aplican los cambios mayores regresivos que propone `npm audit fix --force`. Se conserva el lockfile aprobado.
