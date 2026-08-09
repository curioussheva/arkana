#!/usr/bin/env python3

import os
import math
import random
import svgwrite

try:
    import cairosvg
    HAS_CAIRO = True
except ImportError:
    HAS_CAIRO = False

WIDTH = 900
HEIGHT = 900
CENTER_X = WIDTH // 2
CENTER_Y = HEIGHT // 2

OUTPUT_DIR = "assets/images/totems"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Konfigurasi 4 Totem Penjaga (Versi Background Terang & Kontras Tinggi)
TOTEMS = [
    {
        "key": "angel",
        "title": "ANGELUS",
        "subtitle": "ELEMENTUM AER",
        "symbol_code": "angel",
        "accent": "#B45309",        # Amber Gold Gelap
        "accent_dark": "#78350F",   # Bayangan Cokelat Tua
        "alchemy_type": "air",
    },
    {
        "key": "eagle",
        "title": "AQUILA",
        "subtitle": "ELEMENTUM AQUA",
        "symbol_code": "eagle",
        "accent": "#1E40AF",        # Royal Sapphire Blue
        "accent_dark": "#1E3A8A",   # Navy Gelap
        "alchemy_type": "water",
    },
    {
        "key": "lion",
        "title": "LEO",
        "subtitle": "ELEMENTUM IGNIS",
        "symbol_code": "lion",
        "accent": "#B91C1C",        # Deep Crimson Red
        "accent_dark": "#7F1D1D",   # Dark Burgundy
        "alchemy_type": "fire",
    },
    {
        "key": "ox",
        "title": "TAURUS",
        "subtitle": "ELEMENTUM TERRA",
        "symbol_code": "ox",
        "accent": "#047857",        # Deep Emerald Green
        "accent_dark": "#064E3B",   # Dark Forest Green
        "alchemy_type": "earth",
    },
]

def draw_filigree_frame_and_vines(dwg, color, dark_color):
    """Menggambar bingkai bergaya sulur tanaman esoterik (Filigree & Vines)."""
    dwg.add(dwg.rect(insert=(24, 24), size=(WIDTH - 48, HEIGHT - 48), fill="none", stroke=color, stroke_width=3.5))
    dwg.add(dwg.rect(insert=(34, 34), size=(WIDTH - 68, HEIGHT - 68), fill="none", stroke=color, stroke_width=1.5))

    corners = [
        (34, 34, 1, 1),
        (WIDTH - 34, 34, -1, 1),
        (34, HEIGHT - 34, 1, -1),
        (WIDTH - 34, HEIGHT - 34, -1, -1),
    ]

    g = dwg.g(stroke=color, fill="none", stroke_linecap="round", stroke_linejoin="round")

    for cx, cy, dx, dy in corners:
        g.add(dwg.path(
            d=f"M {cx} {cy + dy*70} C {cx + dx*20} {cy + dy*40}, {cx + dx*40} {cy + dy*20}, {cx + dx*70} {cy} "
              f"C {cx + dx*45} {cy + dy*10}, {cx + dx*10} {cy + dy*45}, {cx} {cy + dy*70} Z",
            stroke_width=2.5, fill=color, fill_opacity=0.08
        ))

        g.add(dwg.path(
            d=f"M {cx + dx*20} {cy + dy*20} Q {cx + dx*50} {cy + dy*50} {cx + dx*30} {cy + dy*70} "
              f"Q {cx + dx*15} {cy + dy*85} {cx + dx*5} {cy + dy*65}",
            stroke_width=2.0
        ))

        for t in [0.3, 0.6, 0.85]:
            lx = cx + dx * (20 + t * 45)
            ly = cy + dy * (20 + t * 45)
            g.add(dwg.path(d=f"M {lx} {ly} Q {lx + dx*15} {ly} {lx + dx*10} {ly - dy*15} Q {lx} {ly - dy*10} {lx} {ly}", stroke_width=1.5, fill=color, fill_opacity=0.3))
            g.add(dwg.path(d=f"M {lx} {ly} Q {lx} {ly + dy*15} {lx - dx*15} {ly + dy*10} Q {lx - dx*10} {ly} {lx} {ly}", stroke_width=1.5, fill=color, fill_opacity=0.3))

        g.add(dwg.circle(center=(cx + dx*18, cy + dy*18), r=6, stroke_width=2, fill="#FDFBF7"))
        g.add(dwg.circle(center=(cx + dx*18, cy + dy*18), r=3, fill=color))

    mid_points = [
        (CENTER_X, 34, 0, 1),
        (CENTER_X, HEIGHT - 34, 0, -1),
        (34, CENTER_Y, 1, 0),
        (WIDTH - 34, CENTER_Y, -1, 0),
    ]

    for mx, my, mdx, mdy in mid_points:
        if mdx == 0:
            g.add(dwg.path(d=f"M {mx-40} {my} Q {mx} {my + mdy*25} {mx+40} {my}", stroke_width=2.5))
            g.add(dwg.circle(center=(mx, my + mdy*12), r=5, fill=color))
        else:
            g.add(dwg.path(d=f"M {mx} {my-40} Q {mx + mdx*25} {my} {mx} {my+40}", stroke_width=2.5))
            g.add(dwg.circle(center=(mx + mdx*12, my), r=5, fill=color))

    dwg.add(g)

def draw_alchemy_symbol(dwg, alchemy_type, color):
    """Menggambar Simbol Alkimia 4 Elemen Tebal di Latar."""
    g = dwg.g(stroke=color, fill="none", stroke_width=3.0, opacity=0.6)
    cy = CENTER_Y + 195
    r = 26

    if alchemy_type == "air":
        g.add(dwg.polygon(points=[(CENTER_X, cy - r), (CENTER_X - r, cy + r/1.5), (CENTER_X + r, cy + r/1.5)]))
        g.add(dwg.line((CENTER_X - r*0.85, cy - r*0.1), (CENTER_X + r*0.85, cy - r*0.1)))
    elif alchemy_type == "fire":
        g.add(dwg.polygon(points=[(CENTER_X, cy - r), (CENTER_X - r, cy + r/1.5), (CENTER_X + r, cy + r/1.5)]))
    elif alchemy_type == "water":
        g.add(dwg.polygon(points=[(CENTER_X, cy + r), (CENTER_X - r, cy - r/1.5), (CENTER_X + r, cy - r/1.5)]))
    elif alchemy_type == "earth":
        g.add(dwg.polygon(points=[(CENTER_X, cy + r), (CENTER_X - r, cy - r/1.5), (CENTER_X + r, cy - r/1.5)]))
        g.add(dwg.line((CENTER_X - r*0.85, cy + r*0.1), (CENTER_X + r*0.85, cy + r*0.1)))

    dwg.add(g)

def draw_sacred_geometry_bold(dwg, color):
    """Sistem Cincin Geometri Sakral Tebal & Kontras."""
    hex_g = dwg.g(stroke=color, fill="none", stroke_width=1.2, opacity=0.35)
    r_hex = 235
    pts1 = [(CENTER_X + r_hex * math.cos(math.radians(i*120 - 90)), CENTER_Y + r_hex * math.sin(math.radians(i*120 - 90))) for i in range(3)]
    pts2 = [(CENTER_X + r_hex * math.cos(math.radians(i*120 + 30)), CENTER_Y + r_hex * math.sin(math.radians(i*120 + 30))) for i in range(3)]
    hex_g.add(dwg.polygon(points=pts1))
    hex_g.add(dwg.polygon(points=pts2))
    dwg.add(hex_g)

    for i in range(24):
        angle = math.radians(i * 15)
        x1 = CENTER_X + 175 * math.cos(angle)
        y1 = CENTER_Y + 175 * math.sin(angle)
        x2 = CENTER_X + 315 * math.cos(angle)
        y2 = CENTER_Y + 315 * math.sin(angle)
        dwg.add(dwg.line((x1, y1), (x2, y2), stroke=color, stroke_width=1.5 if i % 2 == 0 else 1.0, opacity=0.55))

    for r, w, op in [(325, 3.0, 0.85), (312, 1.5, 0.6), (255, 2.5, 0.8), (175, 1.8, 0.6)]:
        dwg.add(dwg.circle(center=(CENTER_X, CENTER_Y), r=r, fill="none", stroke=color, stroke_width=w, opacity=op))

    for i in range(72):
        angle = math.radians(i * 5)
        r_in = 312 if i % 6 == 0 else 318
        x1 = CENTER_X + r_in * math.cos(angle)
        y1 = CENTER_Y + r_in * math.sin(angle)
        x2 = CENTER_X + 325 * math.cos(angle)
        y2 = CENTER_Y + 325 * math.sin(angle)
        dwg.add(dwg.line((x1, y1), (x2, y2), stroke=color, stroke_width=2.0 if i % 6 == 0 else 1.2, opacity=0.75))

def draw_bold_sketch_symbol(dwg, symbol_code, color, dark_color):
    """Sketsa Vektor dengan Garis Ekstra Tebal."""
    group = dwg.g(stroke=color, fill="none", stroke_linecap="round", stroke_linejoin="round")

    if symbol_code == "angel":
        group.add(dwg.circle(center=(CENTER_X, CENTER_Y - 65), r=52, stroke_width=3.5))
        group.add(dwg.circle(center=(CENTER_X, CENTER_Y - 65), r=44, stroke_width=1.5, stroke_dasharray="4,4"))
        
        for i in range(16):
            ang = math.radians(i * 22.5)
            group.add(dwg.line((CENTER_X + 52*math.cos(ang), CENTER_Y - 65 + 52*math.sin(ang)),
                               (CENTER_X + 64*math.cos(ang), CENTER_Y - 65 + 64*math.sin(ang)),
                               stroke_width=2.0, opacity=0.8))

        group.add(dwg.path(d=f"M {CENTER_X-20} {CENTER_Y-35} C {CENTER_X-24} {CENTER_Y-10}, {CENTER_X-14} {CENTER_Y+14}, {CENTER_X} {CENTER_Y+16} C {CENTER_X+14} {CENTER_Y+14}, {CENTER_X+24} {CENTER_Y-10}, {CENTER_X+20} {CENTER_Y-35} Z", stroke_width=3.5, fill="#FDFBF7"))
        group.add(dwg.path(d=f"M {CENTER_X-20} {CENTER_Y-35} C {CENTER_X-38} {CENTER_Y-18}, {CENTER_X-32} {CENTER_Y+15}, {CENTER_X-22} {CENTER_Y+30}", stroke_width=2.2))
        group.add(dwg.path(d=f"M {CENTER_X+20} {CENTER_Y-35} C {CENTER_X+38} {CENTER_Y-18}, {CENTER_X+32} {CENTER_Y+15}, {CENTER_X+22} {CENTER_Y+30}", stroke_width=2.2))

        for side in [-1, 1]:
            # BARIS YANG DIPERBAIKI: Ditambahkan kurung kurawal pembuka '{'
            w1 = (f"M {CENTER_X + side*28} {CENTER_Y} "
                  f"C {CENTER_X + side*155} {CENTER_Y - 140}, "
                  f"{CENTER_X + side*205} {CENTER_Y + 10}, "
                  f"{CENTER_X + side*55} {CENTER_Y + 100}")
            w2 = (f"M {CENTER_X + side*24} {CENTER_Y+15} "
                  f"C {CENTER_X + side*130} {CENTER_Y - 90}, "
                  f"{CENTER_X + side*170} {CENTER_Y + 20}, "
                  f"{CENTER_X + side*45} {CENTER_Y + 85}")
            group.add(dwg.path(d=w1, stroke_width=4.2))
            group.add(dwg.path(d=w2, stroke_width=2.5))

            for t in [0.25, 0.45, 0.65, 0.85]:
                fx = CENTER_X + side * (28 + t * 135)
                fy = CENTER_Y - t * 50 + (t**2) * 105
                group.add(dwg.line((fx, fy), (fx + side*25, fy + 30), stroke_width=1.8))

        group.add(dwg.line((CENTER_X, CENTER_Y - 85), (CENTER_X, CENTER_Y + 125), stroke_width=4.0))
        group.add(dwg.line((CENTER_X - 25, CENTER_Y - 58), (CENTER_X + 25, CENTER_Y - 58), stroke_width=4.5))
        group.add(dwg.circle(center=(CENTER_X, CENTER_Y - 58), r=6, fill=color))

    elif symbol_code == "eagle":
        head_path = (f"M {CENTER_X-35} {CENTER_Y-42} C {CENTER_X-38} {CENTER_Y-18}, "
                     f"{CENTER_X-20} {CENTER_Y-2}, {CENTER_X+10} {CENTER_Y-5} "
                     f"C {CENTER_X} {CENTER_Y-24}, {CENTER_X-12} {CENTER_Y-40}, {CENTER_X-35} {CENTER_Y-42} Z")
        group.add(dwg.path(d=head_path, stroke_width=3.8, fill="#FDFBF7"))

        beak = (f"M {CENTER_X+10} {CENTER_Y-5} Q {CENTER_X+58} {CENTER_Y-2} {CENTER_X+42} {CENTER_Y+28} "
                f"Q {CENTER_X+24} {CENTER_Y+22} {CENTER_X+10} {CENTER_Y-5} Z")
        group.add(dwg.path(d=beak, stroke_width=3.8, fill=color, fill_opacity=0.2))

        group.add(dwg.circle(center=(CENTER_X - 10, CENTER_Y - 24), r=7, stroke_width=2.5))
        group.add(dwg.circle(center=(CENTER_X - 10, CENTER_Y - 24), r=3.5, fill=color))
        group.add(dwg.path(d=f"M {CENTER_X-26} {CENTER_Y-35} Q {CENTER_X-10} {CENTER_Y-42} {CENTER_X+2} {CENTER_Y-30}", stroke_width=3.0))

        for row in range(4):
            for col in range(-2, 3):
                sx = CENTER_X + col * 12
                sy = CENTER_Y + 20 + row * 14
                group.add(dwg.path(d=f"M {sx-7} {sy} Q {sx} {sy+10} {sx+7} {sy}", stroke_width=1.8))

        for side in [-1, 1]:
            w1 = (f"M {CENTER_X + side*40} {CENTER_Y-5} C {CENTER_X + side*200} {CENTER_Y-115}, "
                  f"{CENTER_X + side*180} {CENTER_Y+70}, {CENTER_X + side*20} {CENTER_Y+115}")
            w2 = (f"M {CENTER_X + side*34} {CENTER_Y+10} C {CENTER_X + side*160} {CENTER_Y-70}, "
                  f"{CENTER_X + side*145} {CENTER_Y+80}, {CENTER_X + side*16} {CENTER_Y+100}")
            group.add(dwg.path(d=w1, stroke_width=4.2))
            group.add(dwg.path(d=w2, stroke_width=2.5))

            for i in range(5):
                ang = math.radians(190 + i * 12)
                bx = CENTER_X + side * (125 + i * 12)
                by = CENTER_Y - 25 + i * 20
                group.add(dwg.line((bx, by), (bx + side*30*math.cos(ang), by + 40*math.sin(ang)), stroke_width=2.0))

    elif symbol_code == "lion":
        for i in range(24):
            ang = math.radians(i * (360/24))
            length = 115 + 28 * math.sin(i * 2.2)
            ctrl_x = CENTER_X + (length * 0.5) * math.cos(ang) + 18 * math.sin(ang * 3)
            ctrl_y = CENTER_Y - 10 + (length * 0.5) * math.sin(ang) + 18 * math.cos(ang * 3)
            dest_x = CENTER_X + length * math.cos(ang)
            dest_y = CENTER_Y - 10 + length * math.sin(ang)

            group.add(dwg.path(d=f"M {CENTER_X} {CENTER_Y-10} Q {ctrl_x} {ctrl_y} {dest_x} {dest_y}",
                                stroke_width=2.8 if i % 2 == 0 else 1.8, opacity=0.9))

        group.add(dwg.circle(center=(CENTER_X, CENTER_Y - 10), r=62, stroke_width=4.0, fill="#FDFBF7"))

        group.add(dwg.polygon(points=[(CENTER_X-18, CENTER_Y-3), (CENTER_X+18, CENTER_Y-3), (CENTER_X, CENTER_Y+22)], stroke_width=3.0, fill=color))
        group.add(dwg.line((CENTER_X, CENTER_Y + 22), (CENTER_X, CENTER_Y + 40), stroke_width=3.0))
        group.add(dwg.path(d=f"M {CENTER_X-25} {CENTER_Y+42} Q {CENTER_X} {CENTER_Y+54} {CENTER_X+25} {CENTER_Y+42}", stroke_width=2.8))

        group.add(dwg.circle(center=(CENTER_X - 26, CENTER_Y - 22), r=7, stroke_width=2.8))
        group.add(dwg.circle(center=(CENTER_X - 26, CENTER_Y - 22), r=3, fill=color))
        group.add(dwg.circle(center=(CENTER_X + 26, CENTER_Y - 22), r=7, stroke_width=2.8))
        group.add(dwg.circle(center=(CENTER_X + 26, CENTER_Y - 22), r=3, fill=color))

    elif symbol_code == "ox":
        for side in [-1, 1]:
            h_path = (f"M {CENTER_X + side*30} {CENTER_Y-20} "
                      f"C {CENTER_X + side*100} {CENTER_Y-65}, {CENTER_X + side*128} {CENTER_Y-115}, {CENTER_X + side*100} {CENTER_Y-150} "
                      f"C {CENTER_X + side*80} {CENTER_Y-155}, {CENTER_X + side*68} {CENTER_Y-140}, {CENTER_X + side*74} {CENTER_Y-112} "
                      f"C {CENTER_X + side*65} {CENTER_Y-82}, {CENTER_X + side*38} {CENTER_Y-42}, {CENTER_X + side*20} {CENTER_Y-22} Z")
            group.add(dwg.path(d=h_path, stroke_width=3.8, fill=color, fill_opacity=0.15))

            for t in [0.3, 0.5, 0.7, 0.85]:
                hx1 = CENTER_X + side * (30 + t * 68)
                hy1 = CENTER_Y - 20 - t * 92
                hx2 = CENTER_X + side * (42 + t * 68)
                hy2 = CENTER_Y - 26 - t * 92
                group.add(dwg.line((hx1, hy1), (hx2, hy2), stroke_width=1.8))

        head = (f"M {CENTER_X-42} {CENTER_Y-20} Q {CENTER_X-48} {CENTER_Y+20} {CENTER_X-26} {CENTER_Y+58} "
                f"L {CENTER_X+26} {CENTER_Y+58} Q {CENTER_X+48} {CENTER_Y+20} {CENTER_X+42} {CENTER_Y-20} "
                f"Q {CENTER_X} {CENTER_Y-38} {CENTER_X-42} {CENTER_Y-20} Z")
        group.add(dwg.path(d=head, stroke_width=3.8, fill="#FDFBF7"))

        group.add(dwg.circle(center=(CENTER_X, CENTER_Y + 48), r=17, stroke_width=3.2))
        group.add(dwg.circle(center=(CENTER_X - 10, CENTER_Y + 48), r=3, fill=color))
        group.add(dwg.circle(center=(CENTER_X + 10, CENTER_Y + 48), r=3, fill=color))

        group.add(dwg.polygon(points=[(CENTER_X, CENTER_Y-28), (CENTER_X-16, CENTER_Y-12), (CENTER_X, CENTER_Y+4), (CENTER_X+16, CENTER_Y-12)], stroke_width=2.0))

    dwg.add(group)


print("🎨 Memulai pembentukan Sketsa Tarot 4 Totem (Versi Background Terang & Frame Sulur)...\n")

for totem in TOTEMS:
    svg_filename = f"{OUTPUT_DIR}/{totem['key']}.svg"
    png_filename = f"{OUTPUT_DIR}/{totem['key']}.png"

    dwg = svgwrite.Drawing(svg_filename, size=(WIDTH, HEIGHT))

    dwg.add(dwg.rect(insert=(0, 0), size=(WIDTH, HEIGHT), fill="#FDFBF7"))

    draw_filigree_frame_and_vines(dwg, totem["accent"], totem["accent_dark"])

    draw_sacred_geometry_bold(dwg, totem["accent"])

    draw_alchemy_symbol(dwg, totem["alchemy_type"], totem["accent"])

    draw_bold_sketch_symbol(dwg, totem["symbol_code"], totem["accent"], totem["accent_dark"])

    dwg.add(dwg.text(
        totem["title"], insert=(CENTER_X, 95), text_anchor="middle", font_size="34px",
        font_family="Times New Roman, Georgia, serif", font_weight="bold",
        fill=totem["accent"], letter_spacing="8"
    ))
    dwg.add(dwg.text(
        totem["subtitle"], insert=(CENTER_X, HEIGHT - 75), text_anchor="middle", font_size="18px",
        font_family="Times New Roman, Georgia, serif", font_weight="bold", fill="#4B5563", letter_spacing="5"
    ))

    dwg.save()

    if HAS_CAIRO:
        cairosvg.svg2png(url=svg_filename, write_to=png_filename, output_width=WIDTH, output_height=HEIGHT)
        print(f"  ✨ [PNG Frame Sulur Terang] Berhasil dibuat: {png_filename}")
    else:
        print(f"  📜 [SVG Frame Sulur Terang] Berhasil dibuat: {svg_filename}")

print("\n🎉 Selesai! Semua sketsa totem background terang & frame sulur berhasil dibuat di:", OUTPUT_DIR)
 