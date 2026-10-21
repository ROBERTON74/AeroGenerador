# Base offshore con monopilote · 20 de octubre de 2026

## Cambio solicitado

El usuario pidió sustituir la base mostrada en su captura por una más parecida a la de un aerogenerador offshore real. Se conserva el aerogenerador Blender, el mapa DEL, los datos y los controles. El cambio corresponde a la aplicación React en el puerto 5177; no modifica el visor separado del portal ni el archivo `.blend` original.

La base anterior combinaba un pedestal, dos apoyos cilíndricos laterales y una plataforma desproporcionada. Se sustituye por una interpretación visual de cimentación fija de **monopilote con pieza de transición**. El único fuste tubular continúa bajo el agua; sobre él se representa una transición amarilla, interfaz embridada con pernos, plataforma de rejilla con cartelas, barandillas con acceso, escalera, pequeño desembarco, defensas verticales de caucho, tubo de protección de cable y pescante de servicio. Se añade una puerta de acceso por encima de la plataforma.

Las piezas de transición conectan torre y monopilote y pueden incorporar plataformas, escaleras y accesos para embarcaciones; la pintura amarilla facilita su visibilidad. Referencia de fabricante: [CS WIND Offshore, Transition Pieces](https://www.cswoffshore.com/solutions/transition-pieces/). Referencia de uso: [Ørsted, Borkum Riffgrund 1](https://orsted.com/en/media/news/2014/07/all-77-foundations-are-in-place-at-the-german-offshore-wind-farm-borkum-riffgrund-1). El modelo es una representación visual inspirada en esa tipología, sin cálculo geotécnico ni dimensionamiento estructural para un emplazamiento real.

## Proporciones e integración

- Se toma como referencia la torre Blender de 5,9 m de diámetro de base. La escala de la aplicación es `(5.2 / 102.5) × 1.2` unidades por metro. La nueva transición tiene aproximadamente 8 m de diámetro en la parte baja, y la plataforma exterior aproximadamente 13,5 m. Son proporciones elegidas para esta visualización.
- Se reduce la escala del operario de 0,19 a 0,055: su altura aproximada se acerca a 1,8 m en relación con la torre. Se sitúa sobre la plataforma, y se mantiene una barandilla de altura visual coherente.
- Se retiran los apoyos laterales y su viga de conexión. La espuma circular se ajusta al diámetro del nuevo fuste.
- Se conserva el entorno marino y el corte submarino anterior como recurso didáctico independiente, sin validar batimetría ni cimentación real.
- El acercamiento de la vista DEL «Base de la torre» se adapta al menor tamaño del conjunto. También se puede abrir directamente una vista normal de detalle en http://localhost:5177/?vista=base.
- La vista general habitual sigue en http://localhost:5177/. «Vista general» permite salir del detalle. DEL sigue coloreando las zonas del modelo Blender como antes, con su aviso de mapa ilustrativo y DEL no calculado.

## Archivos

- `src/components/OffshoreMonopile.jsx`: nuevo conjunto de cimentación y accesos. La rejilla usa una textura RGBA generada localmente, sin imágenes externas ni nuevas dependencias.
- `src/components/WindTurbineScene.jsx`: sustituye la base, ajusta operario/espuma y los encuadres de base.
- `src/App.jsx`: admite `?vista=base` para abrir el acercamiento normal directamente.
- `scripts/verify_offshore_browser.mjs`: prueba visual de escritorio, móvil, DEL y restauración de colores. Requiere Chrome de pruebas con CDP en 9333.

## Verificaciones y conservación

- Compilación React correcta. Persiste el aviso conocido sobre tamaño del paquete Three.js.
- Navegador sin errores JavaScript en la prueba; modelo Blender cargado, tres acercamientos DEL operativos y colores restaurados al cerrar DEL.
- Capturas revisadas de la base normal en escritorio y móvil de 390 píxeles, y en vista DEL. Continúan disponibles órbita, zoom y dashboard minimizable.
- No se modificaron Dashboard, hooks, APIs, cálculo de métricas, archivo GLB, archivo Blender ni el laboratorio del portal.
- SHA-256 del `.blend` fuente coincide con el manifiesto original.
- Copia de `WindTurbineScene.jsx` anterior al cambio y capturas en `respaldos/base_offshore_2026-10-20/`. El comportamiento previo de `App.jsx` está preservado en la copia de código `respaldos/react_del_2026-10-20.zip`.
- Código, modelos y documentación actuales guardados en `respaldos/react_base_offshore_2026-10-20.zip` con manifiesto SHA-256, excluyendo dependencias, dist y credenciales.

Para revertir la geometría, restaurar el `WindTurbineScene.jsx` anterior desde la carpeta de respaldo; el componente OffshoreMonopile puede quedar sin uso. La entrada opcional `?vista=base` puede retirarse de App.jsx o restaurarse ese archivo desde la copia DEL anterior.

No se ha publicado en Vercel ni subido a GitHub. Las credenciales ESIOS permanecen en archivos de entorno ignorados.
