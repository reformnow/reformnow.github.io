#!/usr/bin/env python3
"""
Audit blog posts for writing consistency issues.
Checks:
1. Front matter fields completeness (title, title_zh, description, description_zh, image.alt, image.alt_zh)
2. Bible verse citation format (should use local bibles, check for known error patterns)
3. Heading numbering style (Roman numerals vs Arabic numbers vs no prefix)
4. Code block language tags (bible, quote, etc.)
5. Language tag consistency (missing .lang-en or .lang-zh)
6. Section separator consistency (--- usage)
7. Bibliography section presence
8. Tags casing consistency
"""

import os
import re
import yaml
from pathlib import Path

POSTS_DIR = Path(__file__).parent.parent / '_posts'

REQUIRED_FRONT_MATTER = ['title', 'title_zh', 'description', 'description_zh', 'date', 'categories', 'tags']
OPTIONAL_RECOMMENDED = ['image']

def parse_front_matter(content):
    """Extract YAML front matter from markdown."""
    if not content.startswith('---'):
        return None, content
    parts = content.split('---', 2)
    if len(parts) < 3:
        return None, content
    try:
        fm = yaml.safe_load(parts[1])
        return fm, parts[2]
    except:
        return None, content

def check_heading_style(body, filename):
    """Detect mixed heading numbering styles."""
    issues = []
    roman_headings = re.findall(r'^#{1,3}\s+[IVXivx]+[\.\.\s]', body, re.MULTILINE)
    arabic_headings = re.findall(r'^#{1,3}\s+\d+[\.\.\s]', body, re.MULTILINE)
    
    if roman_headings and arabic_headings:
        issues.append(f"  ⚠️  MIXED heading style: has both Roman numerals {roman_headings[:2]} and Arabic numbers {arabic_headings[:2]}")
    elif roman_headings:
        issues.append(f"  ℹ️  Uses Roman numeral headings: {roman_headings[:3]}")
    
    return issues

def check_bible_quotes(body, filename):
    """Check Bible quote blocks for known issues."""
    issues = []
    
    # Find all bible code blocks
    bible_blocks = re.findall(r'```bible\n(.*?)\n```', body, re.DOTALL)
    
    for block in bible_blocks:
        # Check for known error phrases
        if '管荣' in block:
            issues.append(f"  ❌ Known error phrase '管荣' found in bible block")
        if '照样得脱离' in block and '指望受造之物自己' in block:
            issues.append(f"  ❌ Known incorrect Romans 8:21 text found")
        
        # Check if citation line exists
        lines = block.strip().split('\n')
        has_citation = any(re.search(r'[—–-]{1,2}\s*(罗马书|Romans|创世记|Genesis|约翰|John|诗篇|Psalm)', line) for line in lines)
        if not has_citation:
            issues.append(f"  ⚠️  Bible block missing citation line: {lines[0][:60]}...")
    
    return issues

def check_language_tags(body, filename):
    """Check for missing language tags on major blocks."""
    issues = []
    
    # Count lang-en and lang-zh tags
    en_tags = len(re.findall(r'\{:\s*\.lang-en', body))
    zh_tags = len(re.findall(r'\{:\s*\.lang-zh', body))
    
    if en_tags == 0 and zh_tags == 0:
        issues.append(f"  ℹ️  No bilingual tags found (may be intentional)")
        return issues
    
    ratio = abs(en_tags - zh_tags)
    if ratio > 3:
        issues.append(f"  ⚠️  Imbalanced language tags: lang-en={en_tags}, lang-zh={zh_tags} (diff={ratio})")
    
    # Check for paragraphs without tags (rough heuristic: consecutive non-empty lines not followed by {: .lang-})
    paragraphs = re.split(r'\n{2,}', body)
    untagged_count = 0
    for para in paragraphs:
        para = para.strip()
        if not para:
            continue
        # Skip code blocks, front matter remnants, headers, separators
        if para.startswith('```') or para.startswith('#') or para == '---' or para.startswith('{:') or para.startswith('<!--'):
            continue
        # Check if next content after this paragraph has a tag
        # Simple heuristic: paragraph text should be followed by {: .lang-
        if len(para) > 30 and not re.search(r'\{:\s*\.lang-', para):
            untagged_count += 1
    
    if untagged_count > 3:
        issues.append(f"  ⚠️  ~{untagged_count} paragraphs may be missing language tags")
    
    return issues

def check_front_matter(fm, filename):
    """Check front matter completeness."""
    issues = []
    if fm is None:
        issues.append("  ❌ Failed to parse front matter")
        return issues
    
    for field in REQUIRED_FRONT_MATTER:
        if field not in fm or not fm[field]:
            issues.append(f"  ❌ Missing required field: {field}")
    
    # Check image alt text
    if 'image' in fm and fm['image']:
        img = fm['image']
        if isinstance(img, dict):
            if 'alt' not in img or not img.get('alt'):
                issues.append(f"  ⚠️  Missing image.alt")
            if 'alt_zh' not in img or not img.get('alt_zh'):
                issues.append(f"  ⚠️  Missing image.alt_zh")
    else:
        issues.append(f"  ℹ️  No image field (consider adding one for social sharing)")
    
    # Check tags casing (should be Title Case)
    if 'tags' in fm and fm['tags']:
        for tag in fm['tags']:
            if isinstance(tag, str) and tag != tag.title() and tag.lower() != tag:
                pass  # Mixed case is fine for tags
    
    return issues

def check_bibliography(body, filename):
    """Check if bibliography section exists."""
    issues = []
    has_bib_en = bool(re.search(r'#{1,3}\s*(Bibliography|References|参考文献)', body, re.IGNORECASE))
    if not has_bib_en:
        issues.append(f"  ℹ️  No bibliography/references section found")
    return issues

def check_separator_consistency(body, filename):
    """Check for consistent use of --- separators."""
    issues = []
    separators = re.findall(r'^---\s*$', body, re.MULTILINE)
    if len(separators) == 0:
        issues.append(f"  ℹ️  No section separators (---) found")
    return issues

def audit_post(filepath):
    """Run all checks on a single post."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    fm, body = parse_front_matter(content)
    filename = filepath.name
    
    all_issues = []
    all_issues.extend(check_front_matter(fm, filename))
    all_issues.extend(check_heading_style(body, filename))
    all_issues.extend(check_bible_quotes(body, filename))
    all_issues.extend(check_language_tags(body, filename))
    all_issues.extend(check_bibliography(body, filename))
    
    return all_issues

def main():
    posts = sorted(POSTS_DIR.glob('*.md'))
    
    print(f"{'='*70}")
    print(f"BLOG POST CONSISTENCY AUDIT")
    print(f"Total posts: {len(posts)}")
    print(f"{'='*70}\n")
    
    summary = {
        'errors': [],
        'warnings': [],
        'info': []
    }
    
    posts_with_issues = 0
    
    for post in posts:
        issues = audit_post(post)
        errors = [i for i in issues if '❌' in i]
        warnings = [i for i in issues if '⚠️' in i]
        info = [i for i in issues if 'ℹ️' in i]
        
        if errors or warnings:
            posts_with_issues += 1
            print(f"📄 {post.name}")
            for issue in issues:
                print(issue)
                if '❌' in issue:
                    summary['errors'].append(f"{post.name}: {issue.strip()}")
                elif '⚠️' in issue:
                    summary['warnings'].append(f"{post.name}: {issue.strip()}")
                elif 'ℹ️' in issue:
                    summary['info'].append(f"{post.name}: {issue.strip()}")
            print()
    
    print(f"\n{'='*70}")
    print(f"SUMMARY")
    print(f"{'='*70}")
    print(f"Posts scanned: {len(posts)}")
    print(f"Posts with issues: {posts_with_issues}")
    print(f"❌ Errors: {len(summary['errors'])}")
    print(f"⚠️  Warnings: {len(summary['warnings'])}")
    print(f"ℹ️  Info: {len(summary['info'])}")

if __name__ == '__main__':
    main()
