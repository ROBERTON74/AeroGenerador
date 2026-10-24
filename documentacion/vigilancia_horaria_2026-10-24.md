# Vigilancia horaria de la web pública · 24 de octubre de 2026

El usuario solicita comprobar cada hora la disponibilidad de AeroGenerador, porque necesita que la web siga accesible durante todo el día.

## Programación

Workflow `.github/workflows/vigilancia-web.yml`, en la rama principal de `ROBERTON74/AeroGenerador`. Cron `17 * * * *`: una revisión por hora, todos los días, al minuto 17 (el minuto es igual en UTC y Madrid). También admite ejecución manual desde Actions y se prueba al modificar el propio monitor. Se ejecuta en GitHub, independientemente del ordenador del usuario y de esta conversación.

Solo necesita permiso de lectura del repositorio y no usa claves ESIOS en el runner: consulta el proxy público ya configurado en Vercel. No se añaden dependencias a la aplicación ni se modifica su interfaz. El checkout parcial descarga únicamente el monitor y su manifiesto, evitando copiar cientos de MB de modelos cada hora.

## Qué comprueba

- Las portadas HTTPS de la aplicación React y del portal, incluyendo sus marcadores y archivos JS/CSS publicados con nombres variables.
- Los 70 archivos públicos del manifiesto: modelos de los visores, módulos, mar, clips de movimiento, fauna, arena, imágenes, vídeos y recursos auxiliares. Usa HEAD para evitar descargar los GLB grandes cada hora.
- Los tres vídeos visibles: respuesta HTTP 206 por tramos e índice de inicio rápido.
- ESIOS 551 con datos recientes. Si falla o se retrasa más de 90 minutos, comprueba el respaldo REData con un día completo reciente. Un respaldo operativo produce aviso de degradación; si ambos fallan, la revisión falla.
- Hasta tres intentos por comprobación para reducir falsas alarmas de red.

Se guarda informe JSON durante 14 días y resumen de cada ejecución. Un fallo marca el workflow en rojo y permite las notificaciones nativas de GitHub Actions. El envío de correo depende de la configuración de notificaciones del usuario; no se afirma que esté activado ni se envían mensajes externos o incidencias automáticamente.

El manifiesto `scripts/monitor_resources.json` debe actualizarse si se incorporan o retiran archivos públicos. Las rutas JS/CSS de las dos portadas se descubren automáticamente.

## Pruebas y límites

`node --test scripts/monitor_public_site.test.mjs`: siete pruebas correctas, incluidos caídas de recursos, errores transitorios, HTML en lugar de modelos, fallo de vídeos, ESIOS desactualizado y fallo de ambas fuentes. Primera ejecución local contra producción: 80 comprobaciones correctas, ESIOS operativo, sin avisos. Informe en `respaldos/vigilancia_horaria_2026-10-24/primera-comprobacion.json`.

Esto es vigilancia de disponibilidad; no garantiza servicio ininterrumpido, no repara ni vuelve a desplegar automáticamente y no sustituye la revisión visual en un móvil físico. Una caída puede ocurrir entre comprobaciones. GitHub puede retrasar o descartar ejecuciones programadas por carga y desactivar el horario de un repositorio público tras 60 días sin actividad. No se crean commits artificiales para evitar ese límite.

Fuentes: [horarios y límites de GitHub Actions](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule), [notificaciones de Actions](https://docs.github.com/en/subscriptions-and-notifications/how-tos/managing-github-actions-notifications).

El resultado de activación y primera ejecución en GitHub se registra al terminar.
