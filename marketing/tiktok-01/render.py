#!/usr/bin/env python3
# Render de los 3 slides del primer TikTok de ABONO (agro-editorial) a 1080x1920.
from PIL import Image, ImageDraw, ImageFont

W, H = 1080, 1920
CREMA, PAPEL, TINTA = "#F2EAD9", "#FBF6EA", "#2E2014"
BARRO, ORO, MUTED, MUTED2 = "#B44A24", "#D9A03F", "#8a7a63", "#a8926e"
F = "/System/Library/Fonts/Supplemental/"
def font(name, size): return ImageFont.truetype(F + name, size)
SERIF   = lambda s: font("Georgia Bold.ttf", s)
SERIF_I = lambda s: font("Georgia Bold Italic.ttf", s)
MONO    = lambda s: font("Courier New Bold.ttf", s)
MONO_R  = lambda s: font("Courier New.ttf", s)

def tracked(d, xy, text, fnt, fill, track=0, anchor="la"):
    widths = [d.textlength(c, font=fnt) for c in text]
    total = sum(widths) + track * (len(text) - 1)
    x, y = xy
    if anchor.startswith("m"): x -= total / 2
    elif anchor.startswith("r"): x -= total
    for c, w in zip(text, widths):
        d.text((x, y), c, font=fnt, fill=fill)
        x += w + track

def dashed(d, x1, y, x2, fill, w=3, dash=14, gap=10):
    x = x1
    while x < x2:
        d.line([(x, y), (min(x + dash, x2), y)], fill=fill, width=w)
        x += dash + gap

def new(bg):
    img = Image.new("RGB", (W, H), bg); return img, ImageDraw.Draw(img)

# ---------- SLIDE 1 — ticket hook ----------
img, d = new(CREMA)
d.rectangle([120, 300, 960, 1620], fill=PAPEL, outline=TINTA, width=4)
dashed(d, 120, 302, 960, TINTA, w=10, dash=22, gap=14)
dashed(d, 120, 1618, 960, TINTA, w=10, dash=22, gap=14)
tracked(d, (540, 400), "ABONO · BASCULA DE DATOS", MONO(40), TINTA, track=8, anchor="ma")
tracked(d, (540, 470), "FOLIO 0001 · MICHOACAN, MX", MONO_R(30), MUTED, track=6, anchor="ma")
dashed(d, 200, 560, 880, TINTA, w=2, dash=12, gap=10)
for i, (txt, it, col) in enumerate([("¿Sabes", 0, TINTA), ("cuánto te", 0, TINTA), ("costó cada", 0, TINTA), ("kilo?", 1, BARRO)]):
    d.text((200, 660 + i*122), txt, font=(SERIF_I if it else SERIF)(104), fill=col)
dashed(d, 200, 1250, 880, TINTA, w=2, dash=12, gap=10)
d.text((200, 1320), "LA MAYORIA NO LO SABE.", font=MONO(40), fill=TINTA)
d.text((200, 1385), "Y AHI SE VA LA GANANCIA.", font=MONO(40), fill=TINTA)
d.text((200, 1500), "ABONO", font=SERIF_I(56), fill=TINTA)
tracked(d, (880, 1512), "SABE SI GANASTE.", MONO(30), BARRO, track=4, anchor="ra")
tracked(d, (540, 1735), "DESLIZA →", MONO(34), MUTED, track=6, anchor="ma")
img.save("slide1.png")

# ---------- SLIDE 2 — historia sobre café ----------
img, d = new(TINTA)
d.rectangle([90, 90, 990, 1830], outline=ORO, width=3)
d.rectangle([112, 112, 968, 1808], outline=ORO, width=1)
tracked(d, (170, 300), "FICHA DE CAMPO · No. 01", MONO(34), ORO, track=8)
dashed(d, 170, 372, 910, ORO, w=1, dash=10, gap=10)
lines2 = [("Mi tío llevaba", 0, PAPEL, 92), ("20 años en una", 0, PAPEL, 92), ("libreta.", 1, ORO, 92),
          ("", 0, PAPEL, 40),
          ("Un día se le", 0, PAPEL, 72), ("perdió.", 0, PAPEL, 72),
          ("", 0, PAPEL, 40),
          ("Por eso hicimos", 0, PAPEL, 72), ("ABONO.", 1, BARRO, 92)]
y = 520
for txt, it, col, sz in lines2:
    if txt: d.text((170, y), txt, font=(SERIF_I if it else SERIF)(sz), fill=col)
    y += sz + 18
dashed(d, 170, 1520, 910, ORO, w=1, dash=10, gap=10)
tracked(d, (170, 1590), "MICHOACAN · JITOMATE SALADET", MONO(34), MUTED2, track=4)
d.text((170, 1700), "ABONO", font=SERIF_I(52), fill=PAPEL)
tracked(d, (910, 1712), "DESLIZA →", MONO(30), ORO, track=4, anchor="ra")
img.save("slide2.png")

# ---------- SLIDE 3 — CTA con sello ----------
img, d = new(BARRO)
d.rectangle([70, 70, 1010, 1850], fill=PAPEL)
d.rectangle([104, 104, 976, 1816], outline=BARRO, width=4)
sello = Image.open("sello-trans.png").convert("RGBA").resize((560, 560))
img.paste(sello, (260, 150), sello)
d.line([(200, 820), (880, 820)], fill=TINTA, width=3)
d.text((540, 900), "La libreta digital", font=SERIF(76), fill=TINTA, anchor="ma")
d.text((540, 1000), "de tu invernadero.", font=SERIF_I(76), fill=BARRO, anchor="ma")
tracked(d, (540, 1170), "GASTOS · CORTES · VENTAS.", MONO(42), TINTA, track=2, anchor="ma")
d.text((540, 1240), "Te dice si ganaste.", font=MONO(42), fill=TINTA, anchor="ma")
d.rectangle([190, 1400, 890, 1520], fill=TINTA)
tracked(d, (540, 1432), "GRATIS · LINK EN BIO", MONO(40), PAPEL, track=3, anchor="ma")
d.line([(200, 1650), (880, 1650)], fill=TINTA, width=3)
d.text((200, 1700), "ABONO", font=SERIF_I(56), fill=TINTA)
tracked(d, (880, 1712), "SABE SI GANASTE.", MONO(30), BARRO, track=3, anchor="ra")
img.save("slide3.png")
print("Listo: slide1.png slide2.png slide3.png (1080x1920)")
