import os
source = '/Users/kanglinyao/.gemini/antigravity/brain/0211b3c9-c3c2-44b7-b024-b0804d70dd12/perseverance_oil_full_bleed_1772498635458.png'
dest = 'assets/img/posts/perseverance_oil.jpg'
log_file = 'deploy_log.txt'

with open(log_file, 'w') as log:
    try:
        log.write(f"Starting copy from {source} to {dest}\n")
        if not os.path.exists(source):
            log.write(f"Source not found: {source}\n")
        else:
            with open(source, 'rb') as f:
                data = f.read()
            with open(dest, 'wb') as f:
                f.write(data)
            log.write(f"SUCCESS: Copied {len(data)} bytes to {dest}\n")
            
            # site_dest
            site_dest = '_site/assets/img/posts/perseverance_oil.jpg'
            if os.path.exists('_site/assets/img/posts'):
                with open(site_dest, 'wb') as f:
                    f.write(data)
                log.write(f"SUCCESS: Copied to {site_dest}\n")
            else:
                log.write("_site directory not found or doesn't have the path\n")
    except Exception as e:
        log.write(f"ERROR: {e}\n")
