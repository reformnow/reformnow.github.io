import re

file_path = "assets/js/presentation-mode.js"
with open(file_path, "r") as f:
    content = f.read()

replacements = [
    (r"let postTitle = h1\?\.textContent \|\| document\.title\.split\(' \| '\)\[0\];", "let postTitle = h1 ? h1.textContent : document.title.split(' | ')[0];"),
    (r"const enTitle = h1\.querySelector\('\.lang-en'\)\?\.innerText \|\| h1\.querySelector\('\.lang-en'\)\?\.textContent \|\| '';", "const langEn = h1.querySelector('.lang-en'); const enTitle = langEn ? (langEn.innerText || langEn.textContent) : '';"),
    (r"const zhTitle = h1\.querySelector\('\.lang-zh'\)\?\.innerText \|\| h1\.querySelector\('\.lang-zh'\)\?\.textContent \|\| '';", "const langZh = h1.querySelector('.lang-zh'); const zhTitle = langZh ? (langZh.innerText || langZh.textContent) : '';"),
    (r"postTitle = h1\?\.innerText \|\| postTitle;", "postTitle = h1 ? h1.innerText : postTitle;"),
    (r"let postDesc = document\.querySelector\('meta\[name=\"description\"\]'\)\?\.content \|\| '';", "const metaDesc = document.querySelector('meta[name=\"description\"]'); let postDesc = metaDesc ? metaDesc.content : '';"),
    (r"const enDesc = descEl\.querySelector\('\.lang-en'\)\?\.innerText \|\| descEl\.querySelector\('\.lang-en'\)\?\.textContent \|\| '';", "const descEn = descEl.querySelector('.lang-en'); const enDesc = descEn ? (descEn.innerText || descEn.textContent) : '';"),
    (r"const zhDesc = descEl\.querySelector\('\.lang-zh'\)\?\.innerText \|\| descEl\.querySelector\('\.lang-zh'\)\?\.textContent \|\| '';", "const descZh = descEl.querySelector('.lang-zh'); const zhDesc = descZh ? (descZh.innerText || descZh.textContent) : '';"),
    (r"const featuredImage = document\.querySelector\('\.preview-img img'\)\?\.src \|\| document\.querySelector\('img\[src\*=\"/posts/\"\]'\)\?\.src \|\| document\.querySelector\('\.content img'\)\?\.src \|\| '';", "let featuredImage = ''; if (document.querySelector('.preview-img img')) featuredImage = document.querySelector('.preview-img img').src; else if (document.querySelector('img[src*=\"/posts/\"]')) featuredImage = document.querySelector('img[src*=\"/posts/\"]').src; else if (document.querySelector('.content img')) featuredImage = document.querySelector('.content img').src;"),
    (r"const date = content\.querySelector\('\.timeline-date'\)\?\.textContent;", "const dateNode = content.querySelector('.timeline-date'); const date = dateNode ? dateNode.textContent : null;"),
    (r"const cat = content\.querySelector\('\.timeline-category'\)\?\.textContent;", "const catNode = content.querySelector('.timeline-category'); const cat = catNode ? catNode.textContent : null;"),
    (r"const enT = content\.querySelector\('\.timeline-title \.lang-en'\)\?\.cloneNode\(true\);", "const tempEnT = content.querySelector('.timeline-title .lang-en'); const enT = tempEnT ? tempEnT.cloneNode(true) : null;"),
    (r"const enD = content\.querySelector\('\.timeline-description \.lang-en'\)\?\.cloneNode\(true\);", "const tempEnD = content.querySelector('.timeline-description .lang-en'); const enD = tempEnD ? tempEnD.cloneNode(true) : null;"),
    (r"const zhT = content\.querySelector\('\.timeline-title \.lang-zh'\)\?\.cloneNode\(true\);", "const tempZhT = content.querySelector('.timeline-title .lang-zh'); const zhT = tempZhT ? tempZhT.cloneNode(true) : null;"),
    (r"const zhD = content\.querySelector\('\.timeline-description \.lang-zh'\)\?\.cloneNode\(true\);", "const tempZhD = content.querySelector('.timeline-description .lang-zh'); const zhD = tempZhD ? tempZhD.cloneNode(true) : null;"),
    (r"const title = content\.querySelector\(`\.timeline-title \.lang-\$\{lang\}`\)\?\.cloneNode\(true\);", "const tempT = content.querySelector(`.timeline-title .lang-${lang}`); const title = tempT ? tempT.cloneNode(true) : null;"),
    (r"const desc = content\.querySelector\(`\.timeline-description \.lang-\$\{lang\}`\)\?\.cloneNode\(true\);", "const tempD = content.querySelector(`.timeline-description .lang-${lang}`); const desc = tempD ? tempD.cloneNode(true) : null;"),
    (r"if \(el\.href\?\.includes\('reveal'\) \|\| el\.src\?\.includes\('reveal'\) \|\| el\.innerHTML\?\.includes\('reveal'\)\) \{", "if ((el.href && el.href.includes('reveal')) || (el.src && el.src.includes('reveal')) || (el.innerHTML && el.innerHTML.includes('reveal'))) {")
]

for old, new_s in replacements:
    content = re.sub(old, new_s, content)

with open(file_path, "w") as f:
    f.write(content)
print("Replaced all optional chaining syntax!")
