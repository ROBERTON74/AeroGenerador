# Guardado completo del trabajo · 20 de octubre de 2026

El usuario pide guardar todo lo realizado. Se consolida el estado actual en:

`respaldos/guardado_completo_2026-10-20/`

## Contenido

- `proyecto_completo.zip`: fuentes y configuración de React y Angular, todos los recursos públicos actuales del portal, documentación, scripts, exportaciones GLB, renders, materiales y archivos Blender nuevos.
- Fuente Blender original usada para la integración, conservada en la estructura `Proyecto_blender/` del ZIP.
- `sesion_blender_completa.blend`: copia completa del Blender abierto, con sus seis escenas y la jacket activa. También se incluye en el ZIP. Se guarda con `copy=True`, sin cambiar ni sobrescribir el archivo de trabajo anterior.
- Informes y capturas de comprobación de las sesiones recientes, excluyendo los perfiles de navegador y archivos comprimidos previos.
- `RESTAURAR.md`: instrucciones para reconstruir las carpetas hermanas, instalar dependencias y abrir ambos proyectos.
- `MANIFIESTO_SHA256.json`: inventario por archivo; `proyecto_completo.sha256`: suma del ZIP; `verificacion_guardado.json`: resultado de la comprobación.

Estado guardado: portada y laboratorio aprobados; aerogenerador original integrado; vistas DEL, predictivo y Rainflow/Cp/Ct en React; semisumergible, TLP con explicación y fuentes, jacket y láminas transparentes de mar en los tres visores. Se conserva el giro de palas y los controles.

El paquete contiene el trabajo actual y sus modelos fuente pertinentes. No incluye dependencias regenerables, cachés, perfiles de navegador, respaldos ZIP anteriores, credenciales de entorno ni las numerosas versiones históricas de Blender y grabaciones antiguas de la raíz que no se han usado en estos cambios. Las credenciales existentes continúan en sus archivos ignorados.

Las copias por etapas permanecen intactas. No se modifica ni se publica el sitio durante este guardado y no se sube a GitHub.

Script: `scripts/guardar_sesion_completa.py`. Comprueba integridad CRC del ZIP y SHA-256 de cada archivo archivado antes de emitir el informe de éxito. Este guardado no requiere repetir las pruebas funcionales, ya registradas en las notas de cada cambio.
