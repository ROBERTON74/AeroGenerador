# Mar de Blender en la animación principal · 20–21 de octubre de 2026

Confirmación posterior del usuario: acabado visual aprobado; conservar exactamente su aspecto y mantener el movimiento original del mar al 75 %. Se ha comprobado la conexión existente de la animación; esta confirmación no modifica el diseño ni otros elementos.

El usuario pidió sustituir únicamente el mar de la aplicación principal de su captura. Corresponde a React, puerto 5177. Se reutilizan los cinco archivos de superficie y movimiento ya exportados de Blender para las plataformas del portal, sin importar fauna ni arena.

## Cambio y conservación

`WindTurbineScene.jsx` solo cambia en cuatro puntos: importación del adaptador, recepción de movimiento reducido en `OffshoreEnvironment`, sustitución del nodo `AnimatedSea` y paso de esa preferencia. Una prueba compara el archivo completo con la versión anterior aplicando exactamente esas cuatro sustituciones.

`BlenderSea.jsx` carga y libera el recurso, lo actualiza en el bucle existente de React Three Fiber y conserva el mar anterior durante la carga o si falla. `blenderSea.js` reproduce los deltas originales de las cinco mallas, con interpolación del clip y velocidad temporal 0,75×. No se añaden ondas nuevas. Con movimiento reducido el agua queda estática y no avanza con el documento oculto.

La superficie mantiene la escritura de profundidad del mar anterior. Esto impide que los planos transparentes del corte submarino existente se dibujen por delante del agua como una mancha rectangular. El corte y los demás objetos se conservan.

La escala uniforme es `MODEL_SCALE * 1.2`, equivalente a la presentación del aerogenerador principal. Se mantiene la altura anterior Y=-0,08 y la opacidad del 96 %, evitando que el corte didáctico submarino existente altere el aspecto del agua. Se repiten 13×13 módulos originales de 150 m, aproximadamente 119 unidades de presentación. La geometría lejana usa muestras del mismo clip; el entorno cercano a la plataforma y el módulo de la cámara mantienen el detalle completo. Ambos niveles comparten un mapa dinámico de las normales originales para evitar un cambio rectangular de acabado al reducir la geometría distante; no se añaden ondas.

Aerogenerador, posición, cámara, recorrido, palas, pitch/yaw, monopilote, barco, boyas, cielo, iluminación, cuadrícula, corte submarino, controles, dashboard, vistas de análisis y servicios de datos conservan su código. No se modifica el portal Angular ni sus tres visores de plataformas, Blender o los papers.

## Recursos y atribución

Copias byte a byte en `public/models/mar-blender/`: `mar_base.glb`, `mar_animacion.json` y los tres `mar_movimiento_*.bin.gz`. Coinciden con `exportaciones/entorno_offshore_web/`; SHA-256 en `procedencia.json`.

Free Ocean Simulation Tiled, the9thearl, CC BY 4.0 según metadatos recibidos. Fuente: https://sketchfab.com/3d-models/free-ocean-simulation-tiled-ec999170128341a29dfe6d75878e2303. Crédito y adaptaciones en `public/models/mar-blender/CREDITOS.txt`. Geometría, textura reducida y animación derivadas de la exportación existente; repetición, escala uniforme y reducción de detalle lejano para presentación web. Representación artística, sin nueva simulación hidrodinámica.

## Verificaciones y respaldo

- Compilación React de producción correcta; aviso de tamaño de paquete Three.js ya existente.
- Carga real por HTTP de Vite, con detección de gzip ya descomprimido por el navegador.
- Cinco mallas, 169 módulos, deformación original comprobada, reproducción al 75 %, pausa y liberación del recurso.
- Malla lejana construida a partir de los triángulos originales, conservando todos sus bordes e islas UV y corrigiendo su orientación durante la deformación para evitar caras invertidas. Comparación con 441 rayos verticales por la cara superior entre módulo original y reducido: ninguna muestra de agua perdida.
- Comparación completa del componente principal: solo las cuatro sustituciones previstas.
- Navegador Edge con WebGL SwiftShader en perfil aislado: mar y turbina Blender cargados, avance de animación, movimiento reducido, control de Rotor y ancho móvil de 390 píxeles. Sin excepciones de JavaScript. No equivale a una prueba prolongada de rendimiento ni a una prueba en dispositivo físico.

Capturas, informes y archivo anterior en `respaldos/react_mar_blender_2026-10-20/`; ZIP final `respaldos/react_mar_blender_2026-10-21.zip` con fuentes y recursos. Para revertir, restaurar `anteriores/WindTurbineScene.jsx`; los nuevos componentes y recursos dejarán de utilizarse. Se conservan los guardados anteriores, incluidos los avances del día 20. Sin publicación ni GitHub.
