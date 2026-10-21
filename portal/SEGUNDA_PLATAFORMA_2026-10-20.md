# Segunda plataforma incorporada: tensores y anillo · 20 de octubre de 2026

El usuario aprobó el modelo Blender («está perfecto, agrégalo»), pidió mejorar los materiales y que gire el aerogenerador. Se añade como **segunda plataforma**, conservando la semisumergible, el visor original, el laboratorio y la aplicación React.

## Acceso y resultado

- Portal: http://localhost:4200/#plataforma-tensores.
- Visor independiente: http://localhost:4200/assets/plataforma-tensores/index.html.
- Apartado «Tipos de plataformas offshore» con enlaces «01 · Semisumergible» y «02 · Tensores y anillo».
- Modelo 3D editable procedente de la escena aprobada `Plataforma_tensores_anillo_REVISION`: aerogenerador original, seis flotadores amarillos, cuello central, seis tensores y anillo gris inferior.
- Rotor animado a 12 rpm a velocidad 1×. Pausa, velocidades 0,5×/1×/1,5× y vistas Conjunto, Plataforma, Anillo y Rotor. Respeta movimiento reducido y pausa fuera de pantalla.
- Acabado PBR con seis mapas de 512×512 de normal y rugosidad, ocho materiales mejorados, pintura satinada, acero y gris mate. Texturas embebidas en el GLB, UV preparadas para las mallas que carecían de ellas, cantos suaves en piezas del anillo y materiales aislados de las instancias anteriores.
- Iluminación de estudio mediante entorno local de Three.js, reflejos y exposición ajustados. Definición Alta o Ligera; Alta permite la densidad del dispositivo hasta 2×.

La plataforma mantiene las proporciones aproximadas aprobadas de las fotografías. El giro es ilustrativo: no se calculan oleaje, estabilidad ni pretensión. Se anima el rotor, sin girar la torre o la base.

## Archivos

Fuentes y exportación: `exportaciones/plataforma_tensores_web/`. Versión Blender independiente `plataforma_tensores_materiales_web.blend`, GLB `plataforma_tensores.glb` (16.548.328 bytes), render PNG, vistas de detalle, mapas y manifiestos.

Copia servida por Angular: `public/assets/plataforma-tensores/`. Incluye `index.html`, `visor.js`, `visor.css`, `RoomEnvironment.js`, GLB y render. Reutiliza Three.js local desde `assets/modelo3d/vendor/`; conservar ese directorio al trasladar el visor.

Scripts: `preparar_materiales_tensores.py`, `export_tensores_materiales_web.py`, `preparar_visor_tensores.py`, `install_tensores_web.py`, `finalizar_tensores_web.py` y `verify_tensores_web.mjs`, en `scripts/` de AeroGenerador. El instalador inicial no debe repetirse sobre la sección ya instalada. El exportador conserva el archivo Blender de revisión y no guarda sobre versiones previas.

## Verificación y conservación

- Compilación Angular correcta; portal disponible.
- GLB con 2193 nodos, seis imágenes embebidas y ocho materiales con mapas de normal y rugosidad.
- Navegador: carga correcta, ángulo y cuaternión del rotor cambian, pausa detiene el movimiento, selección de plataforma/anillo y control de definición funcionan; sin excepciones JavaScript.
- Se observan 15 grupos renderizados con ambos mapas de material y 49 llamadas de dibujo en la vista comprobada. Es una observación de esa prueba, no una garantía de rendimiento general.
- Capturas de conjunto, estructura, rotor, anillo y móvil. Revisadas anchuras 1440, 1200, 1024 y 390 px sin desbordamiento horizontal.
- HTTP 200 para nuevo visor, modelo, materiales incorporados y render; también para visores anteriores, paper y vídeo existentes.
- 42 archivos protegidos (primeros visores, laboratorio, lógica Angular y fuentes React) conservan su SHA-256. La plantilla recibe enlaces y un bloque adicional; el contenido previo se comprueba al retirar esas adiciones.
- La prueba gráfica usa Chrome aislado con SwiftShader. La comprobación espera a que el visor esté visible y termine su primera compilación de shaders antes de medir el giro.

Documentación y capturas en `respaldos/tensores_web_2026-10-20/`. Copias previas de plantilla y estilos en esa carpeta. Copia posterior `respaldos/portal_segunda_plataforma_2026-10-20.zip` y su SHA-256: código, configuración y los tres visores, sin medios históricos, dependencias, credenciales ni perfiles de navegador. Conservar los vídeos y papers existentes para restaurar el portal completo.

El primer modelo y los archivos Blender anteriores permanecen intactos. No se ha publicado ni subido a GitHub. Esta aprobación resuelve la espera de revisión registrada en la nota anterior y autoriza únicamente la incorporación adicional solicitada.


## Identificación TLP · 20 de octubre de 2026

La segunda plataforma se identifica como TLP (Tension Leg Platform). El portal y el visor explican sus tendones verticales pretensados y enlazan dos fuentes primarias DOE/Sandia. El anillo se describe como parte del modelo, no como requisito universal. Geometría y animación intactas. Ver `TLP_EXPLICACION_2026-10-20.md`.
