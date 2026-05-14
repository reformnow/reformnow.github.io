import os
import re
import yaml

POSTS_DIR = '_posts'
TAG_LABELS_FILE = '_data/tag_labels.yml'

def load_tag_labels():
    with open(TAG_LABELS_FILE, 'r', encoding='utf-8') as f:
        return yaml.safe_load(f)

def audit_post(filepath, tag_labels):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Split front matter and body
    parts = content.split('---', 2)
    if len(parts) < 3:
        return {"error": "Invalid front matter"}
    
    fm = yaml.safe_load(parts[1])
    body = parts[2]

    # 1. Audit Categories and Tags
    missing_labels = []
    for key in ['categories', 'tags']:
        if key in fm:
            for val in fm[key]:
                val_normalized = val.strip()
                val_slugified = val_normalized.lower().replace(' ', '-')
                # Check direct match, downcased match, or slugified match
                if val_normalized not in tag_labels and \
                   val_normalized.lower() not in tag_labels and \
                   val_slugified not in tag_labels:
                    missing_labels.append(val)

    # 2. Audit Language Blocks
    # Count occurrences of {: .lang-en} and {: .lang-zh}
    en_count = len(re.findall(r'\{\: \.lang-en', body))
    zh_count = len(re.findall(r'\{\: \.lang-zh', body))

    # 3. Audit Bibliography
    # Check if bibliography exists
    has_bib = "Bibliography" in body or "参考文献" in body
    bib_IAL_issues = False
    if has_bib:
        # Check if list items in bibliography have IALs (which we now know should NOT have lang-en/zh simultaneously)
        bib_match = re.search(r'## (Bibliography|参考文献).*?(\n1\..*)', body, re.DOTALL)
        if bib_match:
            bib_text = bib_match.group(2)
            # Find list items
            items = re.findall(r'^\d+\\?\.\s.*', bib_text, re.MULTILINE)
            # Check if items are followed by {: .lang-en .lang-zh} (which is the error we fixed)
            if "{: .lang-en .lang-zh}" in bib_text:
                bib_IAL_issues = True

    # 4. Audit Untagged Paragraphs
    # Look for paragraphs (lines starting with alpha/chinese) that are NOT followed by an IAL
    # This is a heuristic.
    lines = body.split('\n')
    untagged_blocks = []
    for i, line in enumerate(lines):
        clean_line = line.strip()
        if not clean_line: continue
        if clean_line.startswith(('---', '##', '![', '```', '>', '*', '-', '1.')): continue # Skip special blocks for now
        
        # If it's a paragraph, the next non-empty line should be an IAL
        next_line = ""
        for j in range(i + 1, len(lines)):
            if lines[j].strip():
                next_line = lines[j].strip()
                break
        
        if next_line and not next_line.startswith('{: .lang-'):
            # Potentially untagged
            untagged_blocks.append(clean_line[:50])

    return {
        "title": fm.get('title', 'Untitled'),
        "missing_labels": missing_labels,
        "en_blocks": en_count,
        "zh_blocks": zh_count,
        "has_bib": has_bib,
        "bib_issues": bib_IAL_issues,
        "potential_untagged": untagged_blocks[:3] # Just first 3
    }

def main():
    tag_labels = load_tag_labels()
    posts = [f for f in os.listdir(POSTS_DIR) if f.endswith('.md')]
    posts.sort(reverse=True)

    print(f"{'Filename':<50} | {'EN':<3} | {'ZH':<3} | {'Untagged?':<10} | {'Bib?':<4} | {'Missing Tags'}")
    print("-" * 110)

    for post in posts:
        res = audit_post(os.path.join(POSTS_DIR, post), tag_labels)
        untagged_status = "YES" if res.get('potential_untagged') else "NO"
        if res.get('en_blocks', 0) == 0 and res.get('zh_blocks', 0) == 0:
            untagged_status = "CRITICAL"
        
        bib_status = "ERR" if res.get('bib_issues') else "OK"
        if not res.get('has_bib', True): bib_status = "N/A"
        
        missing = ", ".join(res.get('missing_labels', []))
        print(f"{post:<50} | {res.get('en_blocks', 0):<3} | {res.get('zh_blocks', 0):<3} | {untagged_status:<10} | {bib_status:<4} | {missing}")

if __name__ == "__main__":
    main()
