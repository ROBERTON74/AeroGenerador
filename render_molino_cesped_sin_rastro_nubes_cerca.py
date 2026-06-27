import math
import random
from pathlib import Path

import bpy

BASE_DIR = Path(__file__).resolve().parent
OUTPUT_BLEND = BASE_DIR / "aerogenerador_cesped_sin_rastro_nubes_cerca.blend"
OUTPUT_VIDEO = BASE_DIR / "aerogenerador_animacion_4s_cesped_sin_rastro_nubes_cerca.mp4"

random.seed(73)


def material(name, color, roughness=0.96):
    mat = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    if bsdf:
        bsdf.inputs["Base Color"].default_value = color
        bsdf.inputs["Roughness"].default_value = roughness
    return mat


grass = material("cesped_verde_continuo_cubre_camino", (0.18, 0.39, 0.13, 1))
grass_light = material("cesped_verde_vivo_cubre_rastro", (0.30, 0.54, 0.17, 1))
grass_dark = material("cesped_verde_profundo_cubre_rastro", (0.10, 0.27, 0.09, 1))

removed = []
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
        removed.append(obj.name)
        bpy.data.objects.remove(obj, do_unlink=True)

# Broad green cover over the old access path footprint.
cover_specs = [
    ((-56, -35, 0.018), (118, 9.2), -0.08, grass),
    ((-12, -19, 0.02), (62, 9.4), 0.03, grass_light),
    ((18, -11, 0.022), (54, 9.4), 0.08, grass),
    ((8, -45, 0.024), (88, 11.0), math.radians(84), grass_dark),
    ((8, -18, 0.026), (60, 10.0), math.radians(78), grass_light),
]

for index, (loc, scale, rot_z, mat) in enumerate(cover_specs):
    bpy.ops.mesh.primitive_circle_add(
        vertices=96,
        radius=1,
        fill_type="TRIFAN",
        location=loc,
        rotation=(0, 0, rot_z),
    )
    cover = bpy.context.object
    cover.name = f"cesped_cubre_totalmente_camino_marron_{index:02d}"
    cover.scale.x = scale[0] / 2
    cover.scale.y = scale[1] / 2
    cover.data.materials.append(mat)

# Add denser blades where the path used to be, so the area reads as grass.
for i in range(90):
    t = random.random()
    x = -54 + t * 86 + random.uniform(-3.2, 3.2)
    y = -36 + t * 26 + random.uniform(-4.2, 4.2)
    if random.random() < 0.45:
        x = 7 + random.uniform(-4.5, 4.5)
        y = -78 + random.random() * 70
    h = random.uniform(0.35, 0.95)
    bpy.ops.mesh.primitive_cone_add(
        vertices=5,
        radius1=random.uniform(0.025, 0.055),
        radius2=0,
        depth=h,
        location=(x, y, h / 2 + 0.02),
        rotation=(random.uniform(-0.22, 0.22), random.uniform(-0.22, 0.22), random.uniform(0, math.tau)),
    )
    blade = bpy.context.object
    blade.name = f"hierba_densa_sobre_antiguo_camino_{i:03d}"
    blade.data.materials.append(grass_light if i % 3 else grass_dark)

# Bring every cloud cluster closer to the turbine while keeping it behind/around the rotor.
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
print(f"Removed path/camino objects: {len(removed)}")
for name in removed:
    print(f"REMOVED {name}")
print("Moved clouds closer:", cloud_counts)
print(f"Rendering to {OUTPUT_VIDEO}")
bpy.ops.render.render(animation=True)
