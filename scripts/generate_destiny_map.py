#!/usr/bin/env python3

import os
import xml.etree.ElementTree as ET

WIDTH = 900
HEIGHT = 900

SVG_NS = "http://www.w3.org/2000/svg"
ET.register_namespace("", SVG_NS)

svg = ET.Element(
    "{" + SVG_NS + "}svg",
    {
        "width": str(WIDTH),
        "height": str(HEIGHT),
        "viewBox": f"0 0 {WIDTH} {HEIGHT}",
        "xmlns": SVG_NS,
    },
)

ET.SubElement(svg, "rect", {
    "x":"0",
    "y":"0",
    "width":str(WIDTH),
    "height":str(HEIGHT),
    "fill":"#FFF8ED"
})

nodes = {
    "A1": (450, 60),

    "A": (450, 140),

    "A2": (450, 255),

    "A3": (250, 255),
    "B3": (650, 255),

    "D1": (40, 450),
    "D": (120, 450),
    "D2": (300, 450),
    "E": (450, 450),
    "B2": (600, 450),
    "B": (730, 450),
    "B1": (840, 450),

    "D3": (300, 610),
    "C2": (450, 610),
    "C3": (600, 610),

    "N": (355, 680),
    "P": (305, 735),
    "O": (420, 735),

    "C": (450, 790),
    "C1": (450, 865),
}

lines = [

    ("A1","A"),
    ("A","A2"),
    ("A2","E"),
    ("E","C2"),
    ("C2","C"),
    ("C","C1"),

    ("D1","D"),
    ("D","D2"),
    ("D2","E"),
    ("E","B2"),
    ("B2","B"),
    ("B","B1"),

    ("A","D"),
    ("D","C"),
    ("C","B"),
    ("B","A"),

    ("A","A3"),
    ("A3","D"),

    ("A","B3"),
    ("B3","B"),

    ("D","D3"),
    ("D3","C"),

    ("B","C3"),
    ("C3","C"),

    ("D3","N"),
    ("N","P"),
    ("N","O"),
    ("O","C"),
]

for a,b in lines:
    x1,y1 = nodes[a]
    x2,y2 = nodes[b]

    ET.SubElement(svg,"line",{
        "x1":str(x1),
        "y1":str(y1),
        "x2":str(x2),
        "y2":str(y2),
        "stroke":"#CFCFCF",
        "stroke-width":"5"
    })

colors = {
    "A":"#42D5D4",
    "B":"#FF7848",
    "C":"#4E8B2D",
    "D":"#4E8B2D",
    "E":"#FF7848",

    "default":"#F8D54B"
}

small = {
"A1","A2","A3",
"B1","B2","B3",
"C1","C2","C3",
"D1","D2","D3",
"N","O","P"
}

for name,(x,y) in nodes.items():

    r = 18 if name in small else 30

    fill = colors.get(name, colors["default"])

    ET.SubElement(svg,"circle",{
        "cx":str(x),
        "cy":str(y),
        "r":str(r),
        "fill":fill,
        "stroke":"white",
        "stroke-width":"3"
    })

    txt = ET.SubElement(svg,"text",{
        "x":str(x),
        "y":str(y+6),
        "font-size":"16",
        "font-family":"Arial",
        "font-weight":"bold",
        "fill":"white",
        "text-anchor":"middle"
    })

    txt.text = name

tree = ET.ElementTree(svg)

os.makedirs("assets/images", exist_ok=True)

tree.write(
    "assets/images/destiny_matrix_map.svg",
    encoding="utf-8",
    xml_declaration=True
)

print("Berhasil membuat assets/images/destiny_matrix_map.svg")

import os
import svgwrite

try:
    import cairosvg
    HAS_CAIRO = True
except:
    HAS_CAIRO = False

WIDTH = 900
HEIGHT = 900
R = 28

dwg = svgwrite.Drawing("assets/images/destiny_matrix_map.svg",
                       size=(WIDTH, HEIGHT))

# Background
dwg.add(dwg.rect(insert=(0,0),
                 size=(WIDTH,HEIGHT),
                 fill="#FFF7EC"))

line_color="#C8C8C8"

def line(a,b):
    dwg.add(
        dwg.line(a,b,
                 stroke=line_color,
                 stroke_width=4)
    )

nodes = {

"A1":(450,70),

"A":(450,150),

"A2":(450,270),

"A3":(250,270),

"B3":(650,270),

"D":(150,450),

"D2":(320,450),

"E":(450,450),

"B2":(580,450),

"B":(730,450),

"B1":(840,450),

"D1":(50,450),

"D3":(320,620),

"C3":(580,620),

"C2":(450,620),

"C":(450,760),

"C1":(450,840),

"N":(380,690),

"O":(430,720),

"P":(330,720),
}

# Diamond
line(nodes["A"],nodes["D"])
line(nodes["A"],nodes["B"])
line(nodes["D"],nodes["C"])
line(nodes["B"],nodes["C"])

# Vertical
line(nodes["A1"],nodes["A"])
line(nodes["A"],nodes["A2"])
line(nodes["A2"],nodes["E"])
line(nodes["E"],nodes["C2"])
line(nodes["C2"],nodes["C"])
line(nodes["C"],nodes["C1"])

# Horizontal
line(nodes["D1"],nodes["D"])
line(nodes["D"],nodes["D2"])
line(nodes["D2"],nodes["E"])
line(nodes["E"],nodes["B2"])
line(nodes["B2"],nodes["B"])
line(nodes["B"],nodes["B1"])

# Left diagonal
line(nodes["A3"],nodes["A"])
line(nodes["A3"],nodes["D"])

line(nodes["D"],nodes["D3"])
line(nodes["D3"],nodes["C"])

# Right diagonal
line(nodes["B3"],nodes["A"])
line(nodes["B3"],nodes["B"])

line(nodes["B"],nodes["C3"])
line(nodes["C3"],nodes["C"])

# Tail
line(nodes["D3"],nodes["N"])
line(nodes["N"],nodes["O"])
line(nodes["N"],nodes["P"])
line(nodes["O"],nodes["C"])

colors = {
"A":"#47D4D8",
"B":"#FF7A45",
"C":"#4D8B31",
"D":"#4D8B31",
"E":"#FF7A45",

"default":"#F7D94C"
}

def draw_node(name,x,y):

    fill=colors.get(name,colors["default"])

    if name in ["A1","B1","C1","D1","A2","A3","B2","B3","C2","C3","D2","D3","N","O","P"]:
        radius=18
    else:
        radius=30

    dwg.add(
        dwg.circle(
            center=(x,y),
            r=radius,
            fill=fill,
            stroke="white",
            stroke_width=3
        )
    )

    dwg.add(
        dwg.text(
            name,
            insert=(x,y+5),
            text_anchor="middle",
            font_size=16,
            fill="white",
            font_family="Arial",
            font_weight="bold"
        )
    )

for n,(x,y) in nodes.items():
    draw_node(n,x,y)

dwg.save()

if HAS_CAIRO:
    cairosvg.svg2png(
        url="assets/images/destiny_matrix_map.svg",
        write_to="assets/images/destiny_matrix_map.png",
        output_width=900,
        output_height=900
    )
    print("PNG dibuat.")
else:
    print("SVG berhasil dibuat.")

print("Selesai.")
