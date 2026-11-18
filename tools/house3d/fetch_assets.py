"""Download CC0 assets from Poly Haven into assets/polyhaven/ (kept out of git).

    python3 fetch_assets.py [assets.json]

assets.json lists what to fetch:
  {"hdris": {"id": "2k"}, "textures": {"id": "1k"}, "models": {"id": "1k"}}
Textures get diffuse, roughness and OpenGL normal maps; models get the glTF
with its textures. Files that already exist are skipped.
"""
import json, os, sys, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.environ.get("HOUSE3D_ASSETS") or os.path.join(HERE, "assets", "polyhaven")
UA = {"User-Agent": "house3d-build"}


def get(url):
    return urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=120).read()


def save(url, path):
    if os.path.exists(path) and os.path.getsize(path) > 0:
        return
    os.makedirs(os.path.dirname(path), exist_ok=True)
    data = get(url)
    with open(path, "wb") as f:
        f.write(data)
    print(f"  {os.path.relpath(path, OUT)} ({len(data) / 1e6:.1f} MB)")


def main():
    manifest = json.load(open(sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, "assets.json")))
    for aid, res in manifest.get("hdris", {}).items():
        files = json.loads(get(f"https://api.polyhaven.com/files/{aid}"))
        save(files["hdri"][res]["hdr"]["url"], os.path.join(OUT, "hdris", f"{aid}.hdr"))
    for aid, res in manifest.get("textures", {}).items():
        files = json.loads(get(f"https://api.polyhaven.com/files/{aid}"))
        for key, name in (("Diffuse", "diff"), ("Rough", "rough"), ("nor_gl", "nor")):
            if key in files:
                save(files[key][res]["jpg"]["url"], os.path.join(OUT, "textures", aid, f"{name}.jpg"))
    for aid, res in manifest.get("models", {}).items():
        files = json.loads(get(f"https://api.polyhaven.com/files/{aid}"))
        g = files["gltf"][res]["gltf"]
        base = os.path.join(OUT, "models", aid)
        save(g["url"], os.path.join(base, f"{aid}.gltf"))
        for rel, inc in g.get("include", {}).items():
            save(inc["url"], os.path.join(base, rel))
    print("assets ready in", OUT)


main()
