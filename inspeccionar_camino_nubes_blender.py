import bpy

print("POSSIBLE PATH / BROWN OBJECTS")
for obj in bpy.context.scene.objects:
    mat_names = [slot.material.name.lower() for slot in obj.material_slots if slot.material]
    name = obj.name.lower()
    loc = obj.matrix_world.translation
    dims = obj.dimensions
    haystack = " ".join([name, *mat_names])
    is_brownish = False
    for slot in obj.material_slots:
        mat = slot.material
        if not mat or not mat.use_nodes:
            continue
        bsdf = mat.node_tree.nodes.get("Principled BSDF")
        if not bsdf:
            continue
        color = bsdf.inputs["Base Color"].default_value
        r, g, b = color[:3]
        is_brownish = is_brownish or (r > g > b and r > 0.18 and g < 0.45 and b < 0.3)
    if (
        "camino" in haystack
        or "path" in haystack
        or "track" in haystack
        or "road" in haystack
        or "grava" in haystack
        or "wood" in haystack
        or "madera" in haystack
        or is_brownish
    ):
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

print("CLOUD OBJECTS")
for obj in bpy.context.scene.objects:
    if "cloud" in obj.name.lower() or any("cloud" in (slot.material.name.lower() if slot.material else "") for slot in obj.material_slots):
        loc = obj.matrix_world.translation
        dims = obj.dimensions
        print(
            "CLOUD",
            obj.name,
            "LOC",
            round(loc.x, 2),
            round(loc.y, 2),
            round(loc.z, 2),
            "DIM",
            round(dims.x, 2),
            round(dims.y, 2),
            round(dims.z, 2),
        )
