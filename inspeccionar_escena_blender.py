import bpy

print("SCENE", bpy.context.scene.name)
print("FRAME_RANGE", bpy.context.scene.frame_start, bpy.context.scene.frame_end)
print("CAMERA", bpy.context.scene.camera.name if bpy.context.scene.camera else "None")

objects = []
for obj in bpy.context.scene.objects:
    if obj.type != "MESH":
        continue
    center = obj.matrix_world.translation
    dims = obj.dimensions
    objects.append((obj.name, center.x, center.y, center.z, dims.x, dims.y, dims.z))

objects.sort(key=lambda item: item[6], reverse=True)
for item in objects[:60]:
    print(
        "OBJ",
        item[0],
        "LOC",
        round(item[1], 3),
        round(item[2], 3),
        round(item[3], 3),
        "DIM",
        round(item[4], 3),
        round(item[5], 3),
        round(item[6], 3),
    )
