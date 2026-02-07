#!/bin/bash
# Generate placeholder images for timeline events
# This script creates text-based placeholder images using ImageMagick

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "ImageMagick not found. Installing..."
    # For macOS
    if command -v brew &> /dev/null; then
        brew install imagemagick
    else
        echo "Please install ImageMagick manually:"
        echo "  macOS: brew install imagemagick"
        echo "  Ubuntu: sudo apt-get install imagemagick"
        exit 1
    fi
fi

# List of events that need images
declare -A events=(
    ["pentecost"]="Pentecost|33 AD"
    ["council-jerusalem"]="Council of Jerusalem|48-50 AD"
    ["gnosticism"]="Gnosticism|c. 100-200 AD"
    ["marcion"]="Marcion's Heresy|c. 144 AD"
    ["council-nicaea"]="First Council of Nicaea|325 AD"
    ["council-constantinople"]="First Council of Constantinople|381 AD"
    ["pelagianism"]="Pelagianism Condemned|c. 405-418 AD"
    ["augustine-pelagius"]="Augustine vs Pelagius|c. 386-430"
    ["semi-pelagianism"]="Semi-Pelagianism|c. 428 AD"
    ["fall-of-rome"]="Fall of Rome|410 AD"
    ["augustine-death"]="Death of Augustine|430 AD"
    ["council-ephesus"]="Council of Ephesus|431 AD"
    ["council-chalcedon"]="Council of Chalcedon|451 AD"
    ["council-orange"]="Council of Orange|529 AD"
    ["council-constantinople-2"]="Second Council of Constantinople|553 AD"
    ["fifth-council"]="Fifth Ecumenical Council|553 AD"
    ["council-constantinople-3"]="Third Council of Constantinople|680-681 AD"
    ["council-nicaea-2"]="Second Council of Nicaea|787 AD"
    ["filioque"]="Filioque Controversy|c. 800-1000 AD"
    ["great-schism"]="Great Schism|1054 AD"
    ["scholasticism"]="Rise of Scholasticism|c. 1100-1300 AD"
    ["wycliffe-hus"]="Precursors to Reformation|c. 1350-1400 AD"
    ["luther-95-theses"]="95 Theses|1517"
    ["luther-treatises"]="Luther's Three Treatises|1520"
    ["diet-of-worms"]="Diet of Worms|1521"
    ["zwingli-zurich"]="Zwingli's Reformation|1522"
    ["marburg-colloquy"]="Marburg Colloquy|1529"
    ["zwingli-death"]="Death of Zwingli|1531"
    ["calvin-institutes"]="Institutes|1536"
    ["calvin-geneva"]="Calvin in Geneva|1541"
    ["english-reformation"]="English Reformation|1534"
    ["elizabethan-settlement"]="Elizabethan Settlement|1559"
    ["scottish-reformation"]="Scottish Reformation|1560"
    ["council-trent"]="Council of Trent|1545-1563"
    ["heidelberg-catechism"]="Heidelberg Catechism|1563"
    ["belgic-confession"]="Belgic Confession|1561"
    ["geneva-bible"]="Geneva Bible|1560"
    ["arminius"]="Jacobus Arminius|1603"
    ["remonstrance"]="Five Articles of Remonstrance|1610"
    ["synod-dort"]="Synod of Dort|1618-1619"
    ["canons-dort"]="Canons of Dort|1619"
    ["westminster-assembly"]="Westminster Assembly|1643-1649"
    ["westminster-confession"]="Westminster Confession|1647"
)

# Colors
BG_COLOR="#1a1a2e"
ACCENT_COLOR="#d4af37"
TEXT_COLOR="#c9b896"
TITLE_COLOR="#d4af37"

echo "Generating placeholder images for timeline events..."
echo ""

for filename in "${!events[@]}"; do
    IFS='|' read -r title year <<< "${events[$filename]}"
    
    echo "Creating: ${filename}.jpg"
    
    # Generate image with ImageMagick
    convert -size 800x400 \
        xc:"$BG_COLOR" \
        -pointsize 28 \
        -fill "$TITLE_COLOR" \
        -gravity center \
        -font "Georgia" \
        caption:"$title" \
        -gravity center \
        -pointsize 20 \
        -fill "$TEXT_COLOR" \
        -annotate +0+50 "$year" \
        -stroke "$ACCENT_COLOR" \
        -strokewidth 2 \
        -draw "rectangle 20,20 780,380" \
        -stroke none \
        "${filename}.jpg"
    
    # Optimize
    convert "${filename}.jpg" -quality 85 "${filename}.jpg"
    
    echo "  ✓ ${filename}.jpg created"
done

echo ""
echo "=========================================="
echo "Placeholder images generated!"
echo "=========================================="
echo ""
echo "IMPORTANT: These are TEMPORARY placeholders."
echo "Please replace them with actual historical images:"
echo ""
echo "Sources:"
echo "  1. Wikimedia Commons (https://commons.wikimedia.org)"
echo "  2. Unsplash (https://unsplash.com)"
echo "  3. British Library (https://www.flickr.com/photos/britishlibrary)"
echo ""
echo "See README.md for detailed instructions."