#!/bin/bash

TARGET_DIR="assets/images/cards"
mkdir -p "$TARGET_DIR"

echo "🧙 Memulai download 22 Major Arcana ke -> $TARGET_DIR"
echo "--------------------------------------------------"

declare -A CARDS=(
    ["0"]="the_fool.jpg" ["1"]="the_magician.jpg" ["2"]="the_high_priestess.jpg"
    ["3"]="the_empress.jpg" ["4"]="the_emperor.jpg" ["5"]="the_hierophant.jpg"
    ["6"]="the_lovers.jpg" ["7"]="the_chariot.jpg" ["8"]="the_strength.jpg"
    ["9"]="the_hermit.jpg" ["10"]="the_wheel_of_fortune.jpg" ["11"]="the_justice.jpg"
    ["12"]="the_hanged_man.jpg" ["13"]="the_death.jpg" ["14"]="the_temperance.jpg"
    ["15"]="the_devil.jpg" ["16"]="the_tower.jpg" ["17"]="the_star.jpg"
    ["18"]="the_moon.jpg" ["19"]="the_sun.jpg" ["20"]="the_judgement.jpg"
    ["21"]="the_world.jpg"
)

BASE_URL="https://raw.githubusercontent.com/mixvlad/TarotCards/main/tarot/rider-waite/720px"

declare -A REPO_MAP=(
    ["0"]="00_Fool" ["1"]="01_Magician" ["2"]="02_High_Priestess"
    ["3"]="03_Empress" ["4"]="04_Emperor" ["5"]="05_Hierophant"
    ["6"]="06_Lovers" ["7"]="07_Chariot" ["8"]="08_Strength"
    ["9"]="09_Hermit" ["10"]="10_Wheel_of_Fortune" ["11"]="11_Justice"
    ["12"]="12_Hanged_Man" ["13"]="13_Death" ["14"]="14_Temperance"
    ["15"]="15_Devil" ["16"]="16_Tower" ["17"]="17_Star"
    ["18"]="18_Moon" ["19"]="19_Sun" ["20"]="20_Judgement"
    ["21"]="21_World"
)

echo "🧹 Membersihkan file lama..."
find "$TARGET_DIR" -type f -delete 2>/dev/null

for id in {0..21}; do
    local_name="${CARDS[$id]}"
    repo_file="${REPO_MAP[$id]}"
    URL="( {BASE_URL}/ ){repo_file}.jpg"
    OUTPUT_FILE="( {TARGET_DIR}/ ){local_name}"
    
    echo -n "⬇️ Downloading Card $id ($local_name)... "
    
    curl -fsL --connect-timeout 20 --retry 3 "$URL" -o "$OUTPUT_FILE"
    
    if [ $? -eq 0 ] && [ -s "$OUTPUT_FILE" ]; then
        echo "✅ Sukses!"
    else
        echo "❌ GAGAL (URL: $URL)"
        rm -f "$OUTPUT_FILE"
    fi
done

echo "--------------------------------------------------"
echo "🎉 Proses selesai!"
ls -lh "$TARGET_DIR"
