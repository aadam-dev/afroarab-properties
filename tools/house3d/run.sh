#!/usr/bin/env bash
# Build a house for the site.
#   bash tools/house3d/run.sh <slug>            validate, build the render scene and the web model
#   bash tools/house3d/run.sh <slug> --test id  also render one quick 360° view (build/test/<id>.jpg)
#   bash tools/house3d/run.sh <slug> --panos    also render every 360° tour view at full quality (slow)
# Writes public/models/houses/<slug>.glb, public/models/houses/<slug>/<view>.jpg
# and src/data/houses/<slug>.meta.json. Needs assets: python3 fetch_assets.py
set -euo pipefail
cd "$(dirname "$0")"
SLUG="${1:?usage: run.sh <slug> [--test id | --panos]}"
H="houses/$SLUG"
SPEC="$H/house.json"

BLENDER="${BLENDER:-}"
if [ -z "$BLENDER" ]; then
  for c in /Applications/Blender.app/Contents/MacOS/Blender "$(command -v blender || true)"; do
    if [ -n "$c" ] && [ -x "$c" ]; then BLENDER="$c"; break; fi
  done
fi
[ -n "$BLENDER" ] || { echo "Blender not found. Set BLENDER=/path/to/blender"; exit 1; }

node validate.mjs "$SPEC"
# Render scene: full-resolution textures, sky, lights (no GLB).
"$BLENDER" -b --factory-startup -P build_house.py -- "$SPEC" "$H/build" --no-glb 2>&1 | grep -E "Error|Traceback|MISSING" || true
# Web model: 512 px textures, thinned furniture meshes.
"$BLENDER" -b --factory-startup -P build_house.py -- "$SPEC" "$H/build-web" --web-tex 512 \
  --glb "../../public/models/houses/$SLUG.glb" --meta "../../src/data/houses/$SLUG.meta.json" 2>&1 | grep -E "BUILT|Error|Traceback"

case "${2:-}" in
  --test)
    mkdir -p "$H/build/test"
    "$BLENDER" -b "$H/build/$SLUG.blend" -P render_panos.py -- "$SPEC" "$H/build/test" --only "${3:?view id}" --width 1280 --samples 32 2>&1 | grep -E "^PANO|Error"
    ;;
  --panos)
    "$BLENDER" -b "$H/build/$SLUG.blend" -P render_panos.py -- "$SPEC" "$H/panos" --width 2560 --samples 64 2>&1 | grep -E "^PANO|Error"
    mkdir -p "../../public/models/houses/$SLUG" && cp "$H"/panos/*.jpg "../../public/models/houses/$SLUG/"
    ;;
esac
