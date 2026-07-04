#!/bin/bash

# Target folder
TARGET_DIR="assets/images/cards"
mkdir -p "$TARGET_DIR"

echo "🧙 Memulai download 22 Major Arcana ke -> $TARGET_DIR"
echo "--------------------------------------------------"

# Daftar nama file lokal (index 0-21)
declare -A CARDS=(
    ["0"]="the_fool.jpg"
    ["1"]="the_magician.jpg"
    ["2"]="the_high_priestess.jpg"
    ["3"]="the_empress.jpg"
    ["4"]="the_emperor.jpg"
    ["5"]="the_hierophant.jpg"
    ["6"]="the_lovers.jpg"
    ["7"]="the_chariot.jpg"
    ["8"]="the_strength.jpg"
    ["9"]="the_hermit.jpg"
    ["10"]="the_wheel_of_fortune.jpg"
    ["11"]="the_justice.jpg"
    ["12"]="the_hanged_man.jpg"
    ["13"]="the_death.jpg"
    ["14"]="the_temperance.jpg"
    ["15"]="the_devil.jpg"
    ["16"]="the_tower.jpg"
    ["17"]="the_star.jpg"
    ["18"]="the_moon.jpg"
    ["19"]="the_sun.jpg"
    ["20"]="the_judgement.jpg"
    ["21"]="the_world.jpg"
)

# Ganti base URL ke jsDelivr (mirror GitHub yang lebih stabil)
BASE_URL="https://cdn.jsdelivr.net/gh/intentofly/tarot-api/static/card-images/major"

for id in {0..21}; do
    local_name="${CARDS[$id]}"
    URL="${BASE_URL}/${id}.jpg"
    OUTPUT_FILE="${TARGET_DIR}/${local_name}"
    
    # Lewati jika file sudah ada dan tidak kosong
    if [ -s "$OUTPUT_FILE" ]; then
        echo "⏭️ Card $id ($local_name) sudah ada, lewati."
        continue
    fi
    
    echo -n "⬇️ Downloading Card $id ($local_name)... "
    
    # Download dengan curl, fallback ke wget jika curl gagal
    if command -v curl &> /dev/null; then
        curl -sL --connect-timeout 15 --retry 2 "$URL" -o "$OUTPUT_FILE"
    elif command -v wget &> /dev/null; then
        wget -q --timeout=15 --tries=2 "$URL" -O "$OUTPUT_FILE"
    else
        echo "❌ curl/wget tidak ditemukan!"
        continue
    fi
    
    if [ $? -eq 0 ] && [ -s "$OUTPUT_FILE" ]; then
        echo "✅ Sukses!"
    else
        echo "❌ GAGAL!"
        rm -f "$OUTPUT_FILE"
    fi
done

echo "--------------------------------------------------"
echo "🎉 Proses selesai!"
echo "Isi folder $TARGET_DIR saat ini:"
ls -lh "$TARGET_DIR" 