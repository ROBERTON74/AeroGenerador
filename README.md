# AeroGenerador

La versión conjunta para publicar incluye React en `/` y el portal Angular en `/portal/`, con modelos 3D, entorno marino, vídeos, papers y licencias. El portal se conserva como proyecto reproducible en `portal/`.

Para compilar ambos: `npm ci`, `npm ci --prefix portal` y `npm run build:all`. El resultado está en `dist/`. Vercel usa esta compilación conjunta y las funciones de `api/`; las credenciales ESIOS se configuran como `ESIOS_API_KEY` en el servidor, nunca en GitHub. [Preparación y publicación](documentacion/publicacion_2026-10-21.md).

Tercer modelo offshore: [Cimentación jacket](http://localhost:4200/#cimentacion-jacket), con palas animadas y vistas de la celosía, pilotes y rotor. Se conservan semisumergible y TLP. [Documentación y verificaciones](documentacion/jacket_web_2026-10-20.md).

Segunda plataforma aprobada e incorporada: [Tensores y anillo inferior](http://localhost:4200/#plataforma-tensores), con materiales PBR mejorados, rotor animado y cuatro vistas. Se conserva la primera plataforma y todo el contenido anterior. [Detalle y comprobaciones](documentacion/plataforma_tensores_web_2026-10-20.md).

Nuevo apartado del portal (20/10/2026): [Tipos de plataformas offshore](http://localhost:4200/#plataformas-offshore), con plataforma flotante de Blender, palas animadas y controles propios. Se conserva la aplicación y todos los apartados anteriores. [Documentación y verificaciones](documentacion/plataformas_offshore_web_2026-10-20.md).

Aplicacion web interactiva desarrollada para representar un aerogenerador 3D en funcionamiento con Three.js, React y datos reales agregados de generacion eolica procedentes de ESIOS / Red Electrica.

El proyecto esta destinado al Departamento de Robotica de la Universidad Complutense de Madrid. La aplicacion combina una escena 3D tecnica con un dashboard inferior tipo SCADA que muestra generacion eolica real, factor de carga, rpm estimadas, viento equivalente, yaw, pitch, temperaturas, vibracion, disponibilidad y estado operativo.

La version actual tambien deja refinada la union visual entre palas y buje: las palas quedan integradas en el rotor sin pieza frontal sobresaliente en el eje, para que la animacion se vea mas limpia.

## Como abrirlo en localhost

1. Instalar dependencias:

```bash
npm install
```

2. Crear un archivo `.env` a partir de `.env.example`:

```bash
VITE_ESIOS_API_KEY=tu_token_personal_de_esios
```

3. Ejecutar la aplicacion:

```bash
npm run dev
```

4. Abrir en el navegador:

```text
http://localhost:5177/
```

## API key de ESIOS

La API key se guarda solo en `.env` y no debe subirse a GitHub. El archivo `.env.example` incluye un valor de ejemplo para que otra persona pueda configurar su propio token.

La aplicacion usa el indicador ESIOS `551`, correspondiente a generacion eolica en tiempo real. ESIOS aporta generacion eolica agregada del sistema electrico, normalmente con ambito `Peninsula`. No aporta telemetria real de un aerogenerador individual.

Las variables mecanicas del dashboard, como rpm, yaw, pitch, temperaturas, vibracion y carga mecanica, se calculan como equivalentes didacticos mediante modelos matematicos a partir de la generacion eolica real.

## Documentacion

La documentacion de entrega esta en:

```text
documentacion/
```

Archivo recomendado para empezar:

```text
documentacion/indice_documentacion_entrega.md
```

Tambien se incluye una figura anotada del dashboard en:

```text
documentacion/assets/dashboard_anotado_flechas.png
```

## Experiencia visual

La interfaz incluye una cabecera de observatorio eolico, generacion agregada destacada y un centro de control con tarjetas SCADA. Los controles de la escena permiten volver a la vista general, acercarse al rotor y activar o detener un recorrido automatico. La camara cambia de vista con una transicion suave y respeta la preferencia de movimiento reducido del sistema.

El dashboard se puede minimizar y los paneles de detalle se cierran con Escape. En movil, los datos se organizan en tarjetas con desplazamiento interno. La generacion procede de las fuentes energeticas; las variables mecanicas siguen siendo estimaciones didacticas del modelo.

## Scripts principales

```bash
npm run dev
npm run build
npm run preview
```

## Autor

Robert Jesus Melendez Nunez



## Avances guardados

Estado de la aplicación y del portal Angular: [14 de octubre de 2026](documentacion/progreso_2026-10-14.md). Incluye las rutas correctas, las decisiones del usuario y la copia de respaldo del portal.

## Actualización vigente · 18 de octubre de 2026

Estado actual y verificaciones en [Portada técnica del portal · 18 de octubre](documentacion/portada_tecnica_2026-10-18.md).

La imagen frontal de la portada Angular recibe un tratamiento de dibujo técnico mediante CSS y SVG; se conserva el render original. El ajuste se limita a esa imagen. El laboratorio animado, la interfaz restante y la aplicación 3D mantienen su implementación. No implica cambios de modelos matemáticos, ESIOS ni telemetría.

Para usar todo el proyecto deben arrancarse dos servidores: portal Angular en 4200 (`npm.cmd start -- --host 127.0.0.1 --port 4200` desde su carpeta) y React 3D en 5177 (`npm.cmd run dev` desde AeroGenerador). Se verificó la compilación del portal y se guardaron copias locales. No hay nueva publicación ni subida a GitHub.

## Estado vigente · 20 de octubre de 2026

Leer primero [progreso_2026-10-20.md](documentacion/progreso_2026-10-20.md) y [la integración Blender/web](documentacion/integracion_modelo_blender_web.md) para el estado más reciente.

El portal Angular (4200) incorpora «Modelo 3D» con el aerogenerador original de Blender. La aplicación React (5177) también usa ese modelo como turbina principal, manteniendo datos, dashboard, paneles SCADA, cámara, entorno marino y análisis mecánico. El giro sigue las rpm equivalentes; pitch y yaw se adaptan a los indicadores existentes. El Blender original, la portada técnica y el laboratorio aprobado se conservan. No hay simulación nueva de desgaste acumulado ni nueva publicación. Copias y verificaciones documentadas en las notas del día 20.

## Vista DEL · ampliación del 20 de octubre de 2026

Nueva vista ampliada [DEL y zonas de fatiga](documentacion/vista_del_2026-10-20.md) en http://localhost:5177/?vista=del, accesible también desde «DEL · Fatiga». Colorea el modelo Blender en rojo en raíces de pala, uniones superiores y base de torre; incluye tres acercamientos y restaura los materiales al salir. Es un mapa ilustrativo: **no se calcula DEL numérico ni daño medido** porque no hay historial de cargas individual. Mantener esta distinción en interfaz y documentación. No cambia el visor del portal, el laboratorio ni los servicios de datos. Copias y verificaciones en la nota específica.


## Base offshore · actualización del 20 de octubre de 2026

La aplicación React sustituye la base anterior por un monopilote con transición amarilla, plataforma de rejilla, barandillas, escalera y defensas de desembarco, tomando referencias offshore reales. Detalle normal: http://localhost:5177/?vista=base. Se conserva el modelo Blender, sus funciones y la vista DEL ilustrativa; el original `.blend` y el portal permanecen intactos. [Proporciones, fuentes, verificaciones y reversión](documentacion/base_offshore_2026-10-20.md). Copia del código en `respaldos/react_base_offshore_2026-10-20.zip`; sin nueva publicación.


## Predictivo y Rainflow / Cp / Ct · 20 de octubre de 2026

Se añaden dos vistas a la aplicación React: [Predictivo](http://localhost:5177/?vista=predictivo) y [Rainflow · Cp/Ct](http://localhost:5177/?vista=rainflow). La primera presenta seguimiento por componentes con estimaciones SCADA y selección ámbar, sin RUL ni fallos predichos. La segunda calcula potencia y empuje de un escenario editable y cuenta ciclos Rainflow de una señal sintética identificada. Se conservan el modelo Blender, la base offshore, DEL, el dashboard y el portal. [Supuestos, verificación y reversión](documentacion/predictivo_rainflow_2026-10-20.md). Copia en `respaldos/react_analisis_2026-10-20.zip`; sin nueva publicación.
