import bpy

# Continua o lanza el render de la animacion activa en el archivo Blender abierto.
bpy.ops.render.render(animation=True)
