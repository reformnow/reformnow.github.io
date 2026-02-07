# Manual Image Download Instructions

Since automated downloads aren't working, here are **step-by-step manual instructions**.

## 🎯 **Quick Method (5 images in 10 minutes)**

### Step 1: Open Wikimedia Commons
Go to: https://commons.wikimedia.org

### Step 2: Search for Each Image

**Copy-paste these searches one at a time:**

#### 1. Pentecost
```
Search: "Pentecost Titian"
Look for: Painting of Pentecost with tongues of fire
Download: Click "Original file" → Right click → Save as → `pentecost.jpg`
Direct link (try): https://commons.wikimedia.org/wiki/File:Tizian_005.jpg
```

#### 2. Council of Nicaea
```
Search: "Council of Nicaea painting"
Look for: Historical council scene
Download: Click "Original file" → Save as → `council-nicaea.jpg`
Direct link: https://commons.wikimedia.org/wiki/File:First_Council_of_Nicea.jpg
```

#### 3. Augustine
```
Search: "Augustine Philippe de Champaigne"
Look for: Portrait of Saint Augustine
Download: Click "Original file" → Save as → `augustine-death.jpg`
Direct link: https://commons.wikimedia.org/wiki/File:Saint_Augustine_by_Philippe_de_Champaigne.jpg
```

#### 4. Martin Luther
```
Search: "Martin Luther Cranach"
Look for: Portrait by Lucas Cranach
Download: Click "Original file" → Save as → `luther-95-theses.jpg`
Direct link: https://commons.wikimedia.org/wiki/File:Martin_Luther_by_Lucas_Cranach_the_Elder.jpg
```

#### 5. John Calvin
```
Search: "John Calvin Holbein"
Look for: Portrait by Hans Holbein
Download: Click "Original file" → Save as → `calvin-institutes.jpg`
Direct link: https://commons.wikimedia.org/wiki/File:John_Calvin_by_Hans_Holbein_the_Younger.jpg
```

## 📋 **Complete List of 25 Images**

### Essential (Download First)
1. `pentecost.jpg` - Search "Pentecost painting"
2. `council-nicaea.jpg` - Search "Council of Nicaea"
3. `augustine-death.jpg` - Search "Augustine portrait"
4. `luther-95-theses.jpg` - Search "Luther Cranach"
5. `calvin-institutes.jpg` - Search "Calvin Holbein"
6. `synod-dort.jpg` - Search "Synod of Dort"
7. `westminster-assembly.jpg` - Search "Westminster Assembly"
8. `great-awakening.jpg` - Search "George Whitefield"
9. `william-carey.jpg` - Search "William Carey"
10. `council-trent.jpg` - Search "Council of Trent"

### Important Councils (Next Priority)
11. `council-constantinople.jpg` - Search "Council of Constantinople 381"
12. `council-ephesus.jpg` - Search "Council of Ephesus"
13. `council-chalcedon.jpg` - Search "Council of Chalcedon"
14. `council-nicaea-2.jpg` - Search "Second Council of Nicaea"
15. `council-orange.jpg` - Search "Council of Orange"

### Other Events
16. `great-schism.jpg` - Search "Great Schism 1054"
17. `wycliffe-hus.jpg` - Search "John Wycliffe"
18. `zwingli-zurich.jpg` - Search "Ulrich Zwingli"
19. `diet-of-worms.jpg` - Search "Diet of Worms"
20. `english-reformation.jpg` - Search "Henry VIII"
21. `scottish-reformation.jpg` - Search "John Knox"
22. `heidelberg-catechism.jpg` - Search "Heidelberg Catechism"
23. `belgic-confession.jpg` - Search "Belgic Confession"
24. `arminius.jpg` - Search "Jacobus Arminius"
25. `canons-dort.jpg` - Use same as synod-dort

## 💡 **Pro Tips**

### Finding the Download Button:
1. Go to Wikimedia Commons page
2. Look for **"Original file"** link below image
3. OR: Look for **"Download"** button
4. Click it to see full-size image
5. Right-click → "Save image as"

### Correct File Size:
After downloading, resize to **800x400 pixels**:
- Online tool: https://www.iloveimg.com/resize-image
- Upload image
- Set width: 800px
- Crop to height: 400px (maintain aspect ratio)
- Download

### Where to Save:
```
Your project/
└── assets/
    └── img/
        └── timeline/
            ├── pentecost.jpg
            ├── council-nicaea.jpg
            └── ...
```

## 🎨 **What to Look For**

**Good Images:**
- Classical religious paintings
- Historical portraits
- Council depictions
- Clear, recognizable subjects

**Avoid:**
- Modern photographs
- Watermarked images
- Low resolution
- Copyrighted material

## ✅ **Verification**

After downloading, verify:
- [ ] File is JPG format
- [ ] Size is around 800x400 pixels
- [ ] File size is under 200KB
- [ ] Image is clear and recognizable
- [ ] Filename matches exactly

## 🆘 **If Downloads Don't Work**

**Option 1:** Try the direct links in `QUICK_DOWNLOAD.md`  
**Option 2:** Skip images - timeline works without them!  
**Option 3:** Use placeholder generator: `./generate-placeholders.sh`

## 🚀 **Quick Test**

Download just **ONE** image to test:
1. Go to: https://commons.wikimedia.org/wiki/File:Martin_Luther_by_Lucas_Cranach_the_Elder.jpg
2. Click "Original file"
3. Save as: `luther-95-theses.jpg`
4. Resize to 800x400
5. Move to: `assets/img/timeline/`
6. Check your site - image should appear!

## 📞 **Need Help?**

If a specific image won't download:
1. Try different search terms
2. Look for alternative paintings of same event
3. Check that it's marked "Public Domain"
4. Try the next image instead

**Remember:** Timeline works perfectly without images! Don't stress about getting them all.