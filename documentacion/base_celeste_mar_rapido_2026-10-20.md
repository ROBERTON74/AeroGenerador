# Placa celeste restaurada y mar al 120 % · 20 de octubre de 2026

El usuario rechaza el fondo de Monterey recién añadido y pide recuperar la placa celeste anterior. También solicita acelerar ligeramente el mar y mantener las olas irregulares del modelo original descargado.

Nueva escena vigente: **`Oceano_cetaceos_base_celeste_REVISION`**, basada en `Oceano_y_cetaceos_GLB_REVISION`, conservando la plataforma, los dos cetáceos descargados con sus movimientos y tamaños de referencia y el volumen submarino anterior. Vuelve el objeto original `MAR_REV_FONDO_MARINO` con su material anterior, sin sustituirlo por otra geometría ni recolorearlo. La escena nueva no contiene el recorte Monterey, su referencia completa, la luz auxiliar ni su volumen ampliado. La revisión rechazada de Monterey permanece únicamente como historial, sin incorporarla a la web.

Se conserva el clip de deformación del recurso `free_ocean_simulation-tiled.glb`, con sus texturas y oleaje irregular original. Se reproduce **1,2 veces más rápido** mediante la escala temporal NLA de 0,8333333. No se añaden ondas sinusoidales, ruido adicional, deformaciones nuevas ni aleatoriedad generada: el movimiento irregular es el que ya trae el archivo, y se repite como clip.

Las cinco mallas y sus shape keys se copian de forma independiente para esta revisión; las ocho instancias repetidas apuntan a la colección nueva. Las acciones y materiales originales se reutilizan sin editar. Los strips NLA de las versiones anteriores siguen a escala 1; sus velocidades no cambian. Los diez inventarios de escenas previas se conservan. El mar mantiene su tamaño y cobertura aproximada de 450 m, sin acelerar los animales ni cambiar la escala métrica.

Se comprueba que el vértice de muestra del mar nuevo en el fotograma 51 coincide exactamente con el original en el 61, confirmando el factor 1,2 sin alterar el patrón. `verificacion.json` registra también la placa recuperada, ausencia de Monterey y escala temporal anterior intacta.

Carpeta: `exportaciones/base_celeste_mar_rapido_REVISION_2026-10-20/`.

- **`base_celeste_mar_120_REVISION.blend`**: copia comprimida con esta escena activa.
- `base_celeste_submarina.png` y `mar_original_rapido.png`: renders de revisión.
- `configuracion_y_conservacion.json`, `conservacion_escenas.json`, `verificacion.json`, `guardado_listo.json` y `MANIFIESTO_SHA256.json`.

Script de preparación: `scripts/restaurar_base_celeste_mar_rapido.py`. Conservar las atribuciones del océano, jorobada y cachalote registradas en las notas de importación anteriores.

**No se modifica la web; sigue pendiente de revisión del usuario.** Se guardan los avances y se conservan las copias anteriores. Sin publicación ni GitHub.

## Velocidad vigente: 50 % más rápida que el original

Por nueva petición del usuario se cambia el factor 1,2 por **1,5 respecto al clip original**. Los cinco strips NLA pasan a escala temporal 0,6666667, con tres repeticiones. Se conserva exactamente el oleaje irregular recibido, la placa celeste, el movimiento y escala de los animales y la plataforma. La colección pasa a llamarse `CELESTE_OCEANO_ORIGINAL_VELOCIDAD_150`.

Nueva copia vigente: **`base_celeste_mar_150_REVISION.blend`**, en la misma carpeta. Se conserva el archivo anterior al 120 %. `velocidad_150_verificacion.json` registra el factor comprobado en las cinco mallas y `guardado_150_listo.json` confirma el guardado. Los renders anteriores muestran la revisión al 120 % y se conservan como historial; esta petición solo cambia la velocidad de reproducción. Web sin cambios.
