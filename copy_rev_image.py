import shutil
import os

source = "/Users/kanglinyao/.gemini/antigravity/brain/0211b3c9-c3c2-44b7-b024-b0804d70dd12/christ_the_king_majesty_1772560261068.png"
destination = "/Users/kanglinyao/Projects/Jekyll-Sites/reformnow.github.io/assets/img/posts/christ_the_king.jpg"

try:
    # Ensure the destination directory exists
    os.makedirs(os.path.dirname(destination), exist_ok=True)
    shutil.copy2(source, destination)
    print(f"Successfully copied {source} to {destination}")
except Exception as e:
    print(f"Error copying file: {e}")
