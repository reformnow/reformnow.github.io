import re
import sys

def audit_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    errors = []
    current_block = []
    last_tag = None
    
    in_frontmatter = False
    in_codeblock = False
    
    for i, line in enumerate(lines):
        stripped = line.strip()
        
        # Frontmatter
        if i == 0 and stripped == '---':
            in_frontmatter = True
            continue
        if in_frontmatter and stripped == '---':
            in_frontmatter = False
            continue
        if in_frontmatter:
            continue
            
        # Code blocks
        if stripped.startswith('```'):
            in_codeblock = not in_codeblock
            current_block.append(line)
            continue
            
        if in_codeblock:
            current_block.append(line)
            continue
            
        # Empty lines
        if not stripped:
            continue
            
        # IAL tags
        if stripped.startswith('{: .lang-'):
            if not current_block:
                errors.append(f"Line {i+1}: Tag '{stripped}' found without preceding content.")
            
            # Check if tag matches content (rough check)
            content = "".join(current_block)
            is_zh_tag = 'lang-zh' in stripped
            is_en_tag = 'lang-en' in stripped
            
            has_chinese = any('\u4e00' <= char <= '\u9fff' for char in content)
            
            if is_zh_tag and not has_chinese:
                # Might be a quote or title that's not translated yet, but usually an error
                # However, bib refs or bible refs might not have chinese if they are en versions
                pass 
            
            if is_en_tag and has_chinese:
                # Almost certainly an error if English tag has Chinese characters
                # Exclude things like (חָזַק)
                clean_content = re.sub(r'[\u0590-\u05FF]+', '', content) # Remove Hebrew
                if any('\u4e00' <= char <= '\u9fff' for char in clean_content):
                    errors.append(f"Line {i+1}: English tag follows content containing Chinese characters.")
            
            current_block = []
            last_tag = stripped
            continue
            
        # Regular content
        if stripped.startswith('---'): # Separator
            continue
            
        current_block.append(line)

    if current_block:
        errors.append(f"End of file: Content remains without a following IAL tag.")

    return errors

if __name__ == "__main__":
    file_to_check = sys.argv[1]
    errs = audit_file(file_to_check)
    if errs:
        print("\n".join(errs))
    else:
        print("No obvious bilingual tagging errors found.")
