# Revisión general · 21 de octubre de 2026

Petición: comprobar que todo funciona, conservando el aspecto aprobado del mar. Revisión local de React (5177) y portal Angular (4200), sin publicación ni GitHub ni cambios en Blender.

## Resultado y correcciones

- 67 comprobaciones funcionales superadas en nueve páginas: React, portal, tres papers y cuatro visores. Sin excepciones JavaScript ni respuestas HTTP fallidas en las páginas revisadas.
- 45 recursos locales disponibles y con tipo de contenido correcto: modelos, módulos, vídeos, papers y descargas.
- Los tres vídeos avanzan al reproducir, sin errores multimedia; dos a 3840×2160 y el tercero a 1918×1012.
- Mar original al 75 % animado en React y en las tres plataformas; pausa y movimiento reducido comprobados. Siete animales en cada entorno de plataforma, con vistas de superficie y submarina. No se añaden animales a la portada React.
- Dashboard, actualización de datos, DEL, Predictivo, Rainflow/Cp/Ct, navegación, laboratorio, menús móviles e índices de papers responden. ESIOS devuelve HTTP 200 y datos del día: durante las comprobaciones se mostraron las 09:40 y después las 09:50, hora local. Son datos agregados, no telemetría individual de la turbina.

Se detectaron cuatro errores de consola al agrupar mallas del visor original: piezas con atributos UV y otros atributos incompatibles entraban en el mismo grupo. Corregido en `exportaciones/modelo_blender_web/visor.js` y su copia instalada `public/assets/modelo3d/visor.js` del portal. La clave incluye la firma de atributos y la presencia de índices; se excluyen mallas con skin o morphs. Verificación: 1437 mallas originales pasan a 271, límites geométricos conservados y los 231 objetos destino de animación siguen siendo los mismos. Sin errores de agrupación. Doce comprobaciones posteriores del visor independiente y embebido pasan, sin errores de consola, excepciones ni HTTP; modos pitch, rotor y pausa conservados.

La inspección visual también detectó que el título AeroGenerador quedaba cortado en la portada del portal. Se adapta únicamente su tamaño a la anchura de su columna mediante unidades de contenedor. Texto completo y sin desbordamiento a 1920, 1440, 1024, 768 y 390 px; capturas revisadas. No cambian el laboratorio ni la composición de la portada.

## Verificación y límites

Compilaciones React y Angular correctas. Permanecen avisos de tamaño: paquete React superior a 500 kB; CSS Angular 54 bytes sobre el presupuesto de 16 kB (antes 52 bytes). No impiden compilar.

Pruebas adicionales superadas: análisis técnico y Rainflow; adaptación del modelo Blender; mar React, continuidad de cobertura, velocidad y pausa; tres visores sin GPU; entorno compartido, fauna y arena; agrupación de mallas. La escena y los adaptadores del mar React coinciden byte por byte con el respaldo aprobado del día 21.

Navegador Edge aislado con render SwiftShader, escritorio y emulación móvil. Capturas revisadas de portada React, portal, móvil, visor original y escena submarina. La captura `react-movil.png` del recorrido largo se tomó durante la transición de cámara: la comprobación posterior `react-movil-inicial.png` confirma la turbina visible al cargar en móvil. No se prueba rendimiento de GPU física ni dispositivos móviles reales. Se verifica el botón de impresión de los papers, sin realizar impresión física. No se validan predicciones RUL, DEL medido ni cálculos hidrodinámicos nuevos.

## Evidencias y restauración

Informes y capturas en `respaldos/revision_general_2026-10-21/`. `navegador.json` conserva el recorrido inicial de 67 pruebas, incluidos los errores de agrupación encontrados. `visor_corregido.json` acredita su resolución; `titulo_portal.json` documenta los cinco anchos finales. `recursos.json`, `videos.json`, `agrupacion_visor.json` e `integridad_mar.json` completan las evidencias.

Copias anteriores en `anteriores/`: `visor_fuente.js`, `visor_portal.js` y `app.css`. Para deshacer únicamente estas correcciones, restaurar cada visor en su ruta respectiva y el CSS en `src/app/app.css` del portal; recompilar Angular. Copias finales en `finales/`.

Archivo incremental `respaldos/revision_general_2026-10-21.zip`, con informes, scripts, capturas, documentación y versiones anterior/final; se excluye el perfil del navegador. Integridad ZIP y SHA-256 comprobadas. Ambos servidores locales se mantienen activos.
