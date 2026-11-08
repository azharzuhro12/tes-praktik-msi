#!/usr/bin/env python3
"""
Generator Video Animasi Motion-Graphics A2 (1080x1920, 30 fps, 32 detik = 960 frame).
SIMULASI TES PRAKTIK MSI Group — A2-V01.
"""
import math
import os
import subprocess
from PIL import Image, ImageDraw, ImageFont

OUT_DIR = "/home/zarr/Documents/proyek-msi/bukti/A2"
AUDIO_SYNC = os.path.join(OUT_DIR, "narasi_synced.mp3")
FINAL_MP4 = os.path.join(OUT_DIR, "A2-V01-video-vertikal.mp4")

W, H = 1080, 1920
FPS = 30
DURATION = 32.0
TOTAL_FRAMES = int(DURATION * FPS)

FONT_CACHE = {}
def fnt(size, bold=False):
    key = (int(size), bold)
    if key not in FONT_CACHE:
        style = "-Bold" if bold else ""
        FONT_CACHE[key] = ImageFont.truetype(f"/usr/share/fonts/truetype/dejavu/DejaVuSans{style}.ttf", int(size))
    return FONT_CACHE[key]

def clamp(x, a=0.0, b=1.0):
    return max(a, min(b, x))

def ease_out_cubic(t):
    t = clamp(t)
    return 1.0 - (1.0 - t) ** 3

def ease_out_back(t):
    t = clamp(t)
    c1 = 1.70158
    c3 = c1 + 1.0
    return 1.0 + c3 * ((t - 1.0) ** 3) + c1 * ((t - 1.0) ** 2)

def prog(t, start, dur):
    return clamp((t - start) / max(0.001, dur))

# Pre-render base background image (gradient + grid)
BG = Image.new("RGB", (W, H), (14, 34, 68))
bg_draw = ImageDraw.Draw(BG)
for y in range(H):
    r = int(12 + 10 * (y / H))
    g = int(28 + 22 * (y / H))
    b = int(58 + 38 * (y / H))
    bg_draw.line([(0, y), (W, y)], fill=(r, g, b))

# Subtle tech grid
for x in range(0, W, 90):
    bg_draw.line([(x, 100), (x, H - 240)], fill=(24, 54, 98), width=1)
for y in range(100, H - 240, 90):
    bg_draw.line([(0, y), (W, y)], fill=(24, 54, 98), width=1)

# Top Banner & Footer on BG
bg_draw.rectangle([0, 0, W, 96], fill=(201, 162, 39))
bg_draw.text((W / 2, 48), "SIMULASI TES PRAKTIK · MSI BEYOND", font=fnt(32, True), fill=(35, 26, 0), anchor="mm")
bg_draw.rectangle([0, H - 230, W, H], fill=(9, 22, 45))
bg_draw.text((W / 2, H - 155), "Video simulasi latihan kandidat MSI Group.", font=fnt(25, False), fill=(175, 192, 215), anchor="mm")
bg_draw.text((W / 2, H - 110), "Narasi adaptasi latihan — bukan kutipan narasumber MSI nyata.", font=fnt(23, False), fill=(150, 170, 195), anchor="mm")

SUBTITLES = [
    (0.0, 2.5, "Ingin menggunakan AI di kantor?", "Mulai dari pekerjaan yang berulang."),
    (2.5, 5.2, "Ingin menggunakan AI di kantor?", "Mulai dari pekerjaan yang berulang."),
    (5.2, 10.0, "Catat waktu yang dipakai, kesalahan", "yang sering muncul,"),
    (10.0, 15.0, "dan siapa pengguna", "hasilnya."),
    (15.0, 19.3, "Misalnya, merangkum pertanyaan klien", "dan menyiapkan draf jawaban"),
    (19.3, 23.5, "untuk diperiksa staf", "(Human-in-the-Loop)."),
    (23.5, 27.8, "Pilih satu pekerjaan, ukur kondisinya,", "lalu uji apakah otomasi"),
    (27.8, 32.0, "benar-benar membantu", "pengguna."),
]

def draw_gear(draw, cx, cy, r_outer, r_inner, teeth, angle_rad, color, outline_col):
    pts = []
    steps = teeth * 4
    for i in range(steps):
        a = angle_rad + (i * 2 * math.pi / steps)
        r = r_outer if (i % 4 in (0, 1)) else r_inner
        pts.append((cx + r * math.cos(a), cy + r * math.sin(a)))
    draw.polygon(pts, fill=color, outline=outline_col)
    draw.ellipse([cx - r_inner * 0.45, cy - r_inner * 0.45, cx + r_inner * 0.45, cy + r_inner * 0.45], fill=(18, 44, 84), outline=outline_col, width=3)

def draw_scene_1(draw, t):
    # Scene 1: 0.0 - 5.2s
    p_title = ease_out_cubic(prog(t, 0.0, 0.7))
    y_title = int(260 - (1 - p_title) * 60)
    draw.text((80, y_title), "Mulai Otomasi AI", font=fnt(56, True), fill=(255, 255, 255))
    draw.text((80, y_title + 70), "dari Pekerjaan Berulang", font=fnt(52, True), fill=(201, 162, 39))

    # Animated underline
    w_line = int((W - 160) * ease_out_cubic(prog(t, 0.3, 0.8)))
    if w_line > 0:
        draw.rectangle([80, y_title + 148, 80 + w_line, y_title + 154], fill=(201, 162, 39))

    # Central animated illustration: Rotating gears + repeating document stack
    cx, cy = W // 2, 760
    scale = ease_out_back(prog(t, 0.2, 0.7))
    if scale > 0.05:
        rad = int(190 * scale)
        draw.ellipse([cx - rad, cy - rad, cx + rad, cy + rad], fill=(22, 54, 102), outline=(56, 128, 220), width=4)
        draw_gear(draw, cx - 55, cy - 35, 85 * scale, 65 * scale, 8, t * 1.4, (31, 95, 174), (120, 185, 255))
        draw_gear(draw, cx + 65, cy + 45, 65 * scale, 48 * scale, 6, -t * 1.85, (201, 162, 39), (255, 225, 130))

    # Animated repeating task cards sliding in
    cards = [
        (0.9, "Tugas Harian #1 · Rekap Data", (32, 76, 142)),
        (1.6, "Tugas Harian #2 · Jawab FAQ Klien", (36, 86, 158)),
        (2.3, "Tugas Harian #3 · Susun Laporan", (42, 98, 176)),
    ]
    for idx, (st, label, col) in enumerate(cards):
        cp = ease_out_back(prog(t, st, 0.6))
        if cp > 0:
            x_off = int((1 - cp) * 350)
            y_box = 1010 + idx * 115
            draw.rounded_rectangle([110 + x_off, y_box, W - 110 + x_off, y_box + 92], radius=18, fill=col, outline=(100, 165, 245), width=2)
            # Loop icon
            draw.ellipse([135 + x_off, y_box + 22, 183 + x_off, y_box + 70], fill=(201, 162, 39))
            draw.text((159 + x_off, y_box + 46), "↻", font=fnt(34, True), fill=(30, 22, 0), anchor="mm")
            draw.text((210 + x_off, y_box + 46), label, font=fnt(32, True), fill=(255, 255, 255), anchor="lm")

def draw_scene_2(draw, t):
    # Scene 2: 5.2 - 15.0s
    lt = t - 5.2
    p_head = ease_out_cubic(prog(lt, 0.0, 0.6))
    draw.text((80, int(250 - (1 - p_head) * 40)), "3 Hal Wajib Dicatat", font=fnt(54, True), fill=(255, 255, 255))
    draw.text((80, int(320 - (1 - p_head) * 40)), "Ukur kondisi kerja sebelum memilih tools:", font=fnt(34, False), fill=(195, 215, 240))

    items = [
        (0.4, "1. Waktu yang Dipakai", "Berapa menit/jam habis untuk 1 siklus?", "clock", (28, 72, 134)),
        (3.0, "2. Kesalahan yang Sering Muncul", "Titik mana yang rawan salah ketik / terlewat?", "alert", (34, 82, 148)),
        (5.6, "3. Siapa Pengguna Hasilnya", "Staf, manajer, atau klien yang memakai output?", "user", (40, 92, 164)),
    ]

    for idx, (st, title, sub, kind, col) in enumerate(items):
        ip = ease_out_back(prog(lt, st, 0.65))
        if ip <= 0:
            continue
        y0 = 420 + idx * 290 + int((1 - ip) * 80)
        # Highlight active card
        is_active = (lt >= st) and (idx == 2 or lt < items[idx + 1][0])
        border_col = (201, 162, 39) if is_active else (75, 135, 215)
        border_w = 4 if is_active else 2
        draw.rounded_rectangle([80, y0, W - 80, y0 + 250], radius=24, fill=col, outline=border_col, width=border_w)

        # Animated Icon on Left
        icx, icy = 195, y0 + 125
        draw.ellipse([icx - 70, icy - 70, icx + 70, icy + 70], fill=(16, 40, 78), outline=border_col, width=3)

        if kind == "clock":
            # Rotating clock hands
            ang = lt * 3.0
            draw.line([icx, icy, icx + 42 * math.sin(ang), icy - 42 * math.cos(ang)], fill=(201, 162, 39), width=5)
            draw.line([icx, icy, icx + 26 * math.sin(ang * 0.2), icy - 26 * math.cos(ang * 0.2)], fill=(255, 255, 255), width=5)
            draw.ellipse([icx - 6, icy - 6, icx + 6, icy + 6], fill=(201, 162, 39))
        elif kind == "alert":
            pulse = 1.0 + 0.12 * math.sin(lt * 6.0)
            r_tri = int(46 * pulse)
            pts = [(icx, icy - r_tri), (icx - r_tri, icy + r_tri * 0.8), (icx + r_tri, icy + r_tri * 0.8)]
            draw.polygon(pts, fill=(201, 162, 39), outline=(255, 240, 180))
            draw.text((icx, icy + 8), "!", font=fnt(48, True), fill=(25, 20, 0), anchor="mm")
        elif kind == "user":
            draw.ellipse([icx - 24, icy - 42, icx + 24, icy + 6], fill=(120, 195, 255))
            draw.pieslice([icx - 46, icy + 10, icx + 46, icy + 80], 180, 360, fill=(120, 195, 255))

        draw.text((295, y0 + 82), title, font=fnt(34, True), fill=(255, 255, 255))
        draw.text((295, y0 + 142), sub, font=fnt(27, False), fill=(210, 228, 248))

def draw_scene_3(draw, t):
    # Scene 3: 15.0 - 23.5s (Animated Workflow Diagram)
    lt = t - 15.0
    draw.text((80, 250), "Contoh Alur Otomasi + Manusia", font=fnt(48, True), fill=(255, 255, 255))
    draw.text((80, 315), "AI membantu draf · Staf memegang keputusan akhir", font=fnt(31, False), fill=(201, 162, 39))

    nodes = [
        (0.2, "1. Pertanyaan Klien Masuk", "“Apakah harus sponsor? Berapa tarif paket?”", (28, 72, 134), "💬"),
        (2.4, "2. AI Merangkum & Menyusun Draf", "Mencari rujukan KB & membuat konsep balasan", (36, 88, 162), "🤖"),
        (4.8, "3. Diperiksa & Disetujui Staf", "Status: Menunggu Persetujuan → Aman Terkendali", (22, 108, 76), "✓"),
    ]

    for idx, (st, title, desc, col, badge) in enumerate(nodes):
        np = ease_out_back(prog(lt, st, 0.6))
        if np <= 0:
            continue
        y_box = 410 + idx * 295 + int((1 - np) * 60)

        # Draw animated connecting arrow from previous box
        if idx > 0:
            ap = ease_out_cubic(prog(lt, st - 0.3, 0.5))
            y_start = y_box - 75
            y_end = y_start + int(65 * ap)
            draw.line([W // 2, y_start, W // 2, y_end], fill=(201, 162, 39), width=6)
            if ap > 0.8:
                draw.polygon([(W // 2 - 14, y_end - 12), (W // 2 + 14, y_end - 12), (W // 2, y_end + 6)], fill=(201, 162, 39))

        draw.rounded_rectangle([90, y_box, W - 90, y_box + 210], radius=22, fill=col, outline=(120, 185, 255) if idx < 2 else (110, 230, 175), width=3)
        draw.ellipse([125, y_box + 55, 225, y_box + 155], fill=(14, 34, 68), outline=(201, 162, 39), width=3)
        draw.text((175, y_box + 105), str(idx + 1), font=fnt(44, True), fill=(201, 162, 39), anchor="mm")

        draw.text((255, y_box + 82), title, font=fnt(34, True), fill=(255, 255, 255))
        draw.text((255, y_box + 138), desc, font=fnt(26, False), fill=(220, 235, 250))

        # Animated scanning bar on node 2
        if idx == 1 and 2.8 <= lt <= 5.0:
            scan_x = 255 + int(580 * ((lt - 2.8) / 2.2))
            draw.rectangle([255, y_box + 178, min(W - 130, scan_x), y_box + 188], fill=(201, 162, 39))

        # Animated approval stamp on node 3
        if idx == 2 and lt >= 5.6:
            draw.rounded_rectangle([W - 350, y_box + 18, W - 115, y_box + 64], radius=12, fill=(201, 162, 39))
            draw.text((W - 232, y_box + 41), "WAJIB CEK STAF", font=fnt(21, True), fill=(30, 22, 0), anchor="mm")

def draw_scene_4(draw, t):
    # Scene 4: 23.5 - 32.0s (Animated Evaluation Chart & Checklist)
    lt = t - 23.5
    draw.text((80, 250), "Evaluasi & Validasi Manfaat", font=fnt(52, True), fill=(255, 255, 255))
    draw.text((80, 320), "Pastikan otomasi benar-benar membantu pengguna:", font=fnt(32, False), fill=(195, 215, 240))

    # Animated Before vs After Chart Card
    draw.rounded_rectangle([80, 400, W - 80, 880], radius=24, fill=(24, 58, 110), outline=(80, 145, 230), width=2)
    draw.text((130, 450), "Ilustrasi Pengukuran Durasi Kerja", font=fnt(32, True), fill=(201, 162, 39))

    # Before bar (120 mnt)
    p_b1 = ease_out_cubic(prog(lt, 0.4, 0.9))
    w_b1 = int(620 * p_b1)
    draw.text((130, 535), "Kondisi Awal (Manual)", font=fnt(28, False), fill=(220, 235, 250))
    draw.rounded_rectangle([130, 575, 130 + max(20, w_b1), 635], radius=12, fill=(115, 135, 165))
    if p_b1 > 0.5:
        draw.text((150 + w_b1, 605), "120 mnt", font=fnt(30, True), fill=(255, 255, 255), anchor="lm")

    # After bar (90 mnt - 25% faster)
    p_b2 = ease_out_cubic(prog(lt, 1.3, 1.0))
    w_b2 = int(465 * p_b2)
    draw.text((130, 685), "Setelah Uji Otomasi (-25%)", font=fnt(28, False), fill=(220, 235, 250))
    draw.rounded_rectangle([130, 725, 130 + max(20, w_b2), 785], radius=12, fill=(201, 162, 39))
    if p_b2 > 0.5:
        draw.text((150 + w_b2, 755), "90 mnt (Terukur)", font=fnt(30, True), fill=(201, 162, 39), anchor="lm")

    # 3 Animated Checklist steps
    steps = [
        (2.2, "Pilih satu pekerjaan berulang yang jelas"),
        (3.4, "Ukur waktu & kualitas sebelum vs sesudah"),
        (4.6, "Uji apakah benar-benar membantu pengguna"),
    ]
    for idx, (st, txt) in enumerate(steps):
        sp = ease_out_back(prog(lt, st, 0.5))
        if sp <= 0:
            continue
        y_item = 930 + idx * 115 + int((1 - sp) * 40)
        draw.rounded_rectangle([80, y_item, W - 80, y_item + 92], radius=18, fill=(28, 74, 136), outline=(90, 165, 245), width=2)
        draw.ellipse([108, y_item + 20, 160, y_item + 72], fill=(22, 135, 84))
        draw.text((134, y_item + 46), "✓", font=fnt(34, True), fill=(255, 255, 255), anchor="mm")
        draw.text((185, y_item + 46), txt, font=fnt(31, True), fill=(255, 255, 255), anchor="lm")

def draw_subtitle(draw, t):
    for st, et, l1, l2 in SUBTITLES:
        if st <= t <= et:
            # Smooth pop in at start of cue
            pop = ease_out_cubic(prog(t, st, 0.2))
            y_sub = int(1465 - (1 - pop) * 15)
            draw.rounded_rectangle([70, y_sub - 65, W - 70, y_sub + 95], radius=22, fill=(9, 22, 45), outline=(201, 162, 39), width=3)
            draw.text((W / 2, y_sub - 18), l1, font=fnt(36, True), fill=(255, 255, 255), anchor="mm")
            draw.text((W / 2, y_sub + 40), l2, font=fnt(36, True), fill=(201, 162, 39), anchor="mm")
            break

def render_frame(frame_idx):
    t = frame_idx / FPS
    img = BG.copy()
    draw = ImageDraw.Draw(img)

    # Animated floating accent particles
    for i in range(6):
        px = int((140 + i * 175 + math.sin(t * 0.8 + i) * 35) % W)
        py = int(150 + ((i * 230 - t * 28) % 1180))
        draw.ellipse([px - 4, py - 4, px + 4, py + 4], fill=(45, 95, 165))

    # Top progress bar below gold banner
    prog_w = int(W * (t / DURATION))
    draw.rectangle([0, 96, prog_w, 106], fill=(46, 144, 255))

    # Scene badge
    scene_idx = 1 if t < 5.2 else (2 if t < 15.0 else (3 if t < 23.5 else 4))
    draw.rounded_rectangle([80, 140, 490, 206], radius=33, fill=(31, 95, 174))
    draw.text((285, 173), "AI & OTOMASI KANTOR", font=fnt(25, True), fill=(255, 255, 255), anchor="mm")
    draw.rounded_rectangle([W - 210, 140, W - 80, 206], radius=33, fill=(22, 54, 102), outline=(201, 162, 39), width=2)
    draw.text((W - 145, 173), f"0{scene_idx} / 04", font=fnt(25, True), fill=(201, 162, 39), anchor="mm")

    if t < 5.2:
        draw_scene_1(draw, t)
    elif t < 15.0:
        draw_scene_2(draw, t)
    elif t < 23.5:
        draw_scene_3(draw, t)
    else:
        draw_scene_4(draw, t)

    draw_subtitle(draw, t)
    return img

def main():
    cmd = [
        "ffmpeg", "-y",
        "-f", "rawvideo", "-pix_fmt", "rgb24",
        "-s", f"{W}x{H}", "-r", str(FPS),
        "-i", "-",
        "-i", AUDIO_SYNC,
        "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "21", "-preset", "fast",
        "-c:a", "aac", "-b:a", "192k",
        "-t", str(DURATION),
        "-movflags", "+faststart",
        FINAL_MP4
    ]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE, stderr=subprocess.DEVNULL)
    for idx in range(TOTAL_FRAMES):
        frame = render_frame(idx)
        proc.stdin.write(frame.tobytes())
        if idx in (int(2.8 * FPS), int(8.5 * FPS), int(18.5 * FPS), int(27.0 * FPS)):
            # Save preview frame at 8.5s for A2-S01
            if idx == int(8.5 * FPS):
                frame.save(os.path.join(OUT_DIR, "A2-S01-preview-frame.png"))
    proc.stdin.close()
    proc.wait()
    if proc.returncode != 0:
        raise RuntimeError(f"FFmpeg exited with {proc.returncode}")
    # Remove old static slide PNGs so bukti/A2 is clean
    for i in range(1, 5):
        p = os.path.join(OUT_DIR, f"slide_{i}.png")
        if os.path.exists(p):
            os.remove(p)
    print("Animated A2 video rendered successfully:", FINAL_MP4)

if __name__ == "__main__":
    main()
