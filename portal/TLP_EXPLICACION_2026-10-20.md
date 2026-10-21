# Identificación y explicación TLP en la web · 20 de octubre de 2026

El usuario identifica la segunda plataforma como TLP y pide investigar en Internet e informar en la web. Se actualizan el nombre del segundo modelo, el enlace de selección, el título del iframe y el visor independiente: **Plataforma TLP · Tensores y anillo inferior**. Se mantiene `#plataforma-tensores` para conservar enlaces existentes.

TLP significa *Tension Leg Platform*. La explicación describe tendones casi verticales pretensados, anclajes en el fondo y limitación del movimiento vertical y de las inclinaciones. Se distingue la tipología de los detalles de esta reconstrucción: el anillo inferior pertenece al modelo de las fotos y no se presenta como requisito de toda TLP.

Fuentes primarias consultadas el 20/10/2026 y enlazadas en el portal:

- [DOE, 1/10/2012: Glosten Associates Tests Innovative High-Strength Mooring Lines for Deepwater Offshore Wind Installations](https://www.energy.gov/cmei/systems/articles/glosten-associates-tests-innovative-high-strength-mooring-lines-deepwater). Describe los tendones verticales de alta tensión y su función frente al movimiento vertical.
- [DOE / Sandia, 17/10/2017: Offshore Floating Vertical-Axis Wind Turbine Project Identifies Promising Platform Design](https://www.energy.gov/cmei/systems/articles/offshore-floating-vertical-axis-wind-turbine-project-identifies-promising). Explica los mecanismos de estabilización y el reducido balanceo/cabeceo del concepto estudiado. No se extrapolan sus resultados económicos o de turbina vertical al modelo del proyecto.

Se usan paráfrasis breves, sin copiar artículos ni asignar fabricante o diseño comercial al modelo. No se añaden afirmaciones sobre despliegue comercial actual, costes o calado específico.

Cambios limitados a contenido y estilos del segundo bloque Angular y a `public/assets/plataforma-tensores/index.html`; fuentes de ese visor en `exportaciones/plataforma_tensores_web/`. Geometría GLB, materiales, animación y script del visor permanecen iguales, al igual que la primera plataforma y el laboratorio.

Script de instalación y copia: `scripts/actualizar_tlp_portal.py`. Copias previas y manifiesto de conservación en `respaldos/tlp_informacion_2026-10-20/`; copia posterior `respaldos/portal_tlp_informacion_2026-10-20.zip` y SHA-256. Incluye fuentes Angular y segundo visor; para restaurar todo el portal se necesitan también los visores previos y medios históricos.

Acceso: http://localhost:4200/#plataforma-tensores. Mantener el giro del rotor y los controles existentes. Sin publicación ni subida a GitHub.
