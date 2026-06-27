import math
import random
from pathlib import Path

import bpy

BASE_DIR = Path(__file__).resolve().parent
OUTPUT_BLEND = BASE_DIR / "aerogenerador_molino_completo_cesped_mejorado.blend"
OUTPUT_VIDEO = BASE_DIR / "aerogenerador_animacion_4s_molino_completo_cesped_mejorado.mp4"

random.seed(42)


def make_mat(name, color, roughness=0.9):
    mat = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    if bsdf:
        bsdf.inputs["Base Color"].default_value = color
        bsdf.inputs["Roughness"].default_value = roughness
    return mat


grass_mat = make_mat("cesped_continuo_verde_natural", (0.19, 0.38, 0.12, 1), 0.96)
grass_light = make_mat("cesped_variacion_verde_claro", (0.31, 0.52, 0.18, 1), 0.98)
grass_dark = make_mat("cesped_variacion_verde_profundo", (0.12, 0.28, 0.10, 1), 0.98)
flower_mat = make_mat("flores_silvestres_blancas_sutiles", (0.92, 0.93, 0.78, 1), 0.9)

removed = []
for obj in list(bpy.context.scene.objects):
    lower = obj.name.lower()
    mat_names = " ".join(slot.material.name.lower() for slot in obj.material_slots if slot.material)
    if lower.startswith("path_camino") or "camino grava" in mat_names:
        removed.append(obj.name)
        bpy.data.objects.remove(obj, do_unlink=True)

ground = bpy.data.objects.get("cesped_continuo_sin_camino_principal")
if ground is None:
    bpy.ops.mesh.primitive_plane_add(size=220, location=(0, 0, -0.002))
    ground = bpy.context.object
    ground.name = "cesped_continuo_sin_camino_principal"
else:
    ground.location.z = -0.002
ground.data.materials.clear()
ground.data.materials.append(grass_mat)

for i in range(36):
    radius = random.uniform(16, 105)
    angle = random.uniform(0, math.tau)
    x = math.cos(angle) * radius
    y = math.sin(angle) * radius
    if -65 < x < 50 and -42 < y < 0:
        y += 24
    bpy.ops.mesh.primitive_circle_add(
        vertices=48,
        radius=random.uniform(4.5, 13.5),
        fill_type="TRIFAN",
        location=(x, y, 0.004 + i * 0.00005),
        rotation=(0, 0, random.uniform(0, math.tau)),
    )
    patch = bpy.context.object
    patch.name = f"cesped_manchas_naturales_sin_camino_{i:02d}"
    patch.scale.x *= random.uniform(1.6, 3.6)
    patch.scale.y *= random.uniform(0.45, 1.0)
    patch.data.materials.append(grass_light if i % 3 else grass_dark)

for i in range(120):
    radius = random.uniform(8, 92)
    angle = random.uniform(0, math.tau)
    x = math.cos(angle) * radius
    y = math.sin(angle) * radius
    if math.hypot(x, y) < 7:
        continue
    height = random.uniform(0.45, 1.25)
    bpy.ops.mesh.primitive_cone_add(
        vertices=5,
        radius1=random.uniform(0.025, 0.065),
        radius2=0.0,
        depth=height,
        location=(x, y, height / 2),
        rotation=(random.uniform(-0.22, 0.22), random.uniform(-0.22, 0.22), random.uniform(0, math.tau)),
    )
    blade = bpy.context.object
    blade.name = f"hierba_alta_decorativa_{i:03d}"
    blade.data.materials.append(grass_light if i % 2 else grass_dark)

for i in range(48):
    radius = random.uniform(18, 86)
    angle = random.uniform(0, math.tau)
    x = math.cos(angle) * radius
    y = math.sin(angle) * radius
    bpy.ops.mesh.primitive_uv_sphere_add(
        segments=8,
        ring_count=4,
        radius=random.uniform(0.055, 0.11),
        location=(x, y, random.uniform(0.16, 0.34)),
    )
    flower = bpy.context.object
    flower.name = f"flor_silvestre_sutil_{i:02d}"
    flower.scale.z = 0.45
    flower.data.materials.append(flower_mat)

scene = bpy.context.scene
scene.render.filepath = str(OUTPUT_VIDEO)
scene.frame_start = 1
scene.frame_end = 96
scene.render.fps = 24
scene.render.resolution_x = 1280
scene.render.resolution_y = 720
scene.render.resolution_percentage = 100

if hasattr(scene, "cycles"):
    scene.render.engine = "CYCLES"
    scene.cycles.samples = 16
    scene.cycles.preview_samples = 8
    scene.cycles.use_denoising = True

bpy.ops.wm.save_as_mainfile(filepath=str(OUTPUT_BLEND))
print(f"Removed path objects: {len(removed)}")
for name in removed:
    print(f"REMOVED {name}")
print(f"Rendering improved grass scene to {OUTPUT_VIDEO}")
bpy.ops.render.render(animation=True)
