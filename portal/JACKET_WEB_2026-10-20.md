# Jacket incorporada como tercer modelo · 20 de octubre de 2026

El usuario aprobó la jacket creada en Blender y autorizó añadirla «como las otras». Se incorpora como **tercer modelo independiente** del apartado Tipos de plataformas offshore, conservando semisumergible, TLP, explicación TLP, visor original, laboratorio y aplicación React.

## Acceso y funciones

- Portal: http://localhost:4200/#cimentacion-jacket.
- Visor independiente: http://localhost:4200/assets/jacket/index.html.
- Nuevo enlace «03 · Jacket», junto a los dos accesos anteriores.
- Órbita, zoom, pausa, velocidades 0,5×/1×/1,5× y definición Alta/Ligera.
- Vistas Conjunto, Jacket, Pilotes y Rotor.
- Giro ilustrativo de 12 rpm a 1× sobre el grupo `JACKET_ROTOR_ANIMADO_12_RPM`, eje local glTF `(0,0,-1)`; torre y cimentación permanecen fijas. Se respeta movimiento reducido y se pausa al quedar fuera de pantalla.
- Materiales PBR del modelo aprobado, iluminación de estudio local y acceso al render Blender. No se añaden nuevos mapas de textura en esta exportación.

La descripción identifica una cimentación fija con cuatro patas inclinadas, arriostramientos en X, pilotes y transición a la torre. Es la reconstrucción visual aproximada aprobada de las fotografías, no un cálculo de resistencia o interacción con el terreno.

## Procedencia y archivos

Fuente conservada: `exportaciones/jacket_referencia_2026-10-20/jacket_cimentacion_REVISION.blend`, escena `Jacket_cimentacion_REVISION`.

Fuentes del visor: `exportaciones/jacket_web/`; copia servida por Angular: `public/assets/jacket/`. Incluyen `index.html`, `visor.js`, `visor.css`, `RoomEnvironment.js`, `jacket.glb`, `render_blender.png` y manifiestos. El nuevo visor reutiliza Three.js local de `assets/modelo3d/vendor/`; conservar esa dependencia al trasladarlo.

GLB de 14.303.352 bytes, 1856 nodos y 36 materiales. SHA-256: `606d8e63bcf8c8dd374cb09145204a1c42a21db6d64a7b129c12cc5b421a11f0`. Se exporta geometría y materiales; el giro se recrea en la web, sin hornear clips de animación.

Scripts en AeroGenerador: `export_jacket_web.py`, `preparar_jacket_web.py`, `install_jacket_web.py`, `finalizar_jacket_web.py` y `verify_jacket_web.mjs`. El instalador inicial no debe repetirse sobre la sección ya instalada. La instalación modifica únicamente la plantilla Angular, añadiendo un enlace y un bloque; retirándolos se obtiene la plantilla anterior. Reutiliza estilos y observador de visibilidad existentes, sin modificar su código.

## Comprobaciones

- Compilación Angular correcta. Se mantiene el aviso previo de presupuesto de estilos excedido en 52 bytes; no se ha modificado `app.css`.
- Navegador Chrome de pruebas aislado con SwiftShader: carga, ángulo y cuaternión del rotor en movimiento, pausa efectiva, vistas de jacket y pilotes, control de definición y ausencia de excepciones JavaScript.
- Capturas de conjunto, celosía, pilotes, rotor y móvil; revisadas las vistas de detalle y móvil.
- Anchuras 1440, 1200, 1024 y 390 px sin desbordamiento horizontal. Se observaron 49 llamadas de dibujo en la vista comprobada; no es una garantía de rendimiento en todos los dispositivos.
- HTTP 200 para recursos nuevos y accesos a visores anteriores y paper existente.
- Confirmada la presencia de ambos modelos anteriores, H1 AeroGenerador, laboratorio y visor original.
- 53 archivos protegidos conservan su SHA-256, incluidos los tres visores anteriores, laboratorio, lógica/estilos Angular y fuentes React.

La prueba aísla el visor jacket bloqueando la ejecución de los otros renderizadores únicamente en el perfil de revisión para evitar competencia de GPU; los recursos originales en disco no se modifican.

Informes, capturas, copia previa de plantilla y manifiesto de conservación en `respaldos/jacket_web_2026-10-20/`. Copia posterior `respaldos/portal_jacket_2026-10-20.zip` y SHA-256: fuentes, configuración y los cuatro visores, sin medios históricos, dependencias, perfiles del navegador ni credenciales. Los vídeos, renders y papers previos deben conservarse para restaurar el portal completo.

No se guarda encima del Blender aprobado ni se alteran las otras escenas. Sin publicación ni subida a GitHub. Esta autorización resuelve la espera de revisión registrada en la nota del modelo jacket.
