#!/usr/bin/env python3
# ABONO · lote de 3 TikToks agro-editorial (ticket / ficha / sello) -> mp4 1080x1920 con zoom.
import os, numpy as np, imageio.v2 as imageio
from PIL import Image, ImageDraw, ImageFont
HERE=os.path.dirname(os.path.abspath(__file__)); OUT=os.path.join(HERE,'tiktok-lote'); os.makedirs(OUT,exist_ok=True)
W,H,FPS=1080,1920,30
CREMA,PAPEL,TINTA=(242,234,217),(251,246,234),(46,32,20)
BARRO,ORO,MUT=(180,74,36),(217,160,63),(138,122,99)
F='/System/Library/Fonts/Supplemental/'
SER =lambda s:ImageFont.truetype(F+'Georgia Bold.ttf',s)
SERI=lambda s:ImageFont.truetype(F+'Georgia Bold Italic.ttf',s)
MON =lambda s:ImageFont.truetype(F+'Courier New Bold.ttf',s)
SELLO=Image.open(os.path.join(HERE,'tiktok-01','sello-trans.png')).convert('RGBA')

def trk(d,xy,t,f,fill,tr,anchor='la'):
    ws=[d.textlength(c,font=f) for c in t]; tot=sum(ws)+tr*(len(t)-1); x,y=xy
    if anchor.startswith('m'):x-=tot/2
    elif anchor.startswith('r'):x-=tot
    for c,w in zip(t,ws): d.text((x,y),c,font=f,fill=fill); x+=w+tr
def dash(d,x1,y,x2,fill,w=3,da=20,ga=13):
    x=x1
    while x<x2: d.line([(x,y),(min(x+da,x2),y)],fill=fill,width=w); x+=da+ga

def ticket(eb,folio,big,sub):   # big=[(txt,italic,color)], sub=[str]
    im=Image.new('RGB',(W,H),CREMA); d=ImageDraw.Draw(im)
    d.rectangle([120,300,960,1620],fill=PAPEL,outline=TINTA,width=4)
    dash(d,120,302,960,TINTA,10,24,15); dash(d,120,1618,960,TINTA,10,24,15)
    trk(d,(540,392),eb,MON(38),TINTA,8,'ma')
    if folio: trk(d,(540,462),folio,MON(28),MUT,6,'ma')
    dash(d,200,556,880,TINTA,2,12,10)
    y=680
    for txt,it,col in big: d.text((200,y),txt,font=(SERI if it else SER)(96),fill=col); y+=118
    dash(d,200,y+20,880,TINTA,2,12,10); y+=90
    for s in sub: d.text((200,y),s,font=MON(38),fill=TINTA); y+=58
    d.text((200,1500),'ABONO',font=SERI(56),fill=TINTA)
    trk(d,(880,1512),'SABE SI GANASTE.',MON(30),BARRO,4,'ra')
    return im

def numslide(eb,rows,big_lbl,big_val,sub):  # rows=[(label,val)] mono ledger
    im=Image.new('RGB',(W,H),CREMA); d=ImageDraw.Draw(im)
    d.rectangle([120,300,960,1620],fill=PAPEL,outline=TINTA,width=4)
    dash(d,120,302,960,TINTA,10,24,15); dash(d,120,1618,960,TINTA,10,24,15)
    trk(d,(540,392),eb,MON(38),TINTA,8,'ma'); dash(d,200,470,880,TINTA,2,12,10)
    y=560
    for lbl,val in rows:
        d.text((200,y),lbl,font=MON(44),fill=TINTA)
        trk(d,(880,y),val,MON(44),(TINTA if not val.startswith('−') else BARRO),0,'ra'); y+=76
    dash(d,200,y+16,880,TINTA,3,14,10); y+=70
    d.text((540,y+120),big_val,font=SER(190),fill=BARRO,anchor='ma')
    trk(d,(540,y+325),big_lbl,MON(40),TINTA,8,'ma')
    yy=1360
    for s in sub: trk(d,(540,yy),s,MON(36),MUT,3,'ma'); yy+=54
    d.text((200,1500),'ABONO',font=SERI(56),fill=TINTA)
    trk(d,(880,1512),'SABE SI GANASTE.',MON(30),BARRO,4,'ra')
    return im

def cta(big,sub2):  # big=[(txt,italic)]
    im=Image.new('RGB',(W,H),BARRO); d=ImageDraw.Draw(im)
    d.rectangle([70,70,1010,1850],fill=PAPEL); d.rectangle([104,104,976,1816],outline=BARRO,width=4)
    s=SELLO.resize((520,520)); im.paste(s,(280,180),s)
    d.line([(200,800),(880,800)],fill=TINTA,width=3); y=900
    for txt,it in big: d.text((540,y),txt,font=(SERI if it else SER)(74),fill=(BARRO if it else TINTA),anchor='ma'); y+=96
    trk(d,(540,y+40),sub2,MON(40),TINTA,2,'ma')
    d.rectangle([190,1560,890,1680],fill=TINTA)
    trk(d,(540,1600),'GRATIS · LINK EN BIO',MON(40),PAPEL,3,'ma')
    d.text((200,1740),'ABONO',font=SERI(52),fill=TINTA)
    trk(d,(880,1752),'SABE SI GANASTE.',MON(28),BARRO,3,'ra')
    return im

def render(slides,name,secs=3.3,zoom=0.06):
    w=imageio.get_writer(os.path.join(OUT,name+'.mp4'),fps=FPS,codec='libx264',quality=8,macro_block_size=1,ffmpeg_params=['-pix_fmt','yuv420p'])
    n=int(secs*FPS)
    for im in slides:
        for i in range(n):
            t=i/(n-1); sc=1+zoom*t; cw,ch=int(W/sc),int(H/sc)
            fr=im.crop(((W-cw)//2,(H-ch)//2,(W-cw)//2+cw,(H-ch)//2+ch)).resize((W,H),Image.LANCZOS)
            w.append_data(np.asarray(fr))
    w.close(); print('lote:',name,f'{secs*len(slides):.1f}s')

# ---- VIDEO 02 · EL KILO ----
render([
 ticket('ABONO · BÁSCULA DE DATOS','FOLIO 0002',
    [('¿En cuánto',0,TINTA),('te sale',0,TINTA),('producir un',0,TINTA),('kilo?',1,BARRO)],
    ['SI NO LO SABES,','NO SABES SI GANAS.']),
 numslide('TU COSTO REAL',[],'POR KILO','$8.40',['SI LO VENDES A $7…','PIERDES EN CADA KILO.']),
 cta([('ABONO te saca tu',0),('costo por kilo.',1),('Solo, sin calculadora.',0)],'')
],'abono-02-el-kilo')

# ---- VIDEO 03 · ¿QUIÉN TE DEBE? ----
render([
 ticket('ABONO · CLIENTES','FOLIO 0003',
    [('¿Te deben de',0,TINTA),('la cosecha',0,TINTA),('pasada?',1,BARRO)],
    ['¿TE ACUERDAS DE','CUÁNTO Y DE QUIÉN?']),
 numslide('POR COBRAR',[('BODEGA CENTRAL','$4,940'),('DON BETO','$1,200'),('LA CENTRAL','$3,180')],'TE DEBEN','$9,320',['ABONO LLEVA CADA ABONO.']),
 cta([('Se acabaron los',0),('papelitos.',1),('Ve quién te debe.',0)],'')
],'abono-03-quien-te-debe')

# ---- VIDEO 04 · EL CICLO ----
render([
 ticket('ABONO · CIERRE DE CICLO','FOLIO 0004',
    [('Este ciclo…',0,TINTA),('¿ganaste o',0,TINTA),('perdiste?',1,BARRO)],
    ['LA LIBRETA NO TE','LO DICE. ABONO SÍ.']),
 numslide('CIERRE DEL CICLO',[('VENTAS','$37,920'),('GASTOS','−$17,120')],'DE GANANCIA','$20,800',['VENTAS − GASTOS. CLARO.']),
 cta([('ABONO suma tu ciclo',0),('completo.',1),('Sabe si ganaste.',0)],'')
],'abono-04-el-ciclo')
print('LOTE LISTO')
