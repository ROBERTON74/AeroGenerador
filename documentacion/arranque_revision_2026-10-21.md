# Arranque y revisión local · 21 de octubre de 2026

Petición del usuario: «revisa y levanta todo bien».

Portal Angular en http://localhost:4200/ y aplicación React en http://localhost:5177/ activos, ambos con HTTP 200 al cierre. Se conserva el código y el aspecto aprobados; no se cambian modelos, interfaces, mar ni datos. Sin publicación ni GitHub.

Resultados de esta sesión:

- 70 comprobaciones funcionales distintas superadas: aplicación React y datos ESIOS, detalles SCADA, DEL, Predictivo, Rainflow/Cp/Ct, laboratorio, navegación, papers, móvil, visor original y tres visores offshore.
- 45 recursos HTTP correctos, con tipos de contenido apropiados.
- Tres vídeos reproducidos: sin errores, dos a 3840×2160 y uno a 1918×1012.
- En los tres entornos offshore: siete animales, mar al 75 %, movimiento, pausa conjunta, vista submarina, restablecimiento y anchura móvil correctos.
- Pruebas existentes de análisis técnico, adaptador Blender y mar React correctas: 441 rayos de cobertura sin huecos, pausa y velocidad 0,75 verificadas.
- Compilaciones React y Angular correctas. Avisos conocidos: paquete React superior a 500 kB y CSS Angular 54 bytes por encima de 16 kB.
- Sin excepciones JavaScript, errores de consola ni HTTP fallidos en las páginas auditadas. Revisadas visualmente las capturas de portada React, portal y entorno submarino.

Evidencias: `respaldos/arranque_revision_2026-10-21/`, con `resumen.json`, `recursos.json`, `navegador.json`, `visores.json`, `videos.json` y capturas. Se conservan los informes de la revisión anterior.

Incidencia del mecanismo de pruebas: el primer recorrido se interrumpió durante una captura al iniciar otra prueba sobre el mismo navegador aislado. Se repitió el bloque completo de cuatro visores en un recorrido separado, terminado con 26 comprobaciones correctas. El informe inicial conserva el timeout para trazabilidad; no representa un fallo funcional de la web. El resumen combina comprobaciones distintas de los recorridos terminados.

Pruebas de navegador con Edge aislado y SwiftShader. No se valida rendimiento de GPU física ni dispositivos móviles reales. Servidores iniciados fuera del aislamiento porque esbuild no podía leer sus directorios bajo el entorno restringido. Credenciales conservadas en sus archivos de entorno.
