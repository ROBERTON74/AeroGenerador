# Tres tiburones y cetáceos más alejados · revisión Blender · 20 de octubre de 2026

El usuario proporciona `model_92a_-_great_white_shark.glb` y pide tres ejemplares cerca de la plataforma y alejar algo más la ballena y el cachalote. Se crea **`Oceano_tres_tiburones_REVISION`**, sin modificar la web ni sustituir las revisiones anteriores.

## Recurso y escala

Metadatos recibidos: **Model 92A - Great White Shark**, autor **DigitalLife3D**, licencia **CC BY-NC 4.0**. Fuente declarada: https://sketchfab.com/3d-models/model-92a-great-white-shark-702e7b53637f4ded9ca479a8124e810d. La futura distribución debe mantener atribución y condición no comercial, junto con las licencias de los recursos previos. No se ha consultado externamente la ficha del recurso.

Original de 113.136.964 bytes, SHA-256 `3cdcae23729e39a4940c88c055e03d64de95e34b8a71d423f3bddc1b61dc72f8`. Copia intacta en `exportaciones/tres_tiburones_REVISION_2026-10-20/fuente/`, verificada contra Descargas. Metadatos completos en `procedencia_y_atribucion.json`.

El GLB incluye cinco mallas visibles, tres imágenes, un esqueleto de 51 huesos y el clip `Swim Cycle` de unos 3,7 s. Se conserva esta animación. Las mallas y texturas se comparten entre los tres tiburones; cada ejemplar tiene su propio objeto de esqueleto, fase de clip y trayectoria. No se triplican las texturas pesadas. Los pequeños widgets de huesos del importador no se renderizan.

Longitud nativa de referencia: 4,4527 m. Se aplican factores uniformes para longitudes de **3,8, 4,2 y 4,6 m**, sin deformar las proporciones. Se conserva **1 unidad Blender = 1 m**. Como referencia general de escala se consultó la ficha [White Shark de NOAA Fisheries](https://www.fisheries.noaa.gov/species/white-shark), que describe adultos de hasta unos 6,4 m y presencia tanto en aguas costeras como oceánicas. Esto no acredita agregaciones de esta especie a esta plataforma concreta.

## Movimiento y colocación

Tres recorridos suaves y separados, cerca de la plataforma, con orientación en el sentido del avance. Centros de trayectoria: (-22, -18, -17), (20, -10, -22) y (2, 26, -27) m. Radios horizontales: (8,5), (10,6) y (7,5) m. Variación vertical de ±0,6 m, distintas fases y ritmos del ciclo de nado. No se representan como un banco sincronizado ni se añade persecución o ataque. Son recorridos artísticos de revisión, no una simulación ecológica validada ni observaciones reales de tiburones en este emplazamiento.

La jorobada se desplaza (-12, -18, 0) m respecto a su recorrido anterior, unos **21,6 m** adicionales hacia el exterior. El cachalote se desplaza (+18, -18, 0) m, unos **25,5 m**. Las copias mantienen mallas, rig, materiales, animaciones, tamaños de referencia y profundidad. Se utilizan grupos de traslación y copias de objetos con referencias de armadura remapeadas; no se editan las trayectorias de las escenas anteriores.

El mar mantiene **1,5× la velocidad original**, con el mismo oleaje irregular descargado. Se conserva la placa celeste y la plataforma. Monterey sigue fuera de la revisión vigente.

## Verificación y guardado

Carpeta: `exportaciones/tres_tiburones_REVISION_2026-10-20/`.

- **`oceano_tres_tiburones_cetaceos_REVISION.blend`**: nueva copia comprimida con la revisión activa y texturas empaquetadas.
- `tres_tiburones_cerca_plataforma.png`: vista cercana de los tiburones.
- `tiburones_y_cetaceos_vista_general.png`: vista del conjunto con los cetáceos más alejados.
- `escala_colocacion_animacion.json`, `verificacion.json`, `conservacion_escenas.json`, `guardado_listo.json` y `MANIFIESTO_SHA256.json`.

Se comprueba deformación de malla y desplazamiento de los tres tiburones en fotogramas 1, 25, 80 y 300, valores finitos y situación entre plataforma y fondo. La separación mínima de centros entre tiburones en 20 muestras es 27,79 m; esta comprobación no constituye una simulación completa de colisiones con todos los cables. Los once inventarios de escenas previas y el factor 1,5 del mar se conservan. Se revisan los dos renders reales de Blender.

Scripts: `scripts/importar_tiburon_revision.py`, `scripts/animar_tres_tiburones_revision.py`, `scripts/renderizar_tiburones_revision.py`.

**Pendiente de revisión del usuario antes de incorporar a la web.** No se modifican portal, React ni laboratorio. Se conservan las copias anteriores. Sin publicación ni GitHub.
