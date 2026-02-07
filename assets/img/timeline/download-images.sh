#!/bin/bash
# Download timeline images from Wikimedia Commons
# Run this script to automatically download the top 10 images

echo "=========================================="
echo "Timeline Image Downloader"
echo "=========================================="
echo ""

# Create downloads directory
mkdir -p downloads
cd downloads

# Function to download and process image
download_image() {
    local url=$1
    local filename=$2
    local description=$3
    
    echo "Downloading: $description"
    
    # Download using curl
    if curl -s -L -o "temp_$filename" "$url"; then
        # Check if file exists and has content
        if [ -s "temp_$filename" ]; then
            # Check if it's an image
            filetype=$(file -b --mime-type "temp_$filename")
            if [[ $filetype == image/* ]]; then
                # Copy to timeline folder
                cp "temp_$filename" "../$filename"
                echo "  ✓ $filename downloaded successfully"
            else
                echo "  ✗ Downloaded file is not an image"
            fi
        else
            echo "  ✗ Download failed: empty file"
        fi
        rm -f "temp_$filename"
    else
        echo "  ✗ Download failed"
    fi
}

# Download top 10 images
echo "Downloading top 10 priority images..."
echo ""

# 1. Pentecost
download_image \
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Tizian_005.jpg/800px-Tizian_005.jpg" \
    "pentecost.jpg" \
    "Pentecost by Titian"

# 2. Council of Nicaea
download_image \
    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/First_Council_of_Nicea.jpg/800px-First_Council_of_Nicea.jpg" \
    "council-nicaea.jpg" \
    "Council of Nicaea"

# 3. Augustine
download_image \
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Saint_Augustine_by_Philippe_de_Champaigne.jpg/800px-Saint_Augustine_by_Philippe_de_Champaigne.jpg" \
    "augustine-death.jpg" \
    "Saint Augustine"

# 4. Luther 95 Theses
download_image \
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Luther_95_Thesen.jpg/800px-Luther_95_Thesen.jpg" \
    "luther-95-theses.jpg" \
    "Luther 95 Theses"

# 5. John Calvin
download_image \
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/John_Calvin_by_Hans_Holbein_the_Younger.jpg/800px-John_Calvin_by_Hans_Holbein_the_Younger.jpg" \
    "calvin-institutes.jpg" \
    "John Calvin"

# 6. Council of Trent
download_image \
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Council_of_Trent.jpg/800px-Council_of_Trent.jpg" \
    "council-trent.jpg" \
    "Council of Trent"

# 7. Synod of Dort
download_image \
    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Synode_van_Dordrecht_%281618-1619%29.jpg/800px-Synode_van_Dordrecht_%281618-1619%29.jpg" \
    "synod-dort.jpg" \
    "Synod of Dort"

# 8. Westminster Assembly
download_image \
    "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Westminster_Assembly.jpg/800px-Westminster_Assembly.jpg" \
    "westminster-assembly.jpg" \
    "Westminster Assembly"

# 9. Great Awakening (Whitefield)
download_image \
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/George_Whitefield_preaching.jpg/800px-George_Whitefield_preaching.jpg" \
    "great-awakening.jpg" \
    "George Whitefield preaching"

# 10. William Carey
download_image \
    "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/William_Carey_by_Ann_Harriet_Fuller.jpg/800px-William_Carey_by_Ann_Harriet_Fuller.jpg" \
    "william-carey.jpg" \
    "William Carey"

echo ""
echo "=========================================="
echo "Download complete!"
echo "=========================================="
echo ""
echo "Images saved to: assets/img/timeline/"
echo ""
echo "IMPORTANT: These images may need to be resized to 800x400 pixels"
echo "for optimal display in the timeline."
echo ""
echo "Next steps:"
echo "1. Check that images downloaded correctly"
echo "2. Resize images if needed"
echo "3. Rebuild Jekyll site"
echo "4. View your timeline with images!"

# Go back to parent directory
cd ..