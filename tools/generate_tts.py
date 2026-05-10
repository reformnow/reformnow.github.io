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
    with open(hashes_file, 'r', encoding='utf-8') as f:
        try:
            hashes = json.load(f)
        except json.JSONDecodeError:
            hashes = {}
else:
    hashes = {}

def clean_markdown(text):
    # Ensure line endings are consistent (remove \r) and normalize to \n
    text = text.replace('\r\n', '\n').replace('\r', '\n')
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
    # Remove HTML tags (e.g. <audio>, <div>)
    text = re.sub(r'<[^>]+>', '', text)
    # Remove Greek and Hebrew characters that TTS engines struggle with
    text = re.sub(r'[\u0370-\u03FF\u1F00-\u1FFF\u0590-\u05FF\uFB1D-\uFB4F]+', '', text)
    return text.strip()

async def generate_speech(text, voice, outfile, retries=4, delay=5):
    for attempt in range(retries):
        try:
            communicate = edge_tts.Communicate(text, voice)
            await communicate.save(outfile)
            return
        except Exception as e:
            print(f"Error on attempt {attempt + 1}/{retries} for {outfile}: {e}")
            if attempt < retries - 1:
                print(f"Retrying in {delay} seconds...")
                await asyncio.sleep(delay)
            else:
                print(f"Failed to generate {outfile} after {retries} attempts.")
                raise e

async def main():
    has_changes = False
    # Sorting filenames for deterministic iteration
    for filename in sorted(os.listdir(posts_dir)):
        if not filename.endswith('.md'):
            continue
            
        filepath = os.path.join(posts_dir, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        slug = filename.replace('.md', '')
        # Normalize the whole content's line endings before regex
        content = content.replace('\r\n', '\n').replace('\r', '\n')
        content_no_frontmatter = re.sub(r'^---.*?---\n', '', content, flags=re.DOTALL)
        
        en_lines = []
        zh_lines = []
        current_block = []
        
        for line in content_no_frontmatter.split('\n'):
            # Stop parsing if we reach the Bibliography section
            if re.search(r'##\s*(Bibliography|参考文献)', line):
                break
                
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
        
        # Check if file exists to force regeneration if missing
        en_missing = not os.path.exists(en_audio_path)
        zh_missing = not os.path.exists(zh_audio_path)

        # Generate EN
        if en_text_clean and (hashes.get(f"{slug}_en") != en_hash or en_missing):
            reason = "content change" if hashes.get(f"{slug}_en") != en_hash else "missing file"
            print(f"Generating EN audio for {slug} ({reason})...")
            await generate_speech(en_text_clean, "en-GB-RyanNeural", en_audio_path)
            hashes[f"{slug}_en"] = en_hash
            has_changes = True
            await asyncio.sleep(1)

        # Generate ZH
        if zh_text_clean and (hashes.get(f"{slug}_zh") != zh_hash or zh_missing):
            reason = "content change" if hashes.get(f"{slug}_zh") != zh_hash else "missing file"
            print(f"Generating ZH audio for {slug} ({reason})...")
            await generate_speech(zh_text_clean, "zh-CN-YunjianNeural", zh_audio_path)
            hashes[f"{slug}_zh"] = zh_hash
            has_changes = True
            await asyncio.sleep(1)

    if has_changes:
        with open(hashes_file, 'w', encoding='utf-8') as f:
            json.dump(hashes, f, indent=2, sort_keys=True)
        print("Audio generation completed and hashes updated.")
    else:
        print("All audio files are up to date.")

if __name__ == '__main__':
    asyncio.run(main())
