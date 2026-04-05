import base64
import os

source_img = '/Users/kanglinyao/.gemini/antigravity/brain/0211b3c9-c3c2-44b7-b024-b0804d70dd12/perseverance_oil_full_bleed_1772498635458.png'
post_file = '_posts/2026-03-02-perseverance-of-the-saints.md'
log_file = 'embed_log.txt'

with open(log_file, 'w') as log:
    try:
        if not os.path.exists(source_img):
            log.write(f"ERROR: Image not found at {source_img}\n")
            exit(1)
        
        with open(source_img, 'rb') as f:
            img_data = f.read()
        
        base64_img = base64.b64encode(img_data).decode('utf-8')
        data_uri = f"data:image/png;base64,{base64_img}"
        
        with open(post_file, 'r') as f:
            content = f.read()
        
        # Replace the image path with the Data URI
        # We'll look for the image block in frontmatter
        old_image_block = "image:\n  path: /assets/img/posts/perseverance_oil.jpg\n  alt: Perseverance of the Saints - The Good Shepherd"
        new_image_block = f"image:\n  path: \"{data_uri}\"\n  alt: Perseverance of the Saints - The Good Shepherd"
        
        if old_image_block in content:
            new_content = content.replace(old_image_block, new_image_block)
            with open(post_file, 'w') as f:
                f.write(new_content)
            log.write("SUCCESS: Embedded image via Data URI in frontmatter\n")
        else:
            # Try a simpler replacement if formatting is slightly different
            log.write("WARNING: Exact image block not found, attempting fallback replacement\n")
            import re
            new_content = re.sub(r'image:\s+path:.*?\n\s+alt:.*?\n', f'image:\n  path: "{data_uri}"\n  alt: Perseverance of the Saints - The Good Shepherd\n', content, flags=re.DOTALL)
            with open(post_file, 'w') as f:
                f.write(new_content)
            log.write("SUCCESS: Embedded image via fallback regex\n")
            
    except Exception as e:
        log.write(f"FATAL ERROR: {e}\n")
