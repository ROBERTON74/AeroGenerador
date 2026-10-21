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

Conexión GitHub–Vercel aceptada mediante `vercel git connect`. No se ha confirmado todavía un despliegue automático por push; la publicación actual se realizó con la CLI y está verificada. Esta autorización corresponde a esta entrega.

78 comprobaciones HTTPS correctas sobre la dirección pública, sin autenticación: portadas, ruta `/portal` y 75 archivos de ejecución. En navegador aislado a 390 px: portal con tres papers, cuatro rutas de visores bajo `/portal/assets/`, enlaces a la aplicación en `/` y sin desbordamiento horizontal. Evidencias locales en `respaldos/publicacion_2026-10-21/`.

Aplicación React pública verificada en navegador a 1440 px y 390 px: turbina y mar de Blender cargados, velocidad 0,75, siete métricas, sin excepciones JavaScript ni desbordamiento móvil. REData devuelve HTTP 200 y dato diario del 21 de octubre de 2026, identificado como respaldo público diario en el dashboard. ESIOS devuelve HTTP 403 por faltar la clave del servidor; el respaldo actúa correctamente. Captura revisada y resultado en `react-publico.json`.

### Corrección del respaldo REData durante la comprobación pública

La inspección de esa captura descubrió que el acumulado de energía diario se presentaba como MW. Se corrige `windDataService.js`: consulta únicamente días completos de Madrid, convierte MWh a potencia media dividiendo por la duración real del día (23, 24 o 25 horas) y distingue la media diaria de ESIOS en las etiquetas. Las tecnologías se suman para la misma fecha, excluyendo agregados compuestos. No se modifica ESIOS 551, los modelos, el mar ni el aspecto de la escena.

Prueba reproducible: `node scripts/verify_redata_units.mjs`. Verifica días de 23/24/25 horas, exclusión del día parcial, coherencia de potencia y factor de carga, fecha de consulta y conservación de MW de ESIOS. Las pruebas de análisis técnico siguen pasando. Referencia de parámetros y periodos: [documentación oficial REData](https://www.ree.es/es/datos/apidatos). La primera captura pública representa el estado anterior a esta corrección; conservarla como evidencia de la detección y generar una nueva para el resultado final.

Corrección subida a GitHub en `d534761`. Despliegue final `dpl_Hf4G6HmvMJxijDfaNayFyKGzkUHV`, estado `READY`, promovido expresamente al dominio público con `vercel promote`. Paquete React público final: `index-BQztGfVY.js`. La consulta real del respaldo corregido devuelve aproximadamente 5350,37 MW medios para el día completo 20/10/2026, con factor de carga 0,16889. Se conservan ESIOS, los modelos y el resto de la escena. Las capturas previas a la corrección se guardan con sufijo `antes-unidades`.

La revisión automática rechazó inicialmente transferir la clave local ESIOS al secreto del servidor Vercel porque exige autorización específica para esa clave y ese destino. El usuario la ha autorizado después expresamente: «Sí, guardar la clave en Vercel». Se configura `ESIOS_API_KEY` como **Secret** exclusivamente de Production en `roberton74s-projects/aerogenerador-robert`, mediante entrada estándar sin mostrar su valor. La clave no se incluye en GitHub ni en el bundle del navegador.

Nuevo despliegue `dpl_CQuTfUAiEDJEgqDcHZn4fF2Whfne`, estado `READY`, con alias público `https://aerogenerador-robert.vercel.app`. La ruta pública ESIOS devuelve HTTP 200, indicador 551 y dato de 4410 MW a las 15:55 del 21/10/2026 (Península). Evidencia sin credenciales: `respaldos/publicacion_2026-10-21/esios-servidor.json`. Se mantiene el respaldo REData corregido para interrupciones del proveedor.

Antes de preparar la subida se superaron 70 comprobaciones funcionales, 45 recursos y tres vídeos, y ambas compilaciones individuales. Se revisa de nuevo la compilación conjunta y la navegación bajo `/portal/`.

La selección de Git incluye fuentes, documentación y recursos de ejecución. Se excluyen los respaldos incrementales, exportaciones de trabajo, dependencias, perfiles de navegador, logs y archivos de entorno. Comprobación previa de 173 archivos preparados: sin coincidencias con las credenciales locales, sin archivos `.env` privados y sin archivos superiores a 100 MB.

La instalación del portal informa de cuatro avisos altos en herramientas de desarrollo (Angular CLI/build, MCP SDK y Vite). No se publica ningún servidor de desarrollo ni MCP; el portal se sirve como archivos estáticos. No se aplican los cambios mayores regresivos que propone `npm audit fix --force`. Se conserva el lockfile aprobado.
