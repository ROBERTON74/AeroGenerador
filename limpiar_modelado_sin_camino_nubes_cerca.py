import math
import random
from pathlib import Path

import bpy

BASE_DIR = Path(__file__).resolve().parent
OUTPUT_BLEND = BASE_DIR / "aerogenerador_modelado_sin_camino_nubes_cerca.blend"

random.seed(141)


def material(name, color, roughness=0.96):
    mat = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    mat.diffuse_color = color
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    if bsdf:
        bsdf.inputs["Base Color"].default_value = color
        bsdf.inputs["Roughness"].default_value = roughness
    return mat


grass_light = material("cesped_verde_vivo_sin_camino", (0.30, 0.54, 0.17, 1))
grass_dark = material("cesped_verde_profundo_sin_camino", (0.10, 0.27, 0.09, 1))

removed_path = []
for obj in list(bpy.context.scene.objects):
    name = obj.name.lower()
    mats = " ".join(slot.material.name.lower() for slot in obj.material_slots if slot.material)
    if (
        name.startswith("path_camino")
        or "camino" in name
        or "camino" in mats
        or "grava" in mats
        or "road" in name
        or "track" in name
    ):
        removed_path.append(obj.name)
        bpy.data.objects.remove(obj, do_unlink=True)

# Remove old broad cover strips if they exist; the model should read as one clean grass field.
for obj in list(bpy.context.scene.objects):
    if obj.name.startswith("cesped_cubre_totalmente_camino_marron_"):
        bpy.data.objects.remove(obj, do_unlink=True)

# Keep only subtle grass blades over the former path footprint.
for obj in list(bpy.context.scene.objects):
    if obj.name.startswith("hierba_densa_sobre_antiguo_camino_"):
        bpy.data.objects.remove(obj, do_unlink=True)

for i in range(130):
    t = random.random()
    x = -54 + t * 86 + random.uniform(-3.6, 3.6)
    y = -36 + t * 26 + random.uniform(-4.8, 4.8)
    if random.random() < 0.5:
        x = 7 + random.uniform(-5.0, 5.0)
        y = -78 + random.random() * 72
    h = random.uniform(0.32, 0.88)
    bpy.ops.mesh.primitive_cone_add(
        vertices=5,
        radius1=random.uniform(0.022, 0.05),
        radius2=0,
        depth=h,
        location=(x, y, h / 2 + 0.02),
        rotation=(random.uniform(-0.22, 0.22), random.uniform(-0.22, 0.22), random.uniform(0, math.tau)),
    )
    blade = bpy.context.object
    blade.name = f"hierba_densa_sobre_antiguo_camino_{i:03d}"
    blade.color = (0.22, 0.46, 0.13, 1)
    blade.data.materials.append(grass_light if i % 3 else grass_dark)

removed_red_blades = []
for obj in list(bpy.context.scene.objects):
    name = obj.name.lower()
    if name.startswith("banda_roja_pala_") or "blade_tip_warning" in name or "punta_roja" in name or "banderita" in name:
        removed_red_blades.append(obj.name)
        bpy.data.objects.remove(obj, do_unlink=True)

cloud_targets = {
    "behind_rotor_high": (-22, 48, 135),
    "right_of_tower": (34, 40, 118),
    "left_soft_background": (-38, 42, 116),
    "far_over_landscape": (4, 62, 145),
}
cloud_counts = {key: 0 for key in cloud_targets}

for obj in bpy.context.scene.objects:
    lower = obj.name.lower()
    if "integrated_cloud" not in lower:
        continue
    for key, base in cloud_targets.items():
        if key in lower:
            count = cloud_counts[key]
            cloud_counts[key] += 1
            row = count % 5
            col = count // 5
            obj.location.x = base[0] + (row - 2) * 5.6 + random.uniform(-1.2, 1.2)
            obj.location.y = base[1] + col * 3.8 + random.uniform(-1.2, 1.2)
            obj.location.z = base[2] + random.uniform(-4.0, 4.0)
            obj.scale *= 1.08
            break

bpy.ops.wm.save_as_mainfile(filepath=str(OUTPUT_BLEND))
print(f"Objetos de camino eliminados: {len(removed_path)}")
print(f"Bandas rojas de palas eliminadas: {len(removed_red_blades)}")
print(f"Nubes acercadas: {cloud_counts}")
print(f"Guardado en: {OUTPUT_BLEND}")
