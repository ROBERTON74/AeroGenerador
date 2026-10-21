# Papers: diseño editorial y tendencias · 20 de octubre de 2026

Se rediseñan los documentos enlazados desde las tres tarjetas del portal: DEL, vida útil/RUL y Rainflow/Cp/Ct. Se conservan las rutas `assets/papers/del.html`, `vida-util.html` y `rainflow-cp-ct.html`. Estilos y comportamiento de impresión propios, sin dependencias externas ni modificaciones del CSS global o del laboratorio.

Presentación: cabecera azul marino, lectura sobre fondo blanco, índice con anclas, navegación entre documentos, fórmulas y variables legibles, ejemplos calculados, fuentes enlazadas y estilos de impresión A4. Diseño comprobado en escritorio y con iframe de 390 píxeles CSS. Se corrige Volver a papers para regresar a `/#papers` del portal Angular.

Contenido revisado: el DEL conserva su convención de rango, unidades, exponente y ciclos de referencia. Miner no se presenta como ecuación universal de RUL; tampoco se deduce Ct de Cp. Se distingue potencia aerodinámica de eléctrica. La vista DEL del proyecto sigue siendo ilustrativa, Predictivo no proporciona RUL ni fallos validados y Rainflow utiliza una señal sintética. No se implementa ningún modelo nuevo de desgaste ni pronóstico.

## Tendencias y fuentes consultadas

Síntesis de trabajos publicados, consultados en sus páginas originales el 20/10/2026. Selección reciente, no revisión sistemática ni clasificación exhaustiva de todo el campo.

- DEL: representatividad de ensayos de pala y corrección de carga media; modelos probabilísticos rápidos para offshore flotante; continuidad de ciclos en datos comprimidos.
- RUL: sensores virtuales calibrados con datos individuales; incertidumbre en extensión de vida; seguimiento de fatiga con datos compactos.
- Rainflow/Cp/Ct: control de reservas de potencia e interacciones de estela; residuos entre ventanas Rainflow; transferencia de cargas a componentes.

Fuentes primarias, con resúmenes y atribuciones en cada documento y catálogo reproducible `exportaciones/papers_web/fuentes.json`:

1. Melcher et al. (21/04/2026), https://doi.org/10.5194/wes-11-1305-2026
2. Singh et al. (05/12/2025), https://doi.org/10.5194/wes-10-2865-2025
3. Oliveira et al. (12/10/2026), https://doi.org/10.5194/wes-11-3841-2026
4. Faria et al. (06/05/2026), https://doi.org/10.5194/wes-11-1583-2026
5. Mozafari et al. (20/02/2026), https://doi.org/10.5194/wes-11-621-2026
6. Tamaro et al. (08/05/2026), https://doi.org/10.5194/wes-11-1607-2026

## Verificación y conservación

Seis capturas reales de Edge: los tres documentos a 1440 y 390 píxeles CSS. Índices y secciones presentes, sin desbordamiento horizontal del documento; CSS cargado y referencias primarias accesibles durante la investigación. Compilación Angular correcta; persiste el aviso anterior de 52 bytes sobre el presupuesto de `app.css`, que no se modifica. El modo de impresión se prepara con CSS y el botón nativo del navegador; no se ha revisado una impresión física.

Fuente reproducible en `scripts/preparar_papers_2026.py`; destino local Angular en `public/assets/papers/`. Respaldo incremental, documentos anteriores, fuentes y comprobaciones en `respaldos/papers_editoriales_2026-10-20/` y ZIP homónimo. Para revertir, recuperar los tres HTML anteriores y retirar los nuevos `papers.css` y `papers.js` si ya no se usan. Los modelos, plataformas y React se conservan. Sin publicación ni GitHub.
