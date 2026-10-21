# Indice de documentacion de entrega

- [Tercera estructura: cimentación jacket incorporada a la web](jacket_web_2026-10-20.md).

- [Segunda plataforma: tensores y anillo, incorporación adicional, materiales y animación](plataforma_tensores_web_2026-10-20.md).

- [Tipos de plataformas offshore: modelo flotante de Blender en una sección adicional del portal, sin sustituciones](plataformas_offshore_web_2026-10-20.md).

## Autoria y destino academico

Este proyecto lo he planteado, organizado y desarrollado como autor. He definido la arquitectura general, la integracion de datos, la escena 3D, el dashboard, la documentacion y los criterios tecnicos de entrega. Este trabajo esta destinado al **Departamento de Robotica de la Universidad Complutense de Madrid**.

## Objetivo del indice

Este indice organiza la documentacion de **AeroGenerador** como una entrega tecnica de nivel alto, cercana a una memoria de trabajo final o proyecto academico avanzado. La idea es que cualquier tutor, profesor o tecnico del laboratorio pueda entender:

- Que he desarrollado.
- Como funciona.
- Que datos son reales.
- Que datos son estimados.
- Como se mantiene el codigo.
- Como se podria escalar en el futuro.

## Orden recomendado de lectura

### 1. Resumen para tutor

Archivo:

```text
resumen_para_tutor.md
```

Finalidad:

Explica el proyecto de forma directa para una primera revision academica. Resume la aplicacion, la API key de ESIOS, el refresco cada cinco minutos y las estimaciones matematicas.

### 2. README principal

Archivo:

```text
README.md
```

Finalidad:

Documento general del proyecto. Explica que incluye la aplicacion, como abrirla en localhost, como funciona ESIOS, que contiene el panel SCADA y cual es el estado de avance.

### 3. Motivacion y justificacion del proyecto

Archivo:

```text
motivacion_y_justificacion_del_proyecto.md
```

Finalidad:

Documento principal de justificacion academica. Explica por que he desarrollado la aplicacion, que problema aborda, que relacion tiene con robotica e ingenieria, cual es su valor academico, que limites tiene y como podria evolucionar hacia un gemelo digital o sistema de monitorizacion mas avanzado.

Tambien incluye la aportacion del trabajo a la Universidad Complutense de Madrid como prototipo docente, experimental y escalable para el Departamento de Robotica.

### 4. Explicacion de ESIOS y modelos matematicos

Archivo:

```text
explicacion_dashboard_esios_modelos_matematicos.md
```

Finalidad:

Documento clave para defender tecnicamente el dashboard. Explica que ESIOS aporta generacion eolica agregada y como, a partir de ese dato, calculo rpm, viento equivalente, yaw, pitch, temperaturas, aceite, gearbox, vibracion, disponibilidad y estado de componentes.

### 5. Figura anotada del dashboard

Archivo:

```text
figura_dashboard_anotado.md
```

Finalidad:

Documento visual para el paper o memoria. Incluye la captura anotada del dashboard con flechas y explica para que sirve cada zona de la interfaz.

### 6. Manual tecnico del codigo y mantenimiento

Archivo:

```text
manual_tecnico_codigo_mantenimiento.md
```

Finalidad:

Documento pensado para mantenimiento y escalabilidad. Explica la arquitectura, el flujo de datos, el papel de cada archivo, como anadir nuevas metricas, como cambiar la fuente de datos, como conectar sensores reales y como verificar cambios.

### 7. Tecnologias usadas

Archivo:

```text
tecnologias usadas.md
```

Finalidad:

Explica las tecnologias principales: Vite, React, Three.js, React Three Fiber, Drei, ESIOS, REData, CSS, dashboard y modelo Blender.

### 8. Resumen breve de tecnologias

Archivo:

```text
tecnologias_resumen.md
```

Finalidad:

Resumen mas directo de lenguajes, librerias, APIs, scripts, componentes y estado del proyecto.

### 9. Guion de video o defensa breve

Archivo:

```text
guion_video_redes_sociales.md
```

Finalidad:

Sirve para explicar el proyecto en una presentacion oral, video academico o demostracion publica.

### 10. Nota tecnica sobre animacion Three.js

Archivo:

```text
nota_animacion_threejs.md
```

Finalidad:

Documento tecnico que explica como esta implementada la animacion visual con Three.js y como simplificarla si hace falta.

Estado actualizado: la version actual ya incluye la correccion visual del rotor, con las palas integradas en el buje y sin saliente frontal del eje. Esta mejora es solo visual y no cambia los datos ni los modelos matematicos.

### 11. AGENTS

Archivo:

```text
AGENTS.md
```

Finalidad:

Registro interno de objetivos, decisiones y estado del proyecto. Sirve como memoria de contexto para futuras sesiones de desarrollo.

### 12. Despliegue en Vercel

Archivo:

```text
despliegue_vercel.md
```

Finalidad:

Documenta como se publico la aplicacion en Vercel, que URL publica se usa, que proyecto de Vercel se creo, que variables de entorno hacen falta y como se comprobaron la web y los proxies.

### 13. Rollback de Vercel

Archivo:

```text
rollback_vercel.md
```

Finalidad:

Explica como volver atras si el despliegue publico falla, tanto desde Git como desde el panel de Vercel.

### 14. Progreso final de despliegue y responsive

Archivo:

```text
progreso_despliegue_responsive_2026-07-03.md
```

Finalidad:

Registra el progreso final de publicacion, responsive movil/escritorio, proxies serverless, verificaciones realizadas y estado final de la URL publica.

### 15. Revision de documentacion

Archivo:

```text
revision_documentacion_2026-07-04.md
```

Finalidad:

Registra la revision general de la carpeta `documentacion/`, las correcciones realizadas y los documentos clave que se recomiendan para entregar.

## Documentos principales para entregar

Para una entrega academica formal, considero principales estos documentos:

```text
README.md
resumen_para_tutor.md
motivacion_y_justificacion_del_proyecto.md
explicacion_dashboard_esios_modelos_matematicos.md
figura_dashboard_anotado.md
manual_tecnico_codigo_mantenimiento.md
despliegue_vercel.md
rollback_vercel.md
progreso_despliegue_responsive_2026-07-03.md
revision_documentacion_2026-07-04.md
```

Los demas documentos funcionan como anexos tecnicos o material de apoyo.

## Idea central que debe quedar clara

```text
AeroGenerador no afirma leer sensores reales de una turbina individual.
La API key de ESIOS permite consultar generacion eolica real agregada.
Desde esa generacion real calculo variables equivalentes mediante modelos matematicos.
El dashboard y la escena 3D son una visualizacion tecnica calibrada para laboratorio.
```

Esta separacion entre dato real y dato derivado es esencial para que el proyecto sea serio y defendible en el Departamento de Robotica de la Universidad Complutense de Madrid.

---

**Autor:** Robert Jesus Melendez Nunez


## Último avance guardado

[14 de octubre de 2026: aplicación renovada y laboratorio animado del portal](progreso_2026-10-14.md).

## Investigación preparada para el 15 de octubre de 2026

- [Tendencias offshore: desgaste, fatiga, corrosión y mantenimiento](tendencias_offshore_desgaste_2026-10-15.md).
- [Agenda para retomar mañana](para_manana_2026-10-15.md).

## Actualización vigente · 18 de octubre de 2026

Estado actual y verificaciones en [Portada técnica del portal · 18 de octubre](portada_tecnica_2026-10-18.md).

La imagen frontal de la portada Angular recibe un tratamiento de dibujo técnico mediante CSS y SVG; se conserva el render original. El ajuste se limita a esa imagen. El laboratorio animado, la interfaz restante y la aplicación 3D mantienen su implementación. No implica cambios de modelos matemáticos, ESIOS ni telemetría.

Para usar todo el proyecto deben arrancarse dos servidores: portal Angular en 4200 (`npm.cmd start -- --host 127.0.0.1 --port 4200` desde su carpeta) y React 3D en 5177 (`npm.cmd run dev` desde AeroGenerador). Se verificó la compilación del portal y se guardaron copias locales. No hay nueva publicación ni subida a GitHub.

## Estado vigente · 20 de octubre de 2026

Leer primero [progreso_2026-10-20.md](progreso_2026-10-20.md) y [la integración Blender/web](integracion_modelo_blender_web.md) para el estado más reciente.

El portal Angular (4200) incorpora «Modelo 3D» con el aerogenerador original de Blender. La aplicación React (5177) también usa ese modelo como turbina principal, manteniendo datos, dashboard, paneles SCADA, cámara, entorno marino y análisis mecánico. El giro sigue las rpm equivalentes; pitch y yaw se adaptan a los indicadores existentes. El Blender original, la portada técnica y el laboratorio aprobado se conservan. No hay simulación nueva de desgaste acumulado ni nueva publicación. Copias y verificaciones documentadas en las notas del día 20.

## Vista DEL · ampliación del 20 de octubre de 2026

Nueva vista ampliada [DEL y zonas de fatiga](vista_del_2026-10-20.md) en http://localhost:5177/?vista=del, accesible también desde «DEL · Fatiga». Colorea el modelo Blender en rojo en raíces de pala, uniones superiores y base de torre; incluye tres acercamientos y restaura los materiales al salir. Es un mapa ilustrativo: **no se calcula DEL numérico ni daño medido** porque no hay historial de cargas individual. Mantener esta distinción en interfaz y documentación. No cambia el visor del portal, el laboratorio ni los servicios de datos. Copias y verificaciones en la nota específica.


## Base offshore · actualización del 20 de octubre de 2026

La aplicación React sustituye la base anterior por un monopilote con transición amarilla, plataforma de rejilla, barandillas, escalera y defensas de desembarco, tomando referencias offshore reales. Detalle normal: http://localhost:5177/?vista=base. Se conserva el modelo Blender, sus funciones y la vista DEL ilustrativa; el original `.blend` y el portal permanecen intactos. [Proporciones, fuentes, verificaciones y reversión](base_offshore_2026-10-20.md). Copia del código en `respaldos/react_base_offshore_2026-10-20.zip`; sin nueva publicación.


## Predictivo y Rainflow / Cp / Ct · 20 de octubre de 2026

Se añaden dos vistas a la aplicación React: [Predictivo](http://localhost:5177/?vista=predictivo) y [Rainflow · Cp/Ct](http://localhost:5177/?vista=rainflow). La primera presenta seguimiento por componentes con estimaciones SCADA y selección ámbar, sin RUL ni fallos predichos. La segunda calcula potencia y empuje de un escenario editable y cuenta ciclos Rainflow de una señal sintética identificada. Se conservan el modelo Blender, la base offshore, DEL, el dashboard y el portal. [Supuestos, verificación y reversión](predictivo_rainflow_2026-10-20.md). Copia en `respaldos/react_analisis_2026-10-20.zip`; sin nueva publicación.
