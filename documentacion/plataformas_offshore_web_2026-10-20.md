# Tipos de plataformas offshore · 20 de octubre de 2026

Ampliación posterior aprobada: [segunda plataforma con tensores y anillo, materiales PBR y rotor animado](plataforma_tensores_web_2026-10-20.md), añadida sin sustituir esta primera plataforma. Acceso directo: http://localhost:4200/#plataforma-tensores.

El usuario autoriza añadir el conjunto flotante a una pestaña nueva del portal, con las palas en movimiento, **sin sustituir nada existente**. Implementado en el portal Angular (4200). La aplicación React (5177) no se modifica en esta petición.

## Acceso y contenido

- Apartado: http://localhost:4200/#plataformas-offshore.
- Visor independiente: http://localhost:4200/assets/plataformas-offshore/index.html.
- Navegación: «Tipos de plataformas offshore».
- Primera plataforma: flotante semisumergible triangular de tres columnas, con el mástil y aerogenerador original de Blender.
- Órbita, zoom, vistas Conjunto / Plataforma / Rotor, pausa y velocidades 0,5× / 1× / 1,5×. Teclado: flechas para explorar, +/− para zoom, Inicio para encuadrar y espacio para pausar, con foco sobre la escena.
- Giro ilustrativo de 12 rpm a 1×, recreado en Three.js sobre el padre `GIRO_ROTOR_ORIGINAL_12_RPM`, eje local convertido a glTF `(0,0,-1)`. No se mezcla el pitch original con el giro nuevo.
- Se respeta la preferencia de movimiento reducido al iniciar; la reproducción se detiene cuando el iframe sale de pantalla o la pestaña queda oculta.
- Se incluye un enlace al render PNG de Blender del mismo conjunto.

## Procedencia y archivos

Escena fuente `Flotante_con_aerogenerador_original`, guardada en `exportaciones/plataforma_flotante_referencia_2026-10-20/flotante_con_aerogenerador_original.blend`. Se exporta geometría 3D y materiales PBR, con sus grupos; la web genera el giro del rotor. El GLB no contiene clips de animación ni depende de un vídeo. Los nodos procedurales de microrrelieve de Blender no se hornean como texturas para esta versión web; se conservan colores y parámetros PBR compatibles.

GLB: `plataforma_flotante.glb`, 13.634.604 bytes. Los detalles estáticos se agrupan por padre, material y atributos compatibles, conservando el rig: 54 llamadas de dibujo observadas en la prueba. La reconstrucción de la plataforma mantiene proporciones aproximadas tomadas de fotografías; no representa una simulación de oleaje, estabilidad o cargas de amarre.

Fuentes independientes en `exportaciones/plataformas_offshore_web/` y copia servida por el portal en `public/assets/plataformas-offshore/`. Archivos `index.html`, `visor.js`, `visor.css`, GLB, `render_blender.png` y manifiesto `procedencia.json`. Se reutilizan los módulos locales Three.js del visor anterior sin cambiarlos; al mover el nuevo visor hay que conservar también `assets/modelo3d/vendor/`.

Scripts en AeroGenerador: `scripts/export_flotante_web.py`, `scripts/install_plataformas_offshore.py`, `scripts/finalizar_plataformas_offshore.py`, `scripts/verify_plataformas_offshore.mjs`. El instalador inicial es para una instalación nueva; no se repite sobre una sección ya instalada. El script de finalización sincroniza únicamente el nuevo visor, notas y copia.

## Conservación y comprobaciones

La plantilla Angular recibe únicamente el enlace nuevo y una sección hermana antes del laboratorio; al retirar esos dos bloques el contenido coincide con la plantilla previa. Se amplía el observador de visibilidad para los dos iframes. El resto del contenido, portada técnica, vídeos, papers, laboratorio y visor Blender anterior permanecen.

- Compilación Angular correcta.
- Navegador: modelo cargado, rotor en movimiento, pausa efectiva, vista de plataforma seleccionable, sin excepciones JavaScript.
- Revisadas capturas de escritorio y móvil. Anchuras 1440, 1200, 1024 y 390 px sin desbordamiento horizontal.
- Portal H1 «AeroGenerador», visor original y laboratorio presentes como antes.
- HTTP 200 para nuevo visor, GLB, estilos, script y render, además del visor anterior, tres papers y vídeo de rotación existente.
- SHA-256 de 15 archivos protegidos del laboratorio y del visor anterior sin cambios.
- Pruebas gráficas en Chrome aislado con SwiftShader; no equivalen a pruebas de rendimiento en todos los dispositivos físicos.

Informes y capturas en `respaldos/plataformas_offshore_2026-10-20/`. Copia previa de los tres archivos Angular modificados y manifiesto de conservación en la misma carpeta. Copia posterior: `respaldos/portal_plataformas_offshore_2026-10-20.zip` y su SHA-256; incluye código, configuración, nuevo visor y visor anterior, pero no medios históricos, dependencias, perfiles de navegador ni credenciales. Para restaurar un portal completo deben conservarse los vídeos, renders y papers anteriores.

No hay nueva publicación ni subida a GitHub. El Blender fuente original y las versiones flotantes anteriores se conservan.
