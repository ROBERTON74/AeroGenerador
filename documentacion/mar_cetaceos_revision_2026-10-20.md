# Mar animado y cetáceos: revisión en Blender · 20 de octubre de 2026

El usuario rechazó el último acabado del mar web y pidió crear primero en Blender una superficie de agua que se mueva como el mar, con ballenas y cachalotes, para revisarla antes de incorporarla a la web. Esta petición **no autoriza modificar de nuevo el portal**.

Se crea la escena independiente `Mar_y_cetaceos_REVISION`, con una superficie Ocean de 420 × 420 m, oleaje espectral animado durante 20 segundos, pequeñas irregularidades de material, reflejos, transparencia y volumen azul bajo la superficie. El agua es geometría editable con modificador Ocean; no es una imagen ni una lámina plana. La espuma y el acabado son artísticos. No se simulan flotabilidad, interacción con la plataforma, hidrodinámica ni efectos ecológicos.

Se modelan una ballena jorobada y un cachalote como mallas 3D con cuerpos diferenciados, aletas pectorales, cola de dos lóbulos, ojos y boca; la jorobada incluye pliegues ventrales y el cachalote cabeza voluminosa y jorobas dorsales. Animación de desplazamiento, oscilación de cola y aletas. Son modelos artísticos de revisión, sin pretensión de exactitud anatómica. La animación del mar no es un bucle cerrado; el reinicio del fotograma 480 al 1 puede producir un salto.

La plataforma semisumergible existente sirve de contexto mediante objetos enlazados sin modificar sus datos. Las seis escenas anteriores conservan su inventario de objetos; no se sustituyen modelos. La escena de revisión añade cámaras, materiales y objetos propios.

## Revisión y archivos

- Escena activa en Blender: `Mar_y_cetaceos_REVISION`.
- Cámara inicial: `MAR_REV_CAMARA_AGUA_Y_CETACEOS`.
- Alternativas: `MAR_REV_CAMARA_MAR_Y_PLATAFORMA` y `MAR_REV_CAMARA_SUBMARINA`.
- Animación: fotogramas 1–480 a 24 fps; Espacio inicia y pausa la reproducción.
- Carpeta: `exportaciones/mar_cetaceos_REVISION_2026-10-20/`.
- Archivo independiente: `mar_y_cetaceos_REVISION.blend`, guardado como copia comprimida sin sobrescribir el archivo de trabajo anterior. Incluye las escenas previas y la nueva escena activa.
- Imágenes: `revision_superficie.png` y `revision_submarina.png`.
- Script reproducible: `scripts/crear_mar_cetaceos_revision.py`; evita recrear una escena con el mismo nombre.

`verificacion.json` confirma diferencias de vértices del agua, desplazamiento de la ballena y rotación de la cola entre los fotogramas 1 y 31. `conservacion_escenas.json` registra los inventarios anteriores. Los renders se revisaron visualmente. Se añade manifiesto SHA-256 para el guardado.

**Esperar la revisión del usuario antes de exportar esta escena o cambiar la web.** No se han modificado los visores web, React, el laboratorio ni los archivos Blender anteriores. Sin publicación ni GitHub.

## Escala comprobada y preparación para incorporación

Por recordatorio del usuario se verifica y registra **1 unidad Blender = 1 metro**, coherente con la plataforma existente (59,8 m de anchura). La superficie Ocean tiene 420 m de lado nominal. Las longitudes medidas sobre las mallas evaluadas, en el eje longitudinal local y en el fotograma 80, son 16,712 m para la ballena jorobada y 18,218 m para el cachalote. Son medidas del modelado artístico, no dimensiones biológicas certificadas. Las dimensiones visibles pueden variar ligeramente con la animación.

El conjunto independiente cuelga de `MAR_REV_ENTORNO_EXPORTABLE_METROS`, en origen (0, 0, 0) y escala (1, 1, 1), con el nivel medio del mar en Z=0. Este grupo contiene agua, volumen, fondo y cetáceos; la plataforma enlazada de referencia queda separada. Se conserva el archivo anterior y se guarda la revisión en **`mar_y_cetaceos_REVISION_escala_metros.blend`**, acompañada de `escala_y_exportacion.json`. Esta es la copia más reciente para continuar.

La futura integración deberá conservar los metros, convertir una sola vez Z arriba (Blender) a Y arriba (glTF) y alinear el nivel del mar con el de cada escena. No aplicar escalados visuales arbitrarios ni sustituir la plataforma. Ocean y los volúmenes de Blender no se trasladan automáticamente a GLB: habrá que preparar una representación compatible y hornear o adaptar la animación después de la aprobación. **No se ha exportado ni cambiado la web.**

## Revisión de media profundidad y cuatro bordes ondulados

El usuario pidió hundir los animales hasta media altura entre plataforma y fondo, mantenerlos nadando allí y que las pequeñas ondas se aprecien en los cuatro bordes al mirar de perfil.

El fondo está en Z=-58 m y la parte inferior de la base de referencia en Z=-6,44 m; su punto medio es Z=-32,22 m. La ballena nada alrededor de Z=-31,02 m y el cachalote alrededor de Z=-33,42 m. Ambos conservan desplazamiento horizontal, cola y aletas, con una excursión vertical suave de ±1,2 m alrededor de esas profundidades. Se conserva la escala en metros.

Después de Ocean se añade un modificador Geometry Nodes con dos ondas viajeras de amplitudes 0,42 y 0,26 m y longitudes de onda 16 y 23 m. Deforma la superficie completa y sus cuatro bordes; no es un efecto de textura ni una línea decorativa. Se aumenta la resolución Ocean a 14 en visor (38.809 vértices evaluados) y 16 en render para suavizar el perfil, y se aplica sombreado suave después del desplazamiento.

`media_altura_verificacion.json` comprueba movimiento real de vértices en cada uno de los cuatro bordes entre los fotogramas 1 y 61, y desplazamiento vertical de ambos animales a media profundidad. Los seis inventarios de escenas anteriores se conservan. `media_altura_configuracion.json` registra las cotas y parámetros. Script incremental reproducible: `scripts/ajustar_mar_media_altura.py`, después del script de creación.

La copia más reciente es **`mar_y_cetaceos_REVISION_media_altura_ondas.blend`**. Se conservan las dos versiones anteriores. Cámaras nuevas: `MAR_REV_CAMARA_DISTRIBUCION_VERTICAL` (vista inicial), `MAR_REV_CAMARA_MEDIA_PROFUNDIDAD` y `MAR_REV_CAMARA_PERFIL_ONDAS`. Renders de revisión: `revision_media_profundidad.png` y `revision_perfil_ondas.png`. Las imágenes anteriores corresponden a la revisión previa y se conservan como historial.

Todo permanece en Blender, pendiente de revisión del usuario. No se exporta ni se modifica la web.
