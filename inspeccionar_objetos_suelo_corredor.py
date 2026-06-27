import bpy

for obj in bpy.context.scene.objects:
    if obj.type != "MESH":
        continue
    loc = obj.matrix_world.translation
    dims = obj.dimensions
    if -35 <= loc.x <= 45 and -95 <= loc.y <= 20 and loc.z <= 2.0:
        mat_names = [slot.material.name for slot in obj.material_slots if slot.material]
        print(
            "OBJ",
            obj.name,
            "LOC",
            round(loc.x, 2),
            round(loc.y, 2),
            round(loc.z, 2),
            "DIM",
            round(dims.x, 3),
            round(dims.y, 3),
            round(dims.z, 3),
            "MATS",
            "|".join(mat_names),
        )
