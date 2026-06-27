# Tecnolgias usasdas

## Autoria y apoyo de IA

Este proyecto lo he planteado, organizado y dirigido yo. Yo he definido la arquitectura general, la estructura de la aplicacion, la integracion de datos, el enfoque visual, la documentacion y las decisiones principales de desarrollo. He utilizado herramientas de IA como apoyo tecnico para acelerar tareas de redaccion, revision, depuracion y generacion de alternativas, pero la orquestacion del proyecto, la seleccion de tecnologias, la integracion final y los criterios de entrega son mios. Este trabajo esta destinado al **Departamento de Robotica de la Universidad Complutense de Madrid**.

Resumen de las tecnologias, lenguajes, librerias, APIs y herramientas que he usado en el proyecto del aerogenerador 3D.

## Lenguajes

- JavaScript: lo uso para la logica principal de React, servicios de datos, hooks y componentes.
- JSX: lo uso para construir componentes visuales de React.
- CSS: lo uso para los estilos propios de la interfaz, dashboard, paneles SCADA, animaciones y responsive.
- HTML: lo uso como entrada base de Vite mediante `index.html`.
- Markdown: lo uso para documentar el proyecto.

## Frameworks y herramientas frontend

- Vite: servidor de desarrollo, build de produccion y proxies hacia APIs externas.
- React: estructura de componentes que he definido para la aplicacion.
- Three.js: motor 3D para geometria, luces, materiales, camara, animacion y escena.
- @react-three/fiber: integracion de Three.js con React.
- @react-three/drei: utilidades 3D como `OrbitControls`, `Sky`, `Environment`, `Clouds`, `Sparkles` y `Text`.
- @react-three/rapier: integracion de Rapier Physics para mejorar la fisica visual del aerogenerador principal.
- Tailwind CSS: configuracion base de estilos, combinada con CSS propio.
- Lucide React: iconos de interfaz para viento, ubicacion, conexion, refresco y controles del dashboard.

## APIs y fuentes de datos

- ESIOS API: fuente preferente para generacion eolica si se configura `VITE_ESIOS_API_KEY`.
- REData / Red Electrica de Espana: respaldo publico sin token para datos agregados de generacion electrica.
- Open-Meteo API: recurso meteorologico opcional sin token; no alimenta el dashboard principal en el estado actual.

## Proxies locales configurados

Configurados en `vite.config.js`:

- `/ree-api` hacia `https://apidatos.ree.es`.
- `/esios-api` hacia `https://api.esios.ree.es`.
- `/open-meteo-api` hacia `https://api.open-meteo.com`.

## Scripts npm

- `npm run dev`: inicia el servidor local en `http://localhost:5177/`.
- `npm run build`: compila la aplicacion para produccion.
- `npm run preview`: previsualiza la build generada.

## Componentes principales

- `src/components/WindTurbineScene.jsx`: escena 3D completa.
- `src/components/WindTurbine.jsx`: aerogenerador, rotor, palas, gondola, torre, vista interna y analisis mecanico.
- `src/components/Dashboard.jsx`: dashboard inferior, tarjetas SCADA, paneles desplegables y minimizado.
- `src/components/LoadingScreen.jsx`: pantalla de carga.

## Servicios y hooks

- `src/services/windDataService.js`: obtiene datos, normaliza respuestas y calcula metricas derivadas.
- `src/hooks/useWindData.js`: gestiona polling, refresco manual, errores, simulacion local e historico de carga.

## Funcionalidades implementadas

- Aerogenerador 3D animado.
- Escena con terreno, cielo, nubes, arboles, turbinas de fondo y particulas de viento.
- Sombras reforzadas, incluyendo sombra visible de las palas sobre el suelo.
- Fisica visual con Rapier para aportar masa, torque, inercia y amortiguacion a la oscilacion principal.
- Dashboard con datos de generacion eolica ESIOS, equivalentes derivados, rpm, punta de pala y fuente del dato.
- Calibracion energetica mediante factor de carga: generacion eolica ESIOS dividida entre `31.679 MW` de potencia eolica instalada de referencia.
- Modo de analisis mecanico con zonas de esfuerzo, flechas, torsion, flexion y vista interna.
- Panel SCADA con tarjetas interactivas.
- Ventanas desplegables uniformes para:
  - Potencia nominal / modo operativo.
  - Curva de potencia.
  - Rosa de viento / yaw.
  - Pitch y condicion.
  - Temperaturas de gearbox, aceite y generador.
- Boton para minimizar el dashboard y dejar visible el aerogenerador completo.
- Documentacion de reversion para poder quitar modulos concretos si el resultado no convence.
- Documento `punto_retorno_pre_rapier.md` para volver a la animacion previa a Rapier.

## Modelo Blender documentado

Tambien conservo un modelo Blender de referencia:

- Archivo principal: `aerogenerador_modelado_escala_real_base_rectangular_nubes_azules.blend`.
- Uso: version principal del aerogenerador a escala real aproximada fuera de la app web.
- Escala: 1 unidad Blender = 1 metro.
- Referencia: Siemens Gamesa SG 5.0-145.
- Medidas registradas: buje 102,5 m, rotor aproximado 144,76 m, gondola 13,1 m x 5,12 m x 4,6 m, torre visible 98,5 m y puerta 1,05 m x 2,20 m.
- Paisaje: base rectangular de cesped de 170 m x 125 m, nubes cercanas azules y terreno sin camino marron.
- Estado visual: torre monolitica metalica satinada, sin bandas rojas en las puntas de pala y sin maqueta tecnica lateral.

Si Blender abre una escena vacia o una version anterior, cargo explicitamente este `.blend` desde la raiz del proyecto.

## Datos importantes

- Los datos electricos publicos son agregados, no pertenecen a un aerogenerador individual.
- El indicador ESIOS `551` devuelve el ambito `PenÃ­nsula`; no devuelve ubicacion de parques ni molinos concretos.
- Las metricas SCADA son estimaciones didacticas a partir de datos agregados de ESIOS/REData.
- La API key de ESIOS permite consultar generacion eolica real agregada, no telemetria real de rpm, pitch, yaw, temperatura o vibracion de una maquina concreta.
- He programado la app para consultar ESIOS al abrirse y despues cada cinco minutos mediante `POLL_INTERVAL = 5 * 60 * 1000`.
- He calibrado la turbina tipo de las estimaciones a `5 MW`; las rpm, temperaturas y vibracion quedan acotadas para evitar valores poco realistas.
- Cuando ESIOS es la fuente activa se muestra factor de carga; cuando REData aporta total del sistema puede mostrarse porcentaje del mix.
- Open-Meteo no requiere token, pero queda como recurso opcional y no como dato maestro.
- ESIOS requiere token personal para consultar datos con mayor frecuencia; el token se guarda en `.env` como `VITE_ESIOS_API_KEY`.

## Estado registrado

Fecha de registro: 31 de mayo de 2026.

- Dejo documentadas juntas las dos partes del proyecto AeroGenerador:
  - Aplicacion web con Three.js, React, ESIOS/REData, dashboard SCADA y Rapier.
  - Modelo Blender principal `aerogenerador_modelado_escala_real_base_rectangular_nubes_azules.blend`.
- La app web sigue teniendo como localhost habitual `http://localhost:5177/`.
- El `.blend` anterior queda como referencia de modelado y escala.

Fecha de registro: 17 de junio de 2026.

- Pulo las metricas de datos para la entrega final.
- Normalizo la generacion real de ESIOS contra `31.679 MW` de potencia eolica instalada de referencia.
- La interfaz que he desarrollado distingue entre `Factor carga` y `Mix` segun la fuente de datos disponible.
- Actualizo `resumeen para tutor.md` con la explicacion de API key, refresco cada cinco minutos e ingenieria inversa didactica.

Fecha de registro: 28 de mayo de 2026.

- Servidor local usado: `http://localhost:5177/`.
- Token de ESIOS probado correctamente contra el proxy local `/esios-api`.
- Ultima verificacion tecnica: `npm run build`.
- Resultado: build correcta, con aviso esperado de bundle grande por el uso de Three.js.

## Pendiente

- Mantener el token personal de ESIOS en `.env` y no subirlo a repositorios.
- Revisar si hacen falta fuentes alternativas solo para variables que ESIOS no entregue.
- Validar visualmente si las animaciones SCADA se mantienen o se simplifica alguna.

---

**Autor:** Robert Jesus Melendez Nuñez

