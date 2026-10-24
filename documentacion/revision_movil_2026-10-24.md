# Mar aprobado y reproducción móvil · 24 de octubre de 2026

El usuario pide revisar la reproducción, especialmente en móvil, y que los tres tipos de plataformas usen el mar de su captura de la aplicación principal.

## Correcciones

Los visores semisumergible, TLP y jacket usaban el mismo movimiento original de Blender, pero un adaptador visual diferente: opacidad superficial de 0,26, mallas lejanas sin mapa de normales fino y triangulación simplificada. Se sustituye esa adaptación por una copia exacta de `src/components/blenderSea.js` en `portal/public/assets/entorno-offshore/blenderSea.js`. Una prueba compara ambas implementaciones y los cinco archivos del clip byte por byte.

La superficie usa ahora el mismo material aprobado: color, rugosidad, normales, escritura de profundidad y opacidad 0,96; conserva el movimiento original a 0,75×. El océano cubre 1950 m mediante instancias, sin estirar las olas. Se conservan los modelos, animales, recorridos, alturas y cámaras. La vista submarina conserva su opacidad 0,60. La mayor opacidad superficial reduce la visión de animales desde arriba; «Bajo el agua» mantiene la exploración de la fauna. Esta petición reemplaza la anterior preferencia superficial del 26 %.

Una capa opaca cubre la escena hasta que el océano esté listo. El agua comienza a reproducirse sin esperar la descarga y preparación de fauna y arena. No se presenta un agua alternativa durante esa espera.

En pantallas menores de 740 px se limita la resolución interna a 1,25×, con controles táctiles de al menos 44 px. La opción «Ligera» conserva 1× incluso al redimensionar. La velocidad de las palas sigue siendo independiente del mar. Se mantiene pausa al ocultar la pestaña o salir el visor de la pantalla.

Los tres vídeos utilizados por el portal pasan a inicio rápido (`moov` antes de `mdat`) sin recodificación. Se comparan por separado los SHA-256 de cada flujo comprimido de vídeo y audio; todos permanecen idénticos. Se decodifican todos los fotogramas sin errores. Se añade `playsinline` para reproducción dentro de la página en móvil.

La aplicación React, el laboratorio, el visor original, los modelos GLB y las escenas Blender permanecen sin cambios. La instalación hermana recibe los mismos recursos y la adición de `playsinline`, conservando sus enlaces locales. Copias anteriores en `respaldos/revision_movil_2026-10-24/`.

## Comprobaciones y límites

`node --experimental-vm-modules scripts/verificar_movil_plataformas_2026_10_24.mjs`, también con `--reduced-motion`: tres visores ejecutados con geometría y animaciones reales; renderer y DOM sustituidos. Comprueba carga, mar antes que fauna, materiales y normales, cuatro anchuras (320/390/430/740 px), resolución interna, vistas, reset, pausa/reanudación, visibilidad y velocidad del mar independiente. No prueba el render GPU ni mide FPS en un móvil real.

Las pruebas de carga inicial React, análisis técnico y unidades REData pasan. Compilación conjunta React/Angular correcta, con los avisos de tamaño previos. Informes de controles y vídeos en el respaldo.

La habilidad de control del ordenador detectó Edge, pero detuvo el control al no poder determinar la URL actual de Windows con suficiente confianza para aplicar sus reglas. No se siguió automatizando esa ventana. No se afirma una revisión visual completa ni una prueba física en iOS/Android.

## Publicación verificada

Commit de código `955411e`, enviado a GitHub. Vercel completa automáticamente el despliegue `dpl_8GdCnzNksXxrKxcAiv2JGfUXumtA`, estado `Ready`, con alias `https://aerogenerador-robert.vercel.app`. Las 83 comprobaciones HTTPS de rutas y recursos pasan. Los cinco módulos JavaScript públicos contrastados coinciden con las fuentes corregidas. Los tres vídeos responden HTTP 206 a la petición de un tramo y sus bytes iniciales coinciden con los optimizados, incluido el índice al principio. ESIOS devuelve HTTP 200, indicador 551 y datos del 24 de octubre.

Ambos servidores locales responden HTTP 200 (4200 y 5177); el módulo de mar nuevo también se sirve desde 4200. La compilación del portal hermano pasa con su aviso CSS previo. React, laboratorio y GLB de plataformas no presentan cambios frente al commit anterior.

Informes en `respaldos/revision_movil_2026-10-24/publicacion-verificada.json`, `verificacion_visores_sin_gpu.json`, `verificacion_movimiento_reducido.json` y `videos-verificados.json`. Copia incremental con fuentes corregidas, versiones anteriores e informes: `correccion_movil_incremental.zip`. La comprobación de los 15 archivos preparados no detecta credenciales. El resultado sigue limitado a las verificaciones descritas; no se convierte en una aprobación visual de GPU móvil.
