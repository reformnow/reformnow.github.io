import os
import sys

source = '/Users/kanglinyao/.gemini/antigravity/brain/0211b3c9-c3c2-44b7-b024-b0804d70dd12/perseverance_oil_full_bleed_1772498635458.png'
dest = 'assets/img/posts/perseverance_oil.jpg'

print(f"Checking source: {os.path.exists(source)}")
print(f"Checking dest dir: {os.path.exists('assets/img/posts')}")

try:
    with open(source, 'rb') as f:
        data = f.read()
    with open(dest, 'wb') as f:
        f.write(data)
    print(f"SUCCESS: Copied {len(data)} bytes")
    # Also copy to _site to be sure
    site_dest = '_site/assets/img/posts/perseverance_oil.jpg'
    if os.path.exists('_site/assets/img/posts'):
        with open(site_dest, 'wb') as f:
            f.write(data)
        print("Also copied to _site")
except Exception as e:
    print(f"FAILED: {e}")
