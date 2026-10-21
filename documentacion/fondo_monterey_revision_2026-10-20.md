# Fondo marino descargado: revisión Blender · 20 de octubre de 2026

El usuario facilita `bathymetry_of_monterey_bay_canyon.glb` y pide añadirlo al conjunto, revisándolo antes de subir nada a la aplicación web. Se crea la escena independiente **`Oceano_cetaceos_y_fondo_REVISION`**, conservando mar y cetáceos GLB animados, plataforma y escala métrica. No se modifica la web.

## Procedencia y conservación

Los metadatos del GLB identifican **Bathymetry of Monterey Bay Canyon**, autor **DeepSeaBEE**, licencia **CC BY 4.0**, fuente declarada https://sketchfab.com/3d-models/bathymetry-of-monterey-bay-canyon-dd8713e853a042f1a35bd2f5eea72067. Atribución tomada del archivo recibido, sin consulta externa de la ficha. Las adaptaciones son el recorte local, la traslación de presentación y el material de sedimento.

Archivo original de 16.444.540 bytes. SHA-256 `19411a8339c030dc298b00df16ccd301233412c3b6bd3a67e89dfc061c4c0559`. Copia idéntica en `exportaciones/fondo_monterey_REVISION_2026-10-20/fuente/`, con metadatos en `procedencia_y_atribucion.json`. El modelo íntegro también queda en la colección Blender `FONDO_GLB_FUENTE_BATIMETRIA`, excluida del view layer de revisión, sin alterar sus datos ni materiales.

## Adaptación a la escena

La batimetría importada cubre decenas de kilómetros y contiene seis mallas. Para mantener la escala de la plataforma y los animales se utiliza un **recorte de 660 × 660 unidades, tratado como metros**, sin compresión horizontal, vertical ni exageración del relieve. La escala métrica de presentación se mantiene en 1 unidad = 1 m; los metadatos del GLB no bastan para certificar el datum o la calibración geográfica de la fuente.

El recorte se toma alrededor de X=22.000, Y=0 en las coordenadas del terreno importado. Se recortan sus polígonos mediante cuatro planos y se unen vértices coincidentes. Se excluye del recorte un polígono del archivo que incluye un vértice atípico a Z≈-74.555; el original completo permanece intacto. El resultado tiene 80 vértices y 84 caras; no se inventa detalle geométrico adicional. El sombreado suave y un material de sedimento con variación de color y relieve fino ayudan a leer la superficie, cuyo material original es casi negro.

Se traslada rígidamente el recorte (-22.000, 0, +300,7953) para centrarlo en la escena y colocar su punto más alto en **Z=-50 m**. El fondo queda entre **Z=-75,15 y -50 m**. Es una composición de revisión: **no representa una instalación real georreferenciada en Monterey ni conserva la profundidad absoluta o datum de la fuente**. `recorte_y_escala.json` registra las coordenadas, escala y adaptación.

El plano anterior `MAR_REV_FONDO_MARINO` se excluye solo del inventario de esta escena; no se borra ni se oculta en las versiones previas. Se crea una copia del volumen submarino de 660 × 660 × 100 m para cubrir el relieve y una luz auxiliar amplia. El mar descargado, las animaciones y proporciones de la plataforma y los cetáceos se conservan. Los animales continúan alrededor de Z=-31,02 y -33,42 m, con su variación vertical y movimientos existentes.

## Archivos y revisión

Carpeta: `exportaciones/fondo_monterey_REVISION_2026-10-20/`.

- `oceano_cetaceos_fondo_monterey_REVISION.blend`: copia independiente comprimida con la nueva escena activa.
- `fondo_monterey_con_animales.png`: vista submarina con el fondo y los animales.
- `fondo_monterey_relieve.png`: vista oblicua para revisar el terreno.
- `verificacion_escena.json`: conservación, escala y separación vertical de los animales respecto al fondo.
- `conservacion_escenas.json`, `estado_importacion.json`, `guardado_listo.json` y `MANIFIESTO_SHA256.json`.

Se verifica la conservación de los nueve inventarios de escenas previas y que el plano antiguo no se renderiza en la nueva. Se evalúan todos los vértices de los animales en fotogramas 1, 25, 80 y 300: se mantienen por encima del punto más alto del nuevo terreno. Se revisan visualmente los renders reales de Blender. Las versiones anteriores permanecen guardadas.

Scripts en orden: `scripts/importar_fondo_monterey_revision.py`, `scripts/preparar_fondo_monterey_revision.py`, `scripts/renderizar_fondo_monterey_revision.py`. El importador evita recrear una escena existente.

**Pendiente de revisión del usuario antes de exportar o incorporar a la aplicación web.** Sin cambios en el portal, React o laboratorio, publicación ni GitHub. Mantener también las atribuciones y condiciones de los recursos de océano, jorobada y cachalote de las notas anteriores.


## Revisión rechazada posteriormente

El usuario pidió retirar este fondo y recuperar la placa celeste. Esta versión queda como historial, sin incorporar a la web. La revisión vigente está documentada en `base_celeste_mar_rapido_2026-10-20.md`.
