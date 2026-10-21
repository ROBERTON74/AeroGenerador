# Fondo de arena Nearshore Sandripples · revisión Blender · 20 de octubre de 2026

El usuario facilita `nearshore_sandripples.glb` y pide incorporarlo con tamaño y escala adecuados. Se crea **`Oceano_fondo_arena_REVISION`**, conservando la plataforma, el mar original al 150 %, los tres tiburones y los cetáceos alejados. La web permanece sin cambios.

## Procedencia y criterio de escala

Recurso **Nearshore Sandripples**, autor **observaterre**, licencia **CC BY 4.0**. Se consultó la [ficha original del autor](https://sketchfab.com/3d-models/nearshore-sandripples-fec8c55fe5474bb9bf631f1dcf691bea): describe un relieve de arena reconstruido mediante imágenes de dron y una separación aproximada de crestas de **20–30 cm**. Esta separación se usa como referencia para ajustar el detalle al conjunto, sin agrandar un único parche hasta convertir las ondulaciones en dunas de varios metros.

Original: 45.978.756 bytes. SHA-256 `53f428b7418a1899ea0c432656e0e70410c4a6d660b0c90cfd9b067cc2e959b1`. Copia idéntica en `exportaciones/sandripples_REVISION_2026-10-20/fuente/`. Datos en `procedencia_y_atribucion.json`. La escena conserva también el escaneo original completo en `SANDRIPPLES_FUENTE_ORIGINAL`, excluido del view layer de revisión.

Al importar, el GLB contiene 12 mallas, 781.990 vértices y 1.223.943 caras. Sus dimensiones nativas son aproximadamente 13.080 × 5.304 unidades; el archivo no declara una calibración física fiable. Se muestrean perfiles de altura del escaneo y se analiza su periodicidad: las componentes dominantes del perfil transversal están alrededor de 186–219 unidades. Un factor uniforme de **0,00125 unidades de escena por unidad original** sitúa esas separaciones alrededor de **0,232–0,273 m**, dentro de la referencia del autor. Es una **calibración aproximada para la presentación**, no una certificación métrica del levantamiento. Se mantiene 1 unidad de escena = 1 m para plataforma y animales.

## Extensión y geometría

Se toma un módulo interior de **16 × 6 m** con cobertura completa del escaneo. El relieve se obtiene por muestreo vertical de sus triángulos. Se retira la inclinación general y se igualan bordes opuestos para permitir repetición; se conservan las dimensiones métricas del detalle, pero el módulo es una adaptación derivada, no una copia exacta del escaneo entero.

Se generan mapas de altura y normales a partir de ese relieve, guardados y empaquetados. Un módulo geométrico de 24.929 vértices y 24.576 caras se repite mediante **96 objetos que comparten la misma malla**, cubriendo **96 × 96 m** bajo la plataforma. Fuera de esta zona se prolonga el aspecto de arena hasta **600 × 600 m** con el mapa de normales y color a la misma escala espacial, sin generar millones de polígonos para detalle lejano. El relieve central es geometría 3D; la zona lejana usa sombreado derivado del escaneo. La textura fina de grano se añade como detalle de material, sin desplazar la malla.

La referencia media queda en **Z=-58 m**. El módulo geométrico evaluado se sitúa aproximadamente entre **Z=-58,329 y -57,727 m**. La placa celeste anterior tiene una copia independiente bajo el terreno, en Z=-58,6 m, para conservar la base y evitar interferencias; el objeto original de las escenas anteriores no se mueve. Se mantienen el agua y el volumen submarino azul.

No cambian longitudes, trayectorias ni profundidad de animales; Monterey sigue fuera de la revisión vigente. La asociación de este relieve de arena somera con esta plataforma a 58 m es una composición de presentación, no una reconstrucción georreferenciada ni una simulación de formación de sedimentos.

## Guardado y revisión

Carpeta `exportaciones/sandripples_REVISION_2026-10-20/`:

- **`oceano_fondo_arena_animales_REVISION.blend`**: copia comprimida con esta escena activa, fuente y mapas empaquetados.
- `arena_plataforma_tiburones.png`, `arena_vista_general.png` y `arena_detalle_escala.png`: renders del conjunto y del detalle.
- `sandripples_altura.png` y `sandripples_normal.png`: mapas derivados.
- `analisis_escala_nativa.json`, `escala_y_extension.json`, `verificacion_escena.json`, `conservacion_escenas.json`, `guardado_listo.json` y `MANIFIESTO_SHA256.json`.

Se conservan los doce inventarios de escenas anteriores. Se verifica la escala del mar al 150 % y que los cinco animales permanecen por encima de la cota más alta del terreno en muestras de los fotogramas 1, 80 y 300. El relieve geométrico queda por encima de la placa inferior y se revisan los tres renders reales de Blender.

Scripts: `scripts/importar_sandripples_revision.py`, `scripts/preparar_sandripples_escala.py`, `scripts/renderizar_sandripples_revision.py`. Conservar la atribución de observaterre y las licencias de los recursos anteriores en cualquier futura distribución.

**Pendiente de revisión del usuario antes de exportar o incorporar a la web.** Portal, React y laboratorio intactos. Se conservan las copias anteriores; sin publicación ni GitHub.
