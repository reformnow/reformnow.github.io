import re
import os
import json
import hashlib
import asyncio
import edge_tts

posts_dir = '_posts'
audio_dir = 'assets/audio/posts'
os.makedirs(audio_dir, exist_ok=True)
hashes_file = 'tools/.tts_hashes.json'

if os.path.exists(hashes_file):
    with open(hashes_file, 'r') as f:
        hashes = json.load(f)
else:
    hashes = {}

def clean_markdown(text):
    # Remove YAML Frontmatter
    if text.startswith('---'):
        text = re.sub(r'^---.*?---\n', '', text, flags=re.DOTALL)
    # Remove markdown titles, bold, italics, quotes
    text = re.sub(r'#+\s+', '', text)
    text = re.sub(r'\*\*(.*?)\*\*', r'\1', text)
    text = re.sub(r'\*(.*?)\*', r'\1', text)
    text = re.sub(r'>\s+', '', text)
    # Remove code blocks
    text = re.sub(r'```[a-zA-Z]*\n(.*?)\n```', r'\1', text, flags=re.DOTALL)
    text = re.sub(r'`(.*?)`', r'\1', text)
    return text.strip()

async def generate_speech(text, voice, outfile):
    communicate = edge_tts.Communicate(text, voice)
    await communicate.save(outfile)

async def main():
    has_changes = False
    for filename in os.listdir(posts_dir):
        if not filename.endswith('.md'):
            continue
            
        filepath = os.path.join(posts_dir, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # strip the date from the slug for better URLs if desired, or keep filename
        slug = filename.replace('.md', '')
        
        content_no_frontmatter = re.sub(r'^---.*?---\n', '', content, flags=re.DOTALL)
        
        en_lines = []
        zh_lines = []
        current_block = []
        
        for line in content_no_frontmatter.split('\n'):
            if re.search(r'\{:\s*\.lang-en', line):
                en_lines.append("\n".join(current_block).strip())
                current_block = []
            elif re.search(r'\{:\s*\.lang-zh', line):
                zh_lines.append("\n".join(current_block).strip())
                current_block = []
            else:
                current_block.append(line)
                
        en_text = "\n".join(filter(None, en_lines))
        zh_text = "\n".join(filter(None, zh_lines))
        
        en_text_clean = clean_markdown(en_text)
        zh_text_clean = clean_markdown(zh_text)
        
        en_hash = hashlib.md5(en_text_clean.encode('utf-8')).hexdigest()
        zh_hash = hashlib.md5(zh_text_clean.encode('utf-8')).hexdigest()
        
        en_audio_path = os.path.join(audio_dir, f"{slug}_en.mp3")
        zh_audio_path = os.path.join(audio_dir, f"{slug}_zh.mp3")
        
        # Generate EN
        if en_text_clean and hashes.get(f"{slug}_en") != en_hash:
            print(f"Generating EN audio for {slug}...")
            await generate_speech(en_text_clean, "en-US-ChristopherNeural", en_audio_path)
            hashes[f"{slug}_en"] = en_hash
            has_changes = True

        # Generate ZH
        if zh_text_clean and hashes.get(f"{slug}_zh") != zh_hash:
            print(f"Generating ZH audio for {slug}...")
            await generate_speech(zh_text_clean, "zh-CN-YunxiNeural", zh_audio_path)
            hashes[f"{slug}_zh"] = zh_hash
            has_changes = True

    if has_changes:
        with open(hashes_file, 'w') as f:
            json.dump(hashes, f, indent=2)
        print("Audio generation completed.")
    else:
        print("All audio files are up to date.")

if __name__ == '__main__':
    asyncio.run(main())
