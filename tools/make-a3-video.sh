#!/usr/bin/env bash
# Menyusun A3-D01 (video demo) dari screenshot berurutan hasil a3-walkthrough.js.
# Catatan jujur: ini rangkaian screenshot otomatis (slideshow), bukan rekaman layar real-time.
set -euo pipefail
cd "$(dirname "$0")/../bukti/A3"
python3 - <<'EOF'
from PIL import Image, ImageDraw, ImageFont
W,H=1280,800
img=Image.new('RGB',(W,H),(18,48,90))
d=ImageDraw.Draw(img)
def f(sz,b=False):
    return ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf'%('-Bold' if b else ''),sz)
d.rectangle([0,0,W,46],fill=(201,162,39))
d.text((W/2,23),'SIMULASI TES PRAKTIK MSI Group — data fiktif',font=f(20,True),fill=(43,33,0),anchor='mm')
d.text((W/2,300),'A3-D01 · Demo Aplikasi Penilaian Awards',font=f(44,True),fill='white',anchor='mm')
d.text((W/2,370),'input nilai → validasi → perhitungan → rekap → ekspor',font=f(26),fill=(220,228,240),anchor='mm')
d.text((W/2,470),'Skenario uji: data naskah · bobot 50/30/20 · bobot ≠ 100% · skor 6',font=f(22),fill=(201,162,39),anchor='mm')
d.text((W/2,505),'juri belum mengisi · penyimpanan gagal + coba ulang · ekspor = dashboard',font=f(22),fill=(201,162,39),anchor='mm')
d.text((W/2,720),'Rangkaian screenshot otomatis (Chrome headless + Puppeteer), bukan rekaman layar real-time',font=f(18),fill=(170,185,210),anchor='mm')
img.save('title.png')
EOF
LIST=concat.txt
: > "$LIST"
echo "file 'title.png'" >> "$LIST"; echo "duration 4" >> "$LIST"
for f in step-*.png; do echo "file '$f'" >> "$LIST"; echo "duration 4.5" >> "$LIST"; done
last=$(ls step-*.png | tail -1); echo "file '$last'" >> "$LIST"
ffmpeg -y -loglevel error -f concat -safe 0 -i "$LIST" -vf "fps=25,format=yuv420p" -c:v libx264 -crf 22 -movflags +faststart A3-D01-demo.mp4
rm -f "$LIST" title.png
ffprobe -v error -show_entries format=duration -of csv=p=0 A3-D01-demo.mp4

