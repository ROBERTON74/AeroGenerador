# Entorno Blender en los tres visores offshore · 20 de octubre de 2026

**Actualización posterior:** revisión visual y correcciones completadas en `revision_estetica_offshore_2026-10-20.md`. Esta nota conserva el estado de la primera integración; la revisión posterior resuelve la limitación inicial de navegador y describe la cobertura y el acabado vigentes.

El usuario pide adaptar a cada tipo de plataforma el entorno que acabamos de preparar en Blender. Se aplica a los tres visores del portal Angular: semisumergible, TLP y jacket. Se comunicó esta interpretación mientras se trabajaba; no se recibió una preferencia distinta. No hay publicación ni GitHub.

## Resultado local

- Semisumergible: `http://localhost:4200/assets/plataformas-offshore/index.html`.
- TLP: `http://localhost:4200/assets/plataforma-tensores/index.html`.
- Jacket: `http://localhost:4200/assets/jacket/index.html`.

Los tres comparten `public/assets/entorno-offshore/`. Sustituye el antiguo mar de ondas sintéticas por la geometría y el clip original del océano revisado en Blender, al **75 % de la velocidad original (0,75×)**. Se conserva la duración del clip original de 249 intervalos a 24 fps, con todas sus muestras y pesos de interpolación, repetido en nueve módulos a escala original para cubrir unos 450 m. La reproducción no introduce nuevas ondas.

Para evitar cientos de morph targets residentes en GPU por visor, el módulo compartido reproduce sus deltas en CPU. Se almacenan en float16 y gzip, deduplicando tres conjuntos de movimiento; error máximo medido de 0,00048828125 m en los deltas. Las normales se recalculan a partir de la geometría animada. Las texturas del agua se reducen a 1024 píxeles; no es una reproducción idéntica del sombreado de Blender.

La fauna procede de `Oceano_dos_ballenas_dos_cachalotes_REVISION`: dos jorobadas, dos cachalotes y tres tiburones. Se exporta en una única animación de escena de 480 fotogramas, con esqueletos y trayectorias. No se exportan las plataformas ni los animales de escenas históricas. Texturas limitadas a 1024 píxeles; geometría, escala y trayectorias de los animales conservadas.

La arena utiliza 96 instancias de un módulo de 16×6 m, con detalle geométrico reducido al 25 % para la web y continuidad visual de 600 m. Se adapta solo la cota del fondo a los extremos inferiores de cada estructura: −74,1 m en semisumergible, −108,35 m en TLP y −49,975 m en jacket. No se estiran las ondulaciones. Los niveles de agua orientativos siguen en 0, 3 y 45 m, respectivamente. Fauna y mar se trasladan juntos a cada nivel, manteniendo profundidad relativa y escala.

Nuevas vistas «Entorno marino» y «Bajo el agua». «Pausar animación» detiene rotor, mar y fauna; el selector de velocidad sigue controlando solo las palas, de forma que el agua mantiene 0,75×. Se respetan pausa por visibilidad y preferencia inicial de movimiento reducido. Se añade enlace a créditos y licencias, incluidos CC BY-NC y CC BY-NC-SA de los recursos correspondientes.

## Conservación y verificación

Los GLB existentes de las tres plataformas permanecen idénticos. No cambian la plantilla Angular, laboratorio, portada, visor original ni React. 59 archivos protegidos conservan su SHA-256. Los originales Blender y sus revisiones guardadas no se sobrescriben.

- Compilación Angular correcta; persiste el aviso anterior de 52 bytes del presupuesto CSS.
- HTTP 200 para el portal, los tres visores y los recursos compartidos comprobados.
- Prueba de geometría y rigs con Three.js: siete raíces de animales, 19 mallas con esqueleto, nueve módulos de agua, 96 instancias de arena, movimiento del agua y pausa correctos.
- Se ejecuta el código instalado de los tres visores en Node, con GLTF reales y sustitutos de DOM/renderizador: carga de los tres modelos y entorno, mar a 0,75×, pausa, cámaras submarinas y coordenadas finitas correctas.
- **Límite:** estas pruebas no validan el render en GPU ni el aspecto final en navegador. Los servicios de navegador y control nativo no estaban disponibles en esta sesión. Queda pendiente esa revisión visual y de rendimiento real.

Informes, SHA-256 y copias previas en `respaldos/entorno_blender_tres_visores_2026-10-20/`. Las pruebas no se presentan como una simulación hidrodinámica o ecológica ni una validación exhaustiva de colisiones.

Fuentes compartidas en `exportaciones/entorno_offshore_web/`; fuentes individuales en las tres carpetas de exportación anteriores. Conservar `assets/modelo3d/vendor/`, que suministra Three.js a los visores. Para revertir, restaurar los cuatro archivos por visor desde `portal_previo/`; los nuevos recursos compartidos dejarán de ser referenciados.

Scripts: `preparar_mar_blender_web.py`, `exportar_entorno_fauna_web.py`, `adaptar_visores_entorno_blender.py`, `verificar_entorno_blender.mjs` y `verificar_tres_visores_sin_gpu.mjs`. El instalador recibe `--instalar` para sincronizar únicamente los recursos del entorno y los cuatro archivos de cada visor. Las revisiones futuras no deben volver a ejecutar `agregar_mar_suave.py --instalar`, pues restauraría el mar sintético anterior.
