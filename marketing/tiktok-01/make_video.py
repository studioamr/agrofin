#!/usr/bin/env python3
# Arma el primer TikTok de ABONO: 3 slides -> mp4 1080x1920 con zoom suave y cortes.
import imageio.v2 as imageio
import numpy as np
from PIL import Image

W, H, FPS = 1080, 1920, 30
SECS = 3.2          # segundos por slide
ZOOM = 0.06         # 6% de acercamiento a lo largo del slide
slides = ["slide1.png", "slide2.png", "slide3.png"]

writer = imageio.get_writer("tiktok-01.mp4", fps=FPS, codec="libx264",
                            quality=8, macro_block_size=1,
                            ffmpeg_params=["-pix_fmt", "yuv420p"])
n = int(SECS * FPS)
for path in slides:
    base = Image.open(path).convert("RGB")
    for i in range(n):
        t = i / (n - 1)
        scale = 1.0 + ZOOM * t                      # zoom in lento
        cw, ch = int(W / scale), int(H / scale)
        x = (W - cw) // 2
        y = (H - ch) // 2
        frame = base.crop((x, y, x + cw, y + ch)).resize((W, H), Image.LANCZOS)
        writer.append_data(np.asarray(frame))
writer.close()
print("Listo: tiktok-01.mp4  (%.1f s, %dx%d)" % (SECS * len(slides), W, H))
