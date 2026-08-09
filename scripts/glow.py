#!/usr/bin/env python3
"""apply_glow.py – tambahkan efek watercolor‑glow pada SVG totem"""

import os, svgwrite, cairosvg

SRC_DIR = "assets/images/totems"
DST_DIR = "assets/images/totems_glow"
os.makedirs(DST_DIR, exist_ok=True)

for key in ["angel", "eagle", "lion", "ox"]:
    svg_src = f"{SRC_DIR}/{key}.svg"
    svg_dst = f"{DST_DIR}/{key}.svg"
    png_dst = f"{DST_DIR}/{key}.png"

    # Baca SVG asli, tambahkan defs dengan filter blur
    with open(svg_src) as f:
        content = f.read()

    # Sisipkan filter di dalam tag <svg>
    filter_def = '''
    <defs>
        <filter id="glow">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
            </feMerge>
        </filter>
    </defs>
    '''
    content = content.replace('<svg', '<svg filter="url(#glow)" ', 1)
    content = content.replace('</svg>', filter_def + '</svg>', 1)

    with open(svg_dst, 'w') as f:
        f.write(content)

    cairosvg.svg2png(url=svg_dst, write_to=png_dst, output_width=800, output_height=800)
    print(f"✨ Glow version: {png_dst}")