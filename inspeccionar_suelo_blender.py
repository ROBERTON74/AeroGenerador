import bpy

keywords = ("path", "road", "camino", "sendero", "grass", "cesped", "césped", "ground", "terrain", "soil", "dirt")

for obj in bpy.context.scene.objects:
    name = obj.name.lower()
    mat_names = [slot.material.name.lower() for slot in obj.material_slots if slot.material]
    haystack = " ".join([name, *mat_names])
    if any(word in haystack for word in keywords):
        loc = obj.matrix_world.translation
        dims = obj.dimensions
        print(
            "OBJ",
            obj.name,
            "TYPE",
            obj.type,
            "LOC",
            round(loc.x, 2),
            round(loc.y, 2),
            round(loc.z, 2),
            "DIM",
            round(dims.x, 2),
            round(dims.y, 2),
            round(dims.z, 2),
            "MATS",
            ",".join(mat_names),
        )
