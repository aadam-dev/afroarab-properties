#!/usr/bin/env bash
# Validate, build and (optionally) render a house.
#   bash tools/house3d/run.sh <slug> [--render]
# Writes public/models/houses/<slug>.glb and src/data/houses/<slug>.meta.json.
set -euo pipefail
cd "$(dirname "$0")"
SLUG="${1:?usage: run.sh <slug> [--render]}"
SPEC="houses/$SLUG/house.json"

BLENDER="${BLENDER:-}"
if [ -z "$BLENDER" ]; then
  for c in /Applications/Blender.app/Contents/MacOS/Blender "$(command -v blender || true)"; do
    if [ -n "$c" ] && [ -x "$c" ]; then BLENDER="$c"; break; fi
  done
fi
[ -n "$BLENDER" ] || { echo "Blender not found. Set BLENDER=/path/to/blender"; exit 1; }

node validate.mjs "$SPEC"
"$BLENDER" -b --factory-startup -P build_house.py -- "$SPEC" "houses/$SLUG/build" \
  --glb "../../public/models/houses/$SLUG.glb" --meta "../../src/data/houses/$SLUG.meta.json" 2>&1 | grep -E "BUILT|Error|Traceback"

if [ "${2:-}" = "--render" ]; then
  "$BLENDER" -b "houses/$SLUG/build/$SLUG.blend" -P render_views.py -- "$SPEC" "houses/$SLUG/renders" 2>&1 | grep -E "RENDERED|Error"
fi
