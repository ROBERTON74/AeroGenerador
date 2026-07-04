# Revision de documentacion

Fecha: 2026-07-04

## Objetivo

Revisar la carpeta `documentacion/` para que la entrega de **AeroGenerador** quede ordenada, actualizada y coherente con el estado actual del proyecto.

## Documentos revisados

Se revisaron los documentos principales y anexos de la carpeta:

- `README.md`
- `resumen_para_tutor.md`
- `motivacion_y_justificacion_del_proyecto.md`
- `explicacion_dashboard_esios_modelos_matematicos.md`
- `figura_dashboard_anotado.md`
- `manual_tecnico_codigo_mantenimiento.md`
- `tecnologias usadas.md`
- `tecnologias_resumen.md`
- `guion_video_redes_sociales.md`
- `nota_animacion_threejs.md`
- `despliegue_vercel.md`
- `rollback_vercel.md`
- `progreso_despliegue_responsive_2026-07-03.md`
- `pendiente_para_manana.md`
- `indice_documentacion_entrega.md`
- `AGENTS.md`

## Correcciones realizadas

- Se actualizaron referencias antiguas a una escena terrestre para reflejar la version offshore actual.
- Se aclaro que la escena principal actual muestra el aerogenerador en el mar, con mar animado, espuma, barco y turbinas de fondo.
- Se actualizo el documento de pendientes, que todavia hablaba de crear el repositorio GitHub aunque el proyecto ya estaba subido.
- Se dejo constancia de la URL publica de Vercel.
- Se mantuvo la separacion entre datos reales de ESIOS/REData y variables mecanicas estimadas.
- Se reforzo la idea de que el token real de ESIOS no debe escribirse en la documentacion ni subirse al repositorio.

## Estado tras la revision

La documentacion queda organizada para tres usos:

- **Entrega academica**: resumen, motivacion, modelos matematicos, figura anotada y manual tecnico.
- **Mantenimiento tecnico**: tecnologias, arquitectura, rollback, despliegue y progreso responsive.
- **Demostracion publica**: URL de Vercel, guion de presentacion y comprobaciones en movil/escritorio.

## Documentos clave para entregar

Para una entrega formal, los documentos mas importantes son:

- `README.md`
- `resumen_para_tutor.md`
- `motivacion_y_justificacion_del_proyecto.md`
- `explicacion_dashboard_esios_modelos_matematicos.md`
- `figura_dashboard_anotado.md`
- `manual_tecnico_codigo_mantenimiento.md`
- `despliegue_vercel.md`
- `rollback_vercel.md`
- `progreso_despliegue_responsive_2026-07-03.md`

## Comprobaciones recomendadas

Antes de enviar el proyecto:

```bash
npm run build
git status
```

Despues abrir:

```text
https://aerogenerador-robert.vercel.app
```

Comprobar en ordenador y movil:

- Aerogenerador en el mar.
- Mar animado visible.
- Dashboard funcional.
- Paneles `Modelo` y `Mecanica` funcionales.
- Dashboard movil minimizado mostrando la escena del mar.

**Autor:** Robert Jesus Melendez Nunez
