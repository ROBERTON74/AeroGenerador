from pathlib import Path

import bpy

BASE_DIR = Path(__file__).resolve().parent
OUTPUT_BLEND = BASE_DIR / "aerogenerador_molino_completo_sin_banderitas.blend"
OUTPUT_VIDEO = BASE_DIR / "aerogenerador_animacion_4s_molino_completo_sin_banderitas.mp4"

removed = []
for obj in list(bpy.context.scene.objects):
    name = obj.name.lower()
    if name.startswith("banda_roja_pala") or ("banda_roja" in name and "pala" in name):
        removed.append(obj.name)
        bpy.data.objects.remove(obj, do_unlink=True)

bpy.context.scene.render.filepath = str(OUTPUT_VIDEO)
bpy.context.scene.frame_start = 1
bpy.context.scene.frame_end = 96
bpy.context.scene.render.fps = 24
bpy.context.scene.render.resolution_x = 1280
bpy.context.scene.render.resolution_y = 720
bpy.context.scene.render.resolution_percentage = 100

if hasattr(bpy.context.scene, "cycles"):
    bpy.context.scene.render.engine = "CYCLES"
    bpy.context.scene.cycles.samples = 16
    bpy.context.scene.cycles.preview_samples = 8
    bpy.context.scene.cycles.use_denoising = True

bpy.ops.wm.save_as_mainfile(filepath=str(OUTPUT_BLEND))
print(f"Removed blade red bands: {len(removed)}")
for name in removed:
    print(f"REMOVED {name}")
print(f"Rendering clean full turbine video to {OUTPUT_VIDEO}")
bpy.ops.render.render(animation=True)
