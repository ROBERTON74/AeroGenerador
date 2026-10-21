# Cetáceos GLB animados y a escala · revisión Blender · 20 de octubre de 2026

El usuario facilita `humpback_whale_swimming.glb` y `sperm_whale.glb` y pide añadirlos con movimiento, conservando escala respecto a la plataforma. Se prepara una revisión independiente en Blender, conservando el océano descargado y la profundidad intermedia acordada. No se modifica la web.

## Modelos y procedencia

Los metadatos del primer archivo lo identifican como **Humpback Whale (Swimming)**: ballena jorobada, no ballena azul. Autor **Connlan_Immure**, licencia **CC BY 4.0**. Fuente declarada: https://sketchfab.com/3d-models/humpback-whale-swimming-f4912be9163a4f45b2480df8ccb8b2c6. Incluye un esqueleto y el clip `Take 001` de unos 10 s. Se conserva la animación y se repite mediante NLA.

El segundo es **Sperm whale**, de **CARI'MAM**, licencia **CC BY-NC-SA 4.0**. Fuente declarada: https://sketchfab.com/3d-models/sperm-whale-9d62dd998b154c3d9043711866186b7a. No contiene esqueleto ni animación; se añade un rig propio de cuatro huesos con pesos progresivos y un ciclo suave de cola de 4 s. La futura distribución de esta adaptación debe respetar atribución, uso no comercial y compartir bajo la misma licencia. Los metadatos se toman de los archivos recibidos, sin consulta externa de las fichas.

Copias intactas de ambos GLB en `exportaciones/cetaceos_descargados_REVISION_2026-10-20/fuentes/`. Autoría, licencias, tamaños y SHA-256 en `procedencia_y_atribucion.json`. Las modificaciones son la integración, escala, trayectoria y, en el cachalote, rig y animación nuevos. Se conserva también la atribución del océano de the9thearl en la escena y en la documentación anterior.

## Escala, posición y movimiento

Nueva escena **`Oceano_y_cetaceos_GLB_REVISION`**, con unidades métricas y **1 unidad = 1 metro**. El océano descargado, sus materiales, su movimiento y las instancias que cubren unos 450 m se mantienen.

Se retiran los animales procedurales únicamente del inventario de la escena nueva; permanecen en las escenas anteriores. No se muestran animales duplicados.

La jorobada mide 27,676 m longitudinalmente al importar en el fotograma de referencia. Se aplica un ajuste uniforme de 0,603406 para una longitud de referencia de **16,7 m**, sin deformar sus proporciones ni modificar los huesos del clip nativo. La pequeña esfera creada como widget del esqueleto por el importador se oculta en el render.

El cachalote mide 19,405 m al importar. Se incorporan las transformaciones de su jerarquía en centímetros, se orienta su longitud al eje local X y se aplica un factor uniforme de 0,937890 para una longitud de referencia de **18,2 m**. Se conservan malla, UV y texturas. El rig conecta cuerpo, pedúnculo, cola y lóbulos caudales con pesos normalizados y deformación suave. Las longitudes aparentes varían con la flexión de la animación; son dimensiones de referencia del modelo, no medidas biológicas certificadas.

Ambos recorren óvalos suaves de radios 8 y 4 m durante 20 s, orientados en el sentido de avance, con desplazamiento vertical de ±1,2 m. Centros de nado: Z=-31,02 m para la jorobada y Z=-33,42 m para el cachalote. Fondo en Z=-58 m. La plataforma original y sus proporciones se mantienen.

## Verificación y archivos

Carpeta `exportaciones/cetaceos_descargados_REVISION_2026-10-20/`:

- `oceano_y_cetaceos_descargados_REVISION.blend`: nueva copia comprimida con la revisión activa y texturas empaquetadas.
- `cetaceos_descargados_submarina.png`: render para revisar los animales bajo la plataforma.
- `cetaceos_descargados_superficie.png`: render del conjunto con el mar descargado.
- `escala_y_animacion.json`: factores de escala, cotas y rig.
- `verificacion_animacion_escala.json`: muestras en fotogramas 1, 25, 80 y 300.
- `conservacion_escenas.json`, `guardado_listo.json` y `MANIFIESTO_SHA256.json`: conservación y guardado.

Se comprueba deformación de vértices en coordenadas del animal, desplazamiento de ambos grupos, valores finitos y permanencia de todos los vértices evaluados de los animales entre fondo y plataforma en las cuatro muestras. Los ocho inventarios de escenas previas se conservan. Se revisan los dos renders reales de Blender.

Scripts: `scripts/importar_cetaceos_glb_revision.py`, `scripts/animar_cetaceos_glb_revision.py` y `scripts/renderizar_cetaceos_glb_revision.py`. Ejecutar en ese orden sobre la sesión que conserva el océano descargado. El importador impide recrear una escena existente.

**Pendiente de revisión del usuario antes de incorporar a la web.** Se conservan las revisiones anteriores, el portal, React y el laboratorio. No hay publicación ni GitHub.
