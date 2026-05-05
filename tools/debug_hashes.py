import re, hashlib, os, json

def clean_markdown(text):
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

filename = '2026-03-05-past-and-present-of-decisionism.md'
filepath = os.path.join('_posts', filename)
with open(filepath, 'r', encoding='utf-8') as f: 
    content = f.read()

slug = filename.replace('.md', '')
content_no_frontmatter = re.sub(r'^---.*?---\n', '', content, flags=re.DOTALL)

en_lines = []
zh_lines = []
current_block = []

for line in content_no_frontmatter.split('\n'):
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
en_text_clean = clean_markdown(en_text)
en_hash = hashlib.md5(en_text_clean.encode('utf-8')).hexdigest()

print(f'Current Hash: {en_hash}')

with open('tools/.tts_hashes.json', 'r') as f:
    hashes = json.load(f)
print(f'Stored Hash:  {hashes.get(slug + "_en")}')
