import math
from pathlib import Path

import bpy
from mathutils import Vector

BASE_DIR = Path(__file__).resolve().parent
OUTPUT = BASE_DIR / "aerogenerador_animacion_4s_molino_completo.mp4"


def look_at(obj, target):
    direction = Vector(target) - obj.location
    obj.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()


scene = bpy.context.scene
scene.frame_start = 1
scene.frame_end = 96
scene.frame_set(1)
scene.render.fps = 24

scene.render.resolution_x = 1280
scene.render.resolution_y = 720
scene.render.resolution_percentage = 100

if hasattr(scene, "cycles"):
    scene.render.engine = "CYCLES"
    scene.cycles.samples = 16
    scene.cycles.preview_samples = 8
    scene.cycles.use_denoising = True

scene.render.image_settings.file_format = "FFMPEG"
scene.render.ffmpeg.format = "MPEG4"
scene.render.ffmpeg.codec = "H264"
scene.render.ffmpeg.constant_rate_factor = "MEDIUM"
scene.render.ffmpeg.ffmpeg_preset = "GOOD"
scene.render.filepath = str(OUTPUT)

camera = bpy.data.objects.get("CAM_molino_completo_corto")
if camera is None:
    camera_data = bpy.data.cameras.new("CAM_molino_completo_corto")
    camera = bpy.data.objects.new("CAM_molino_completo_corto", camera_data)
    bpy.context.collection.objects.link(camera)

scene.camera = camera
camera.data.type = "ORTHO"
camera.data.ortho_scale = 172
camera.data.lens = 55
camera.data.dof.use_dof = False

target = (0, -4, 61)
camera.location = (118, -235, 108)
look_at(camera, target)
camera.keyframe_insert(data_path="location", frame=1)
camera.keyframe_insert(data_path="rotation_euler", frame=1)
camera.data.keyframe_insert(data_path="ortho_scale", frame=1)

camera.location = (105, -218, 104)
camera.data.ortho_scale = 164
look_at(camera, target)
camera.keyframe_insert(data_path="location", frame=96)
camera.keyframe_insert(data_path="rotation_euler", frame=96)
camera.data.keyframe_insert(data_path="ortho_scale", frame=96)

for block in (camera.animation_data.action.fcurves if camera.animation_data and camera.animation_data.action else []):
    for keyframe in block.keyframe_points:
        keyframe.interpolation = "SINE"

for obj in bpy.context.scene.objects:
    if obj.type == "LIGHT":
        obj.hide_render = False

bpy.ops.wm.save_as_mainfile(filepath=str(BASE_DIR / "aerogenerador_molino_completo_corto.blend"))
print(f"Rendering full turbine video to {OUTPUT}")
bpy.ops.render.render(animation=True)
