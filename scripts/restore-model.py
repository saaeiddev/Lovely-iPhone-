"""Rebuild the web-optimized GLB from repository-safe text chunks.
Only textures were resized; the supplied model's geometry and materials are preserved.
"""
from pathlib import Path
from base64 import b64decode
from hashlib import sha256

root = Path(__file__).resolve().parents[1]
parts = sorted((root / "assets" / "model-parts").glob("part-*.b64"))
assert len(parts) == 33, f"Expected 33 model parts, found {len(parts)}"
data = b64decode(b"".join(part.read_bytes().strip() for part in parts), validate=False)
expected = "ac1b820619602be61f8447fbee297c55116112e12a58f992281c7249b11e2368"
actual = sha256(data).hexdigest()
assert actual == expected, f"GLB integrity failure: {actual}"
target = root / "assets" / "Phone-17-Pro-Max-web.glb"
target.parent.mkdir(parents=True, exist_ok=True)
target.write_bytes(data)
print(f"Restored {target.name}: {len(data):,} bytes, SHA256 OK")
