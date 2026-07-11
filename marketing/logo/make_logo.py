#!/usr/bin/env python3
# Sistema de logo ABONO (agro-editorial): lockup horizontal, apilado, wordmark y hoja de variantes.
from PIL import Image, ImageDraw, ImageFont

CREMA, PAPEL, TINTA = "#F2EAD9", "#FBF6EA", "#2E2014"
BARRO, ORO, MUTED = "#B44A24", "#D9A03F", "#8a7a63"
Fp = "/System/Library/Fonts/Supplemental/"
SERIF_I = lambda s: ImageFont.truetype(Fp + "Georgia Bold Italic.ttf", s)
MONO    = lambda s: ImageFont.truetype(Fp + "Courier New Bold.ttf", s)

def tracked(d, xy, text, fnt, fill, track=0, anchor="la"):
    ws = [d.textlength(c, font=fnt) for c in text]
    total = sum(ws) + track * (len(text) - 1)
    x, y = xy
    if anchor.startswith("m"): x -= total / 2
    elif anchor.startswith("r"): x -= total
    for c, w in zip(text, ws):
        d.text((x, y), c, font=fnt, fill=fill); x += w + track

def sello(bg, size):
    return Image.open({"crema":"sello-crema.png","cafe":"sello-cafe.png","barro":"sello-barro.png"}[bg]).convert("RGBA").resize((size, size))

# ---------- 1. LOCKUP HORIZONTAL (el principal) ----------
img = Image.new("RGB", (2000, 760), CREMA); d = ImageDraw.Draw(img)
img.paste(sello("crema", 620), (70, 70), sello("crema", 620))
d.text((760, 250), "ABONO", font=SERIF_I(200), fill=TINTA)
d.line([(768, 480), (1520, 480)], fill=BARRO, width=5)
tracked(d, (770, 510), "SABE SI GANASTE.", MONO(54), BARRO, track=6)
img.save("logo-horizontal.png")

# ---------- 2. LOCKUP APILADO ----------
img = Image.new("RGB", (1100, 1360), CREMA); d = ImageDraw.Draw(img)
img.paste(sello("crema", 620), (240, 90), sello("crema", 620))
d.text((550, 780), "ABONO", font=SERIF_I(230), fill=TINTA, anchor="ma")
d.line([(300, 1050), (800, 1050)], fill=BARRO, width=5)
tracked(d, (550, 1085), "SABE SI GANASTE.", MONO(48), BARRO, track=6, anchor="ma")
img.save("logo-vertical.png")

# ---------- 3. WORDMARK TRANSPARENTE ----------
img = Image.new("RGBA", (1400, 480), (0, 0, 0, 0)); d = ImageDraw.Draw(img)
d.text((700, 150), "ABONO", font=SERIF_I(210), fill=TINTA, anchor="ma")
d.line([(360, 330), (1040, 330)], fill=BARRO, width=5)
tracked(d, (700, 360), "SABE SI GANASTE.", MONO(48), BARRO, track=6, anchor="ma")
img.save("logo-wordmark-transparente.png")

# ---------- 4. HOJA DE VARIANTES (portafolio) ----------
sheet = Image.new("RGB", (2000, 1500), PAPEL); d = ImageDraw.Draw(sheet)
tracked(d, (100, 80), "ABONO · SISTEMA DE LOGO", MONO(40), TINTA, track=6)
d.line([(100, 150), (1900, 150)], fill=TINTA, width=2)
panels = [(CREMA, "crema", TINTA, BARRO), (TINTA, "cafe", PAPEL, ORO), (BARRO, "barro", PAPEL, PAPEL)]
pw, ph, x0, y0 = 580, 620, 100, 230
for i, (bg, sname, wmark, tag) in enumerate(panels):
    x = x0 + i * (pw + 30)
    d.rectangle([x, y0, x + pw, y0 + ph], fill=bg)
    s = sello(sname, 300); sheet.paste(s, (x + pw//2 - 150, y0 + 40), s)
    d.text((x + pw//2, y0 + 400), "ABONO", font=SERIF_I(96), fill=wmark, anchor="ma")
    tracked(d, (x + pw//2, y0 + 520), "SABE SI GANASTE.", MONO(26), tag, track=3, anchor="ma")
# fila inferior: paleta + tipografía
d.text((100, 1000), "ABONO", font=SERIF_I(150), fill=TINTA)
tracked(d, (105, 1180), "GEORGIA BOLD ITALIC · IBM PLEX MONO", MONO(30), MUTED, track=3)
sw, sy = 720, 1010
for c, lbl in [(CREMA,"CREMA"),(TINTA,"TINTA"),(BARRO,"BARRO"),(ORO,"ORO")]:
    d.rectangle([sw, sy, sw+120, sy+120], fill=c, outline=MUTED, width=1)
    tracked(d, (sw+60, sy+140), lbl, MONO(22), MUTED, track=2, anchor="ma")
    sw += 150
sheet.save("logo-hoja.png")
print("Listo: logo-horizontal / logo-vertical / logo-wordmark-transparente / logo-hoja")
