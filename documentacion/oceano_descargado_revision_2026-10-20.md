# Superficie GLB descargada: revisión en Blender · 20 de octubre de 2026

El usuario proporciona `C:/Users/rober/Downloads/free_ocean_simulation-tiled.glb` y pide renderizar primero esta superficie en Blender, manteniendo los animales a media profundidad. No autoriza modificar la web ni sustituir las revisiones Blender anteriores.

## Procedencia y archivo recibido

Archivo de 162.686.760 bytes. SHA-256: `c13f343aa6a66563838d8baad094fa397fe7a113f73d0bdb237089130e62e92a`. Se conserva intacto en Descargas y se guarda una copia verificada dentro de `exportaciones/oceano_descargado_REVISION_2026-10-20/fuente/`.

Los metadatos del GLB identifican **Free Ocean simulation-Tiled**, autor **the9thearl**, licencia **CC BY 4.0** y procedencia: https://sketchfab.com/3d-models/free-ocean-simulation-tiled-ec999170128341a29dfe6d75878e2303. Esta atribución procede del archivo recibido; no se ha hecho una búsqueda externa de la ficha. La autoría corresponde al autor indicado; la integración con la plataforma y los cetáceos es una adaptación de revisión. La fuente y la licencia deben acompañar cualquier futura distribución. Metadatos conservados en `procedencia_y_atribucion.json` y en propiedades de la escena.

## Preparación de la escena

Nueva escena **`Oceano_descargado_REVISION`**, independiente de `Mar_y_cetaceos_REVISION`. La superficie Ocean anterior se excluye únicamente de la nueva escena; no se elimina ni se oculta globalmente. Se enlazan como contexto la misma plataforma, el fondo y los animales existentes, conservando escala, materiales, geometría y acciones. Las siete escenas previas conservan sus inventarios de objetos, registrados en `conservacion_escenas.json`.

La superficie importada tiene cinco mallas que cubren nueve piezas, unos 150 × 150 m en conjunto, con dos texturas embebidas y animación mediante 249 deformaciones más la base por malla (250 estados). Se conservan sus materiales, texturas y deformaciones. Los diferentes niveles de detalle y las uniones de las piezas pertenecen al modelo recibido.

Se mantiene **1 unidad Blender = 1 metro**, sin agrandar el oleaje ni los animales. Se repite la colección mediante ocho instancias desplazadas ±150 m, además de la pieza central, para cubrir aproximadamente **450 × 450 m**. No se duplican los datos de las mallas o de las deformaciones. El volumen submarino tiene una copia independiente ajustada a esta cobertura; el original no cambia. Los bordes y la altura media de la superficie se conservan en torno a Z=0.

Ballena y cachalote mantienen los centros de nado Z=-31,02 m y Z=-33,42 m, con excursión vertical de ±1,2 m, movimiento horizontal, cola y aletas. El fondo permanece en Z=-58 m. Se conserva la escala comprobada de los animales.

El clip del agua tiene 250 estados a 24 fps, unos 10,4 s. Se configura su repetición en NLA para cubrir el intervalo de revisión 1–480. Las acciones anteriores de los animales permanecen intactas. Esto conserva el movimiento del archivo; no certifica continuidad perfecta en las uniones entre piezas o en el reinicio del clip.

## Revisión, guardado y verificación

Carpeta: `exportaciones/oceano_descargado_REVISION_2026-10-20/`.

- `oceano_descargado_con_cetaceos_REVISION.blend`: copia comprimida independiente, con la nueva escena activa y las texturas del agua empaquetadas.
- `oceano_descargado_superficie.png`: detalle del material y oleaje con la plataforma.
- `oceano_descargado_conjunto.png`: vista general con el aerogenerador.
- `oceano_descargado_submarina.png`: animales a media profundidad bajo la superficie importada.
- `estado_importacion.json`, `verificacion_animacion.json` y `guardado_listo.json`: importación, animación y guardado.
- `MANIFIESTO_SHA256.json`: integridad del conjunto guardado.

Se comprueba la deformación real de una muestra de vértice entre fotogramas 1, 80 y 300, incluida la repetición del clip. Se registran también las posiciones de ambos animales y la ausencia de la superficie anterior en la nueva escena. Se revisan visualmente los renders reales de Blender. El archivo GLB original y su copia local tienen el mismo SHA-256.

`scripts/importar_oceano_descargado_revision.py` documenta la importación inicial en escena independiente; las instancias, cámaras y repetición NLA se preparan después en Blender y quedan conservadas en el archivo de revisión.

**Esperar revisión del usuario antes de exportar o incorporar esta superficie a la web.** No se modifican el portal, React, el laboratorio, los modelos de las plataformas ni las revisiones anteriores. Sin publicación ni GitHub.
