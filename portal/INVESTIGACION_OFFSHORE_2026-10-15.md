# Aerogeneradores offshore: desgaste, tendencias y estudios para el 15 de octubre de 2026

Búsqueda realizada y guardada el **14 de octubre de 2026** (Europe/Madrid). Preparado para retomar el **jueves 15 de octubre**. Alcance: diez líneas de investigación con prioridad en degradación, diagnóstico y vida útil. No es una revisión sistemática exhaustiva.

## Qué significa «desgaste» en este trabajo

Conviene separar erosión superficial de palas, desgaste por contacto en rodamientos, fatiga por cargas cíclicas y corrosión de estructuras. Se relacionan, pero requieren indicadores y modelos diferentes. Offshore fijo y offshore flotante comparten problemas; el flotante añade movimiento de plataforma, amarres y cables dinámicos. Las fuentes de cada apartado sustentan esas distinciones.

## Las diez tendencias seleccionadas

### 1. Prevenir la erosión del borde de ataque durante episodios de lluvia

**Componente:** palas y recubrimientos. **Prioridad: alta.**

La línea combina modelos del tamaño de gota y condiciones de lluvia con una reducción temporal de velocidad del rotor. Barfknecht y von Terzi (2025) estudian esta operación protectora en un caso basado en la turbina de referencia IEA de 15 MW. El tamaño de gota modifica la predicción del daño y la estrategia protectora. Los resultados dependen del emplazamiento y recubrimiento; no son una reducción universal garantizada. [Estudio S1](https://wes.copernicus.org/articles/10/315/2025/).

**Propuesta para nuestro proyecto:** un futuro escenario visual de lluvia, rpm y daño de erosión relativo. Presentarlo como demostración, sin inventar milímetros reales de pérdida de material.

### 2. Modelar el fretting de rodamientos de pitch incluso cuando la pala apenas se mueve

**Componente:** pistas y contactos de rodamientos de pala. **Prioridad: alta.**

Cubillas et al. (2025) analizan desgaste por micromovimientos durante periodos operativos y no operativos. Su modelo localiza zonas críticas a partir de energía disipada en el contacto. La limitación esencial es que estudia contactos **sin lubricante**: no se puede trasladar directamente a un rodamiento comercial engrasado ni usarlo para asignar una vida real. [Estudio S2](https://wes.copernicus.org/articles/10/401/2025/).

**Propuesta:** relacionar actividad de pitch, carga y lubricación en una explicación técnica. Distinguir el aceite de una multiplicadora de la grasa usada en rodamientos de pitch; no confundirlos con combustible.

### 3. Fusionar señales para detectar fallos de la transmisión y estimar su evolución

**Componente:** rodamientos, multiplicadora y sistemas de pitch. **Prioridad: alta.**

La revisión de Kestel et al. (junio de 2026) reúne vigilancia con SCADA, vibración de alta frecuencia, acústica, aprendizaje automático y gemelos digitales. La tendencia es combinar información en vez de confiar en una sola temperatura o alarma. El artículo es una síntesis del campo, no la validación de un detector único. [Revisión S3](https://wes.copernicus.org/articles/11/2103/2026/).

**Propuesta:** preparar un mapa componente → modo de fallo → señal observable → método de diagnóstico. Nuestros datos ESIOS no contienen vibración ni análisis de aceite de una turbina; cualquier señal de ese tipo deberá ser sintética o proceder de un conjunto externo identificado.

### 4. Vigilar recubrimientos y corrosión para anticipar pérdida de integridad

**Componente:** torre, cimentación y subestructura marina. **Prioridad: alta.**

El informe WILLOW actualizado en enero de 2026 describe sensores electroquímicos, ultrasonidos y la combinación con inspección termográfica para estudiar recubrimientos, picaduras y corrosión. También documenta trabajo de pronóstico de cargas y vida restante. El informe cubre los primeros 18 meses; no debe presentarse como evaluación final del proyecto, aunque CORDIS registre su cierre en septiembre de 2026. [Informe S4](https://cordis.europa.eu/project/id/101122184/reporting).

**Propuesta:** diferenciar pérdida de espesor, picaduras y fatiga; pedir datos materiales antes de calcular años de vida restante. La corrosión y la fatiga no se sustituyen por un porcentaje arbitrario de «salud».

### 5. Controlar el parque considerando producción y fatiga conjuntamente

**Componente:** rotor, torre y turbinas situadas tras otras turbinas. **Prioridad: alta.**

Tamaro et al. (mayo de 2026) ensayan control activo de potencia y reservas en túnel de viento, evaluando también cargas y fatiga. Micheletto et al. (agosto de 2026) estudian control de estelas y muestran que potencia, coeficiente de empuje y sus fluctuaciones cambian según la configuración. Mejorar producción no implica reducir todas las cargas. Son ensayos a escala, no garantías para un parque offshore concreto. [S5](https://wes.copernicus.org/articles/11/1607/2026/), [S11](https://wes.copernicus.org/articles/11/2895/2026/).

**Propuesta:** estudiar una comparativa «producción prioritaria / cargas limitadas», con series temporales y DEL, antes de diseñar un control real.

### 6. Usar modelos sustitutos rápidos para estimar cargas de fatiga en flotantes

**Componente:** raíz de pala, base de torre, apoyo de yaw y conexión de amarres. **Prioridad: alta.**

Bellini et al. depositaron el **13 de octubre de 2026** un preprint sobre estimación rápida de DEL usando datos de OpenFAST, FAST.Farm y MLife. Combina redes neuronales con corrección de errores y señala dificultades de generalización a condiciones y controles diferentes. La ficha consultada es arXiv v1: investigación preliminar, sin revisión por pares verificada. [Preprint S6](https://arxiv.org/abs/2610.18264).

**Propuesta:** empezar por un caso reproducible y comparar un predictor sencillo con el cálculo de referencia. Separar entrenamiento y prueba por condiciones de mar y viento, no solo aleatoriamente.

### 7. Estudiar amarres y cables dinámicos como parte del sistema completo

**Componente:** cadenas, líneas de amarre, anclajes y cables eléctricos dinámicos. **Prioridad: alta para flotantes.**

Sirkis, Lozon y Hall (abril de 2026) publican diseños abiertos de parques flotantes de referencia para tres regiones. Integran plataformas, amarres y cables y consideran restricciones espaciales y de diseño. Constituyen una base reproducible para investigar cargas, curvaturas e interferencias; no son registros de desgaste observado en explotación. [Artículo S7](https://wes.copernicus.org/articles/11/1429/2026/).

**Propuesta:** añadir primero una ficha documental de sistema flotante, tensión y curvatura. No deducir fatiga de un cable a partir de MW agregados. Los datos de referencia se pueden localizar en la sección de disponibilidad del artículo.

### 8. Construir gemelos digitales federados y sensores virtuales trazables

**Componente:** turbina, parque y entorno meteorológico-oceanográfico. **Prioridad: media-alta.**

DTWO informa en mayo de 2026 de una arquitectura inicial que conecta módulos de ambiente, estelas, emplazamiento, turbinas y red. La idea federada permite combinar modelos y datos sin centralizar toda la información comercial. El avance documentado es parcial; un portal 3D por sí solo no constituye un gemelo digital validado para pronóstico de daño. [Informe S8](https://cordis.europa.eu/project/id/101146689/reporting).

**Propuesta:** registrar en cada futura variable su origen, frecuencia, unidades, incertidumbre y si es medida, estimada o simulada. Mantener separado el escenario del laboratorio y la generación real agregada.

### 9. Combinar inspección robótica con detección subsuperficial y reparación

**Componente:** palas de material compuesto. **Prioridad: media-alta.**

Romain integra investigación en shearografía, termografía con calentamiento láser y reparación robotizada de composites. El informe accesible está actualizado en **septiembre de 2024**, aunque la ficha registra final de proyecto en mayo de 2026. Sirve como antecedente de una línea activa; no se ha verificado aquí una demostración final de 2026 ni despliegue comercial generalizado. [Informe S9](https://cordis.europa.eu/project/id/101070320/reporting).

**Propuesta:** preparar un esquema «detección → clasificación → inspección interna → reparación → comprobación». Una fotografía superficial no permite descartar por sí sola delaminación interna.

### 10. Diseñar torres flotantes teniendo en cuenta fatiga desde la optimización inicial

**Componente:** torre y su interacción con plataforma. **Prioridad: media.**

FLOAT, depositado en enero de 2026, propone una metodología de optimización que combina estimación eficiente de fatiga y simulaciones acopladas. El caso se centra en una referencia flotante de 22 MW. Sus conclusiones están limitadas a los casos y condiciones de carga estudiados, incluyendo viento y oleaje alineados; no es una certificación completa de vida de diseño. [Preprint S10](https://arxiv.org/abs/2601.01657).

**Propuesta:** usarlo para entender el compromiso masa–rigidez–resonancia–fatiga. No trasladar su vida estimada a nuestro modelo de 5 MW ni cambiar la escala del portal sin necesidad.

## Qué considero prioritario para AeroGenerador

La siguiente selección es una propuesta propia a partir de las fuentes, no una clasificación publicada:

| Orden | Tema | Primera salida útil | Información que haría falta después |
| --- | --- | --- | --- |
| 1 | Erosión de palas por lluvia | Ficha con causa, señales y mitigación | Lluvia, distribución de gotas, velocidad de punta y material |
| 2 | Corrosión y fatiga estructural | Diferenciar mecanismos en un diagrama | Espesores, geometría, ambiente y series de tensión |
| 3 | Pitch, lubricación y fretting | Ficha rodamiento–contacto–mantenimiento | Movimiento, carga, grasa y validación experimental |
| 4 | Diagnóstico de transmisión | Matriz de señales y modos de fallo | Vibración, temperaturas y/o análisis de aceite identificado |
| 5 | Flotantes: amarres y cables | Mapa del sistema y variables críticas | Movimiento de plataforma, oleaje, tensiones y curvaturas |

## Reglas para no convertir el estudio en datos inventados

- La generación agregada de ESIOS no permite medir desgaste individual, corrosión, lubricación ni vida útil restante.
- Para fatiga hacen falta historia de cargas/tensiones y parámetros de material; rainflow, curvas S–N y acumulación de daño no salen de un valor aislado de empuje.
- T·v no es generación eléctrica adicional ni una medida de desgaste.
- Los resultados numéricos de un artículo deben conservar sus condiciones, escala, incertidumbre y limitaciones.
- Identificar una tendencia no demuestra que esté implantada en todos los parques.
- Conservar el laboratorio que el usuario eligió. Esta investigación no modifica la web ni vuelve a introducir los cambios de interfaz deshechos.

## Bibliografía comprobada

Se han consultado páginas oficiales de publicación, resúmenes de autores e informes de proyectos. No se descargaron ni revisaron íntegramente todos los PDF, códigos y conjuntos de datos. Las fechas siguientes son de publicación o de actualización del informe, no fechas de consulta.

- **S1 · 2025-01-30 · Barfknecht y von Terzi.** [Drop-size-dependent effects in leading-edge rain erosion and their impact on erosion-safe mode operation](https://wes.copernicus.org/articles/10/315/2025/). Artículo de investigación revisado por pares. DOI: 10.5194/wes-10-315-2025.

- **S2 · 2025-02-05 · Cubillas et al..** [Semi-analytical methodology for fretting wear evaluation of unlubricated pitch bearing raceways under operative and non-operative periods](https://wes.copernicus.org/articles/10/401/2025/). Artículo de investigación revisado por pares. DOI: 10.5194/wes-10-401-2025.

- **S3 · 2026-06-18 · Kestel et al..** [Condition monitoring of wind turbine drivetrains: state-of-the-art technologies, recent trends, and future outlook](https://wes.copernicus.org/articles/11/2103/2026/). Artículo de revisión; síntesis, no un nuevo experimento. DOI: 10.5194/wes-11-2103-2026.

- **S4 · 2026-01-14 · Consorcio WILLOW / Comisión Europea.** [WILLOW — informe periódico del proyecto](https://cordis.europa.eu/project/id/101122184/reporting). Informe oficial; periodo estudiado 2023-10-01 a 2025-03-31. DOI: 10.3030/101122184.

- **S5 · 2026-05-08 · Tamaro et al..** [Scaled testing of maximum-reserve active power control](https://wes.copernicus.org/articles/11/1607/2026/). Investigación experimental en túnel de viento, revisada por pares. DOI: 10.5194/wes-11-1607-2026.

- **S6 · 2026-10-13 · Bellini et al..** [Data-Driven Surrogate-Model for Real-Time Loads Prediction in Floating Wind Farms](https://arxiv.org/abs/2610.18264). Preprint arXiv v1; no revisión por pares verificada. DOI: 10.48550/arXiv.2610.18264.

- **S7 · 2026-04-28 · Sirkis, Lozon y Hall.** [Reference floating wind array designs for three representative regions](https://wes.copernicus.org/articles/11/1429/2026/). Artículo de descripción de datos y diseños de referencia, revisado por pares. DOI: 10.5194/wes-11-1429-2026.

- **S8 · 2026-05-04 · Consorcio DTWO / Comisión Europea.** [Federated Digital Twins for Wind-Offshore — informe periódico](https://cordis.europa.eu/project/id/101146689/reporting). Informe oficial; periodo estudiado 2024-06-01 a 2025-11-30. DOI: 10.3030/101146689.

- **S9 · 2024-09-25 · Consorcio Romain / Comisión Europea.** [Development of a robotic maintenance system for wind turbine blades — informe periódico](https://cordis.europa.eu/project/id/101070320/reporting). Informe oficial anterior; contexto de proyecto con fin registrado en mayo de 2026. DOI: 10.3030/101070320.

- **S10 · 2026-01-04 · Ribeiro et al..** [FLOAT: Fatigue-Aware Design Optimization of Floating Offshore Wind Turbine Towers](https://arxiv.org/abs/2601.01657). Preprint arXiv v1; no revisión por pares verificada. DOI: 10.48550/arXiv.2601.01657.

- **S11 · 2026-08-12 · Micheletto, Fransson y Segalini.** [Wind-tunnel analysis of wake-steering control strategies on a multi-column model wind farm](https://wes.copernicus.org/articles/11/2895/2026/). Investigación experimental revisada por pares. DOI: 10.5194/wes-11-2895-2026.

## Para retomar mañana

Abrir `C:/Users/rober/Desktop/Pracicas WEBS/AeroGenerador/documentacion/para_manana_2026-10-15.md`. La investigación ya está hecha y guardada; no se ha programado una búsqueda automática ni un aviso horario.
