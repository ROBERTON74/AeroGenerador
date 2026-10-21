# Mantenimiento predictivo y Rainflow / Cp / Ct · 20 de octubre de 2026

## Vistas añadidas por petición del usuario

Se añaden dos controles al menú de la aplicación React:

- **Predictivo**: http://localhost:5177/?vista=predictivo.
- **Rainflow · Cp/Ct**: http://localhost:5177/?vista=rainflow.

Se mantienen el modelo Blender animado, la cimentación offshore, la vista DEL, el dashboard y sus paneles, las fuentes de datos y los controles de cámara. El portal Angular no se modifica en esta petición. En móvil, los seis controles de escena se organizan en dos filas y los paneles técnicos tienen desplazamiento interno para conservar visible el modelo.

## Mantenimiento predictivo: demostración de seguimiento

El panel ofrece tres componentes seleccionables: tren de potencia, palas/rodamientos y torre/transición offshore. Cada selección acerca la cámara y destaca en ámbar el componente correspondiente. **El color ámbar indica selección de inspección, no una avería detectada.**

Se muestran las estimaciones SCADA que ya produce la aplicación: temperatura de gearbox, vibración, pitch, desalineación y carga mecánica. Cuando existe más de una muestra, se dibuja la carga estimada del historial de la sesión, con su mínimo/máximo y unidades. No se rellena ese historial con datos artificiales.

Las etiquetas «Seguimiento de referencia» y «Revisar escenario» son reglas didácticas: gearbox ≥ 70 °C o vibración ≥ 2,3 mm/s para el tren de potencia; desalineación ≥ 12° para palas/rodamientos; carga ≥ 75 % para torre. Son umbrales propios de la demostración, no recomendaciones del fabricante ni límites certificados. Si faltan datos se muestra «Sin estimaciones».

**No se ha entrenado un predictor de fallos ni se calcula RUL/vida útil restante, fecha de mantenimiento o probabilidad de avería.** Los valores mecánicos siguen derivados de generación agregada; una predicción validada requeriría sensores, histórico de condición y evidencia de fallos. Como referencia de contexto se incluye [NREL, Wind Turbine Gearbox Condition Monitoring Round Robin Study, informe 54530](https://docs.nrel.gov/docs/fy12osti/54530.pdf), dedicado a técnicas de monitorización con datos de ensayo y campo. Los umbrales de la interfaz no proceden de ese informe.

## Rainflow, Cp y Ct: escenario independiente

El panel permite editar viento de 0–20 m/s, Cp de 0–0,59 y Ct de 0–1,2. Son supuestos independientes para una turbina de diámetro 145 m y densidad 1,225 kg/m³.

`P = ½ρ A Cp v³` muestra **potencia aerodinámica captada**, en MW y sin límite nominal; no se interpreta como generación eléctrica ni se suma a ESIOS. `T = ½ρ A Ct v²` muestra empuje en kN. Con 8 m/s, Cp=0,45 y Ct=0,8: aproximadamente 2,3303 MW y 517,8476 kN. La independencia entre parámetros se verifica: Cp modifica P, Ct modifica T, y duplicar v multiplica P por ocho y T por cuatro.

Se añade una representación 3D conceptual con flechas/partículas turquesa para el flujo de energía y flecha ámbar para el empuje. El modelo continúa siguiendo las rpm, pitch y yaw equivalentes de la aplicación. **Los deslizadores cambian solo los cálculos del escenario y su señal, no la telemetría ni el movimiento principal.**

La señal de carga es artificial, tiene 60 s, se muestrea cada 0,25 s y se expresa en **unidades arbitrarias**. Su escala es `100 Ct (v/8)²`; combina senoides a 0,2 Hz, 0,6 Hz y 0,035 Hz con amplitudes relativas 0,25, 0,1 y 0,06. Esos componentes se eligen para explicar ciclos anidados, sin pretender reconstruir una carga estructural real.

Rainflow elimina mesetas, extrae cambios de sentido y utiliza una pila de tres puntos para contar ciclos cerrados; los residuos abiertos son medios ciclos. Se muestran la señal, el total de ciclos/medios ciclos y un histograma de cinco intervalos de rango. En el escenario inicial el conteo es 36,5 ciclos y el rango mayor aproximadamente 52,36 u.a. Con viento o Ct cero, los rangos y ciclos son cero. **Este cálculo de ciclos sintéticos no calcula un DEL real ni daño acumulado.**

Referencias del método y de los coeficientes: [implementación rainflow de iamlikeme](https://github.com/iamlikeme/rainflow) y [AeroDyn Driver, OpenFAST](https://openfast.readthedocs.io/en/main/source/user/aerodyn/driver.html). La implementación JavaScript del proyecto es propia y se verifica con ejemplos analíticos pequeños; no sustituye herramientas de validación estructural.

## Código y compatibilidad

- `src/components/technicalAnalysis.js`: fórmulas aerodinámicas, señal sintética, reversals/Rainflow e indicadores de inspección.
- `src/components/TechnicalPanels.jsx`: paneles, escenarios, gráficas e histograma.
- `src/components/AerodynamicOverlay.jsx`: flechas y partículas ilustrativas; respeta movimiento reducido para las partículas añadidas.
- `src/components/blenderTurbineModel.js`: uniforme de inspección por zonas, materiales de instancia y restauración al salir. Conserva el mapa DEL y la geometría GLB.
- `src/components/BlenderWindTurbine.jsx`: activación de la selección de inspección y coordinación con las otras capas.
- `src/App.jsx`, `WindTurbineScene.jsx` y `modern.css`: navegación, panel, cámaras y adaptación móvil.
- `scripts/verify_technical_analysis.mjs`: comprobación numérica del conteo y los escenarios.
- `scripts/verify_technical_browser.mjs`: controles, selecciones, cambios de parámetros, calma, restauración y móvil mediante Chrome CDP local.

No se añaden dependencias. No se modifican `Dashboard.jsx`, `useWindData.js`, los servicios de ESIOS/REData, el modelo `.blend` ni el laboratorio del portal.

## Verificación y copias

- Compilación React correcta; persiste el aviso conocido sobre tamaño del paquete Three.js.
- Pruebas Rainflow: señal constante, ciclo triangular, mesetas, ciclos anidados y residuo abierto como medio ciclo.
- Pruebas físicas de independencia Cp/Ct y escalado cúbico/cuadrático; invariancia del conteo al escalar señal y conservación de ciclos en el histograma.
- Pruebas del modelo Blender siguen pasando: giro, parada, pitch calibrado, yaw con torre fija e independencia de instancias.
- Navegador sin errores de ejecución: tres componentes de inspección, tres deslizadores, potencia/empuje consistentes, calma a cero, salida a la vista general y móvil 390 px sin desbordamiento horizontal.
- Capturas revisadas de las dos vistas en escritorio y móvil, con informes en `respaldos/analisis_2026-10-20/`.
- Copias previas de los cinco archivos de integración en esa misma carpeta; no se ha alterado el GLB ni el Blender original (verificado por SHA-256).
- Código, modelos y documentación actuales en `respaldos/react_analisis_2026-10-20.zip` y su SHA-256, excluyendo dependencias, dist y archivos de entorno.

Para revertir estas dos vistas, restaurar los cinco archivos anteriores desde `respaldos/analisis_2026-10-20/`. Los tres componentes/helpers nuevos pueden quedar sin uso. Conservar la base offshore y la vista DEL, que ya estaban incluidas en esa copia previa.

No se ha publicado ni subido a GitHub. Las credenciales ESIOS se conservan en archivos ignorados.
