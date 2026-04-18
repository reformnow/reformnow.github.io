import os
import re

posts_dir = '_posts'

def fix_content(content):
    # Standardize the EN tags: remove any blank lines above it (replace with exactly one newline)
    # and replace tag with precisely {: .lang-en lang="en"}
    content = re.sub(
        r'[ \t]*\n*[ \t]*\n[ \t]*\{:\s*\.?lang-en[^}]*\}',
        '\n{: .lang-en lang="en"}',
        content
    )
    
    # Standardize the ZH tags in the same way
    content = re.sub(
        r'[ \t]*\n*[ \t]*\n[ \t]*\{:\s*\.?lang-zh[^}]*\}',
        '\n{: .lang-zh lang="zh-CN"}',
        content
    )
    
    # Ensure exactly ONE empty line after the tags (which means \n\n)
    content = re.sub(
        r'\{: \.lang-en lang="en"\}\n+',
        '{: .lang-en lang="en"}\n\n',
        content
    )
    
    content = re.sub(
        r'\{: \.lang-zh lang="zh-CN"\}\n+',
        '{: .lang-zh lang="zh-CN"}\n\n',
        content
    )
    
    # Re-normalize end of file
    content = content.strip() + '\n'
    
    # One more thing: ensure horizontal rules `---` block breaks have proper spacing
    # Not strictly required to modify here, but good hygiene
    
    return content

def main():
    changed_files = 0
    for filename in os.listdir(posts_dir):
        if not filename.endswith('.md'):
            continue
        
        filepath = os.path.join(posts_dir, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            original = f.read()
        
        fixed = fix_content(original)
        
        if fixed != original:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(fixed)
            print(f"Fixed formatting in {filename}")
            changed_files += 1

    print(f"Total files fixed: {changed_files}")

if __name__ == '__main__':
    main()
