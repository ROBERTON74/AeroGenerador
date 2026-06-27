# Indice de documentacion de entrega

## Autoria, destino academico y apoyo de IA

Este proyecto lo he planteado, organizado y dirigido yo. Yo he definido la arquitectura general, la estructura de la aplicacion, la integracion de datos, el enfoque visual, la documentacion y las decisiones principales de desarrollo. He utilizado herramientas de IA como apoyo tecnico para acelerar tareas de redaccion, revision, depuracion y generacion de alternativas, pero la orquestacion del proyecto, la seleccion de tecnologias, la integracion final y los criterios de entrega son mios.

Este trabajo esta destinado al **Departamento de Robotica de la Universidad Complutense de Madrid**, dentro de un contexto academico y de laboratorio de ingenieria.

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
resumeen para tutor.md
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

### 3. Explicacion de ESIOS y modelos matematicos

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

### 5. Manual tecnico del codigo y mantenimiento

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
tecnolgias usasdas.md
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

### 10. Punto de retorno antes de Rapier

Archivo:

```text
punto_retorno_pre_rapier.md
```

Finalidad:

Documento de control tecnico para revertir la parte de fisica visual si en el futuro se quiere volver a una animacion mas simple.

### 11. AGENTS

Archivo:

```text
AGENTS.md
```

Finalidad:

Registro interno de objetivos, decisiones y estado del proyecto. Sirve como memoria de contexto para futuras sesiones de desarrollo.

## Documentos principales para entregar

Para una entrega academica formal, considero principales estos cuatro:

```text
README.md
resumeen para tutor.md
motivacion_y_justificacion_del_proyecto.md
explicacion_dashboard_esios_modelos_matematicos.md
figura_dashboard_anotado.md
manual_tecnico_codigo_mantenimiento.md
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

**Autor:** Robert Jesus Melendez Nuñez

