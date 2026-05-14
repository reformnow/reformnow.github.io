import xml.etree.ElementTree as ET
import re
import sys
import os

BIBLE_XML = os.path.join(os.path.dirname(__file__), '../bibles/SF_2004-10-17_CHI_CHIUS_(CHINESE UNION VERSION SIMPLIFIED).xml')
NASB_TXT = os.path.join(os.path.dirname(__file__), '../bibles/nasb_text.txt')

# Mapping of book names to numbers (bnumber in XML)
BOOK_MAP = {
    "Genesis": 1, "Exodus": 2, "Leviticus": 3, "Numbers": 4, "Deuteronomy": 5,
    "Joshua": 6, "Judges": 7, "Ruth": 8, "1 Samuel": 9, "2 Samuel": 10,
    "1 Kings": 11, "2 Kings": 12, "1 Chronicles": 13, "2 Chronicles": 14,
    "Ezra": 15, "Nehemiah": 16, "Esther": 17, "Job": 18, "Psalms": 19,
    "Proverbs": 20, "Ecclesiastes": 21, "Song of Solomon": 22, "Isaiah": 23,
    "Jeremiah": 24, "Lamentations": 25, "Ezekiel": 26, "Daniel": 27,
    "Hosea": 28, "Joel": 29, "Amos": 30, "Obadiah": 31, "Jonah": 32,
    "Micah": 33, "Nahum": 34, "Habakkuk": 35, "Zephaniah": 36, "Haggai": 37,
    "Zechariah": 38, "Malachi": 39, "Matthew": 40, "Mark": 41, "Luke": 42,
    "John": 43, "Acts": 44, "Romans": 45, "1 Corinthians": 46, "2 Corinthians": 47,
    "Galatians": 48, "Ephesians": 49, "Philippians": 50, "Colossians": 51,
    "1 Thessalonians": 52, "2 Thessalonians": 53, "1 Timothy": 54, "2 Timothy": 55,
    "Titus": 56, "Philemon": 57, "Hebrews": 58, "James": 59, "1 Peter": 60,
    "2 Peter": 61, "1 John": 62, "2 John": 63, "3 John": 64, "Jude": 65, "Revelation": 66
}

# Simplified Chinese names mapping
ZH_BOOK_MAP = {
    "创世记": "Genesis", "出埃及记": "Exodus", "利未记": "Leviticus", "民数记": "Numbers", "申命记": "Deuteronomy",
    "约书亚记": "Joshua", "士师记": "Judges", "路得记": "Ruth", "撒母耳记上": "1 Samuel", "撒母耳记下": "2 Samuel",
    "列王纪上": "1 Kings", "列王纪下": "2 Kings", "历代志上": "1 Chronicles", "历代志下": "2 Chronicles",
    "以斯拉记": "Ezra", "尼希米记": "Nehemiah", "以斯帖记": "Esther", "约伯记": "Job", "诗篇": "Psalms",
    "箴言": "Proverbs", "传道书": "Ecclesiastes", "雅歌": "Song of Solomon", "以赛亚书": "Isaiah",
    "耶利米书": "Jeremiah", "耶利米哀歌": "Lamentations", "以西结书": "Ezekiel", "但以理书": "Daniel",
    "何西阿书": "Hosea", "约珥书": "Joel", "阿摩司书": "Amos", "俄巴底亚书": "Obadiah", "约拿书": "Jonah",
    "弥迦书": "Micah", "那鸿书": "Nahum", "哈巴谷书": "Habakkuk", "西番雅书": "Zephaniah", "哈该书": "Haggai",
    "撒迦利亚书": "Zechariah", "玛拉基书": "Malachi", "马太福音": "Matthew", "马可福音": "Mark", "路加福音": "Luke",
    "约翰福音": "John", "使徒行传": "Acts", "罗马书": "Romans", "哥林多前书": "1 Corinthians", "哥林多后书": "2 Corinthians",
    "加拉太书": "Galatians", "以弗所书": "Ephesians", "腓立比书": "Philippians", "歌罗西书": "Colossians",
    "帖撒罗尼迦前书": "1 Thessalonians", "帖撒罗尼迦后书": "2 Thessalonians", "提摩太前书": "1 Timothy", "提摩太后书": "2 Timothy",
    "提多书": "Titus", "腓利门书": "Philemon", "希伯来书": "Hebrews", "雅各书": "James", "彼得前书": "1 Peter",
    "彼得后书": "2 Peter", "约翰一书": "1 John", "约翰二书": "2 John", "约翰三书": "3 John", "犹大书": "Jude", "启示录": "Revelation"
}

def clean_text(text):
    if not text: return ""
    # Remove spaces between characters if it's mostly Chinese
    text = re.sub(r'(\s)(?=[^a-zA-Z0-9])', '', text)
    text = re.sub(r'([^a-zA-Z0-9])(\s)', r'\1', text)
    return text.strip()

def get_verse(book_name, chapter, verse_range):
    if book_name in ZH_BOOK_MAP:
        book_name = ZH_BOOK_MAP[book_name]
    
    bnumber = BOOK_MAP.get(book_name)
    if not bnumber:
        return f"Error: Book '{book_name}' not found."

    tree = ET.parse(BIBLE_XML)
    root = tree.getroot()
    
    book_node = root.find(f".//BIBLEBOOK[@bnumber='{bnumber}']")
    if book_node is None:
        return f"Error: Book '{book_name}' (num {bnumber}) not found in XML."
    
    chapter_node = book_node.find(f"./CHAPTER[@cnumber='{chapter}']")
    if chapter_node is None:
        return f"Error: Chapter {chapter} not found in {book_name}."
    
    verses = []
    # Parse range like 21-22
    if '-' in verse_range:
        start, end = map(int, verse_range.split('-'))
        v_list = range(start, end + 1)
    else:
        v_list = [int(verse_range)]
        
    for vnum in v_list:
        v_node = chapter_node.find(f"./VERS[@vnumber='{vnum}']")
        if v_node is not None:
            text = clean_text(v_node.text)
            verses.append(text)
        else:
            verses.append(f"[Verse {vnum} not found]")
            
    return "".join(verses)

def get_verse_nasb(book_name, chapter, verse_range):
    # Basic grep-like search in the text file
    if not os.path.exists(NASB_TXT):
        return "Error: NASB text file not found."
    
    with open(NASB_TXT, 'r') as f:
        lines = f.readlines()
    
    start_v = int(verse_range.split('-')[0]) if '-' in verse_range else int(verse_range)
    end_v = int(verse_range.split('-')[1]) if '-' in verse_range else int(verse_range)
    
    results = []
    pattern = rf"^{book_name}\s+{chapter}:(\d+)"
    
    for line in lines:
        match = re.match(pattern, line)
        if match:
            vnum = int(match.group(1))
            if start_v <= vnum <= end_v:
                # Remove the reference prefix
                text = re.sub(rf"^{book_name}\s+{chapter}:{vnum}\s*", "", line)
                results.append(text.strip())
    
    return " ".join(results)

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: python3 bible_tool.py <Book> <Chapter> <VerseRange> [NASB]")
        sys.exit(1)
    
    if len(sys.argv) > 4 and sys.argv[4].upper() == "NASB":
        print(get_verse_nasb(sys.argv[1], sys.argv[2], sys.argv[3]))
    else:
        print(get_verse(sys.argv[1], sys.argv[2], sys.argv[3]))
