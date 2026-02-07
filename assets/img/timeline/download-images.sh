#!/bin/bash
# Download timeline images from Wikimedia Commons
# This script downloads public domain images for timeline events

echo "Timeline Image Downloader"
echo "=========================="
echo ""

# Create download directory
mkdir -p downloads
cd downloads

# Function to download and process image
download_image() {
    local url=$1
    local filename=$2
    local description=$3
    
    echo "Downloading: $description"
    
    # Download using curl
    if curl -s -o "temp_$filename" "$url"; then
        # Check if file exists and has content
        if [ -s "temp_$filename" ]; then
            # Convert to proper size
            convert "temp_$filename" -resize 800x400^ -gravity center -extent 800x400 -quality 85 "../$filename"
            echo "  ✓ $filename created"
            rm "temp_$filename"
        else
            echo "  ✗ Failed to download: $filename"
            rm -f "temp_$filename"
        fi
    else
        echo "  ✗ Download error: $filename"
    fi
}

echo "Attempting to download public domain images..."
echo ""

# Wikimedia Commons URLs (these are example URLs - actual URLs need to be found)
# You need to manually find and add URLs from Wikimedia Commons

echo "TOP PRIORITY IMAGES:"
echo "===================="
echo ""

# Example downloads (you need to find actual URLs from Wikimedia Commons)
echo "1. Martin Luther - 95 Theses"
echo "   Search: https://commons.wikimedia.org/wiki/File:Luther_95_Thesen.jpg"
echo "   Download manually and save as: luther-95-theses.jpg"
echo ""

echo "2. Council of Nicaea"
echo "   Search: https://commons.wikimedia.org/wiki/Category:Council_of_Nicaea"
echo "   Download manually and save as: council-nicaea.jpg"
echo ""

echo "3. John Calvin"
echo "   Search: https://commons.wikimedia.org/wiki/File:Calvin_-_portrait.jpg"
echo "   Download manually and save as: calvin-institutes.jpg"
echo ""

echo "4. Augustine of Hippo"
echo "   Search: https://commons.wikimedia.org/wiki/File:Saint_Augustine_Portrait.jpg"
echo "   Download manually and save as: augustine-death.jpg"
echo ""

echo "INSTRUCTIONS:"
echo "============="
echo ""
echo "1. Go to https://commons.wikimedia.org"
echo "2. Search for the event/person"
echo "3. Find a suitable image (preferably painting or artwork)"
echo "4. Check license (should say 'Public Domain' or 'CC0')"
echo "5. Click 'Download' and select size (minimum 800px width)"
echo "6. Rename to match timeline event name"
echo "7. Move to: /assets/img/timeline/"
echo ""

cd ..

# Create a helper script for manual downloads
cat > manual-download-list.txt << 'EOF'
PRIORITY 1 - Essential Images:
==============================
1. pentecost.jpg
   Wikimedia: Search "Pentecost painting"
   Example: https://commons.wikimedia.org/wiki/File:Pentecost_Rubens.jpg

2. luther-95-theses.jpg
   Wikimedia: Search "Luther 95 theses"
   Example: https://commons.wikimedia.org/wiki/File:Luther_95_Thesen.jpg

3. calvin-institutes.jpg
   Wikimedia: Search "John Calvin portrait"
   Example: https://commons.wikimedia.org/wiki/File:Calvin.jpg

4. council-nicaea.jpg
   Wikimedia: Search "Council of Nicaea"
   Example: https://commons.wikimedia.org/wiki/File:First_Council_of_Nicaea.jpg

5. augustine-death.jpg
   Wikimedia: Search "Augustine Hippo"
   Example: https://commons.wikimedia.org/wiki/File:Saint_Augustine.jpg

6. synod-dort.jpg
   Wikimedia: Search "Synod of Dort"
   Example: https://commons.wikimedia.org/wiki/File:Synod_of_Dort.jpg

PRIORITY 2 - Major Councils:
============================
7. council-chalcedon.jpg
8. council-constantinople.jpg
9. council-ephesus.jpg
10. council-trent.jpg

PRIORITY 3 - Heresies:
======================
11. pelagianism.jpg (can copy from ../posts/augustine_pelagius_header.png)
12. semi-pelagianism.jpg
13. arminius.jpg

PRIORITY 4 - Events:
====================
14. fall-of-rome.jpg
15. great-schism.jpg
16. marburg-colloquy.jpg
17. scottish-reformation.jpg
18. diet-of-worms.jpg
19. westminster-assembly.jpg

REMAINING:
==========
20. council-jerusalem.jpg
21. gnosticism.jpg
22. marcion.jpg
23. council-constantinople-2.jpg
24. council-constantinople-3.jpg
25. council-nicaea-2.jpg
26. filioque.jpg
27. scholasticism.jpg
28. wycliffe-hus.jpg
29. luther-treatises.jpg
30. zwingli-zurich.jpg
31. zwingli-death.jpg
32. calvin-geneva.jpg
33. english-reformation.jpg
34. elizabethan-settlement.jpg
35. heidelberg-catechism.jpg
36. belgic-confession.jpg
37. geneva-bible.jpg
38. remonstrance.jpg
39. canons-dort.jpg
40. westminster-confession.jpg

PROCESSING:
===========
After downloading, resize images:
  - Width: 800 pixels
  - Height: 400 pixels (2:1 ratio)
  - Quality: 85%
  - Format: JPG

TOOLS:
======
Online: https://tinypng.com (for compression)
Online: https://www.iloveimg.com/resize-image (for resizing)
Desktop: ImageMagick
  convert input.jpg -resize 800x400^ -gravity center -extent 800x400 -quality 85 output.jpg
EOF

echo ""
echo "Created: manual-download-list.txt"
echo ""
echo "This file contains search terms and instructions for manually"
echo "downloading images from Wikimedia Commons."
echo ""
echo "QUICK START:"
echo "==========="
echo ""
echo "Option 1: Use existing images"
echo "  cp ../posts/augustine_pelagius_header.png ./pelagianism.jpg"
echo ""
echo "Option 2: Create placeholders"
echo "  ../generate-placeholders.sh"
echo ""
echo "Option 3: Download from Wikimedia Commons"
echo "  See manual-download-list.txt for instructions"