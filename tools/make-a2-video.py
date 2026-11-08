import asyncio
import os
import subprocess
from PIL import Image, ImageDraw, ImageFont

# 1. Generate Voice Audio via edge-tts (Indonesian neural voice)
VOICE = "id-ID-ArdiNeural"

SCRIPT_PARTS = [
    ("Ingin menggunakan AI di kantor? Mulai dari pekerjaan yang berulang.", 0, 5),
    ("Catat waktu yang dipakai, kesalahan yang sering muncul, dan siapa pengguna hasilnya.", 5, 17),
    ("Misalnya, merangkum pertanyaan klien dan menyiapkan draf jawaban untuk diperiksa staf.", 17, 29),
    ("Pilih satu pekerjaan, ukur kondisinya, lalu uji apakah otomasi membantu pengguna.", 29, 40)
]

FULL_TEXT = " ".join([p[0] for p in SCRIPT_PARTS])

os.makedirs("/home/zarr/Documents/proyek-msi/bukti/A2", exist_ok=True)
OUT_DIR = "/home/zarr/Documents/proyek-msi/bukti/A2"
AUDIO_PATH = os.path.join(OUT_DIR, "narasi.mp3")

async def gen_audio():
    import edge_tts
    communicate = edge_tts.Communicate(FULL_TEXT, VOICE, rate="-4%")
    await communicate.save(AUDIO_PATH)

asyncio.run(gen_audio())
print("Audio generated.")

# Get audio duration
res = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", AUDIO_PATH], capture_output=True, text=True)
audio_duration = float(res.stdout.strip())
print(f"Actual audio duration: {audio_duration:.2f}s")

# 2. Create vertical frames (1080x1920) for the 4 sections
def get_font(size, bold=False):
    style = "-Bold" if bold else ""
    return ImageFont.truetype(f"/usr/share/fonts/truetype/dejavu/DejaVuSans{style}.ttf", size)

def create_slide(title, subtitle, bullets, scene_num, total_scenes):
    W, H = 1080, 1920
    img = Image.new("RGB", (W, H), (18, 48, 90)) # Deep Navy
    draw = ImageDraw.Draw(img)
    
    # Top Banner: SIMULASI MSI Beyond
    draw.rectangle([0, 0, W, 100], fill=(201, 162, 39)) # Gold
    draw.text((W/2, 50), "SIMULASI TES PRAKTIK · MSI BEYOND", font=get_font(34, True), fill=(43, 33, 0), anchor="mm")
    
    # Category / Series Pill
    draw.rounded_rectangle([80, 160, 480, 230], radius=35, fill=(31, 95, 174))
    draw.text((280, 195), "AI & OTOMASI KANTOR", font=get_font(26, True), fill=(255, 255, 255), anchor="mm")
    
    # Scene Counter
    draw.text((W - 100, 195), f"{scene_num}/{total_scenes}", font=get_font(28, True), fill=(201, 162, 39), anchor="mm")
    
    # Main Header
    draw.text((80, 320), title, font=get_font(54, True), fill=(255, 255, 255))
    
    # Divider
    draw.line([80, 420, W - 80, 420], fill=(201, 162, 39), width=4)
    
    # Subtitle / Key Concept
    draw.text((80, 460), subtitle, font=get_font(36, False), fill=(210, 225, 245))
    
    # Content Card
    card_top = 580
    card_h = 750
    draw.rounded_rectangle([80, card_top, W - 80, card_top + card_h], radius=24, fill=(27, 65, 118), outline=(50, 110, 190), width=2)
    
    # Bullets
    y = card_top + 80
    for b in bullets:
        draw.text((120, y), "•", font=get_font(44, True), fill=(201, 162, 39))
        draw.text((170, y + 4), b, font=get_font(34, False), fill=(255, 255, 255))
        y += 120
        
    # Safe Margin Zone indicators & Disclaimer Footer
    draw.rectangle([0, H - 280, W, H], fill=(12, 32, 60))
    draw.text((W/2, H - 200), "Video simulasi latihan kandidat MSI Group.", font=get_font(26, False), fill=(180, 195, 215), anchor="mm")
    draw.text((W/2, H - 150), "Bukan kutipan resmi narasumber MSI nyata.", font=get_font(24, False), fill=(180, 195, 215), anchor="mm")
    
    return img

scenes = [
    ("Mulai dari Mana?", "Jangan langsung beli tool AI rumit.", 
     ["Fokus pada 1 pekerjaan berulang", "Pahami alur kerjanya dulu", "Identifikasi titik macet tim"], 1, 4),
    ("3 Hal Wajib Dicatat", "Ukur sebelum mengotomasi:",
     ["1. Waktu pengerjaan manual", "2. Kesalahan yang sering muncul", "3. Siapa pengguna hasilnya"], 2, 4),
    ("Contoh Nyata", "Otomasi layanan & draf:",
     ["Merangkum pertanyaan klien", "AI menyusun draf jawaban awal", "Staf memeriksa & menyetujui"], 3, 4),
    ("Evaluasi & Validasi", "Prinsip otomasi terukur:",
     ["Pilih 1 pekerjaan fokus", "Ukur kondisi awal vs sesudah", "Pastikan benar-benar membantu"], 4, 4)
]

for idx, sc in enumerate(scenes):
    img = create_slide(sc[0], sc[1], sc[2], sc[3], sc[4])
    img.save(os.path.join(OUT_DIR, f"slide_{idx+1}.png"))

print("Slides rendered.")

