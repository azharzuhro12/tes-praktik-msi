import asyncio
import os
import subprocess
import edge_tts

OUT_DIR = "/home/zarr/Documents/proyek-msi/bukti/A2"
VOICE = "id-ID-ArdiNeural"

SEGMENTS = [
    ("seg1.mp3", "Ingin menggunakan AI di kantor? Mulai dari pekerjaan yang berulang.", 0),
    ("seg2.mp3", "Catat waktu yang dipakai, kesalahan yang sering muncul, dan siapa pengguna hasilnya.", 5200),
    ("seg3.mp3", "Misalnya, merangkum pertanyaan klien dan menyiapkan draf jawaban untuk diperiksa staf.", 15000),
    ("seg4.mp3", "Pilih satu pekerjaan, ukur kondisinya, lalu uji apakah otomasi membantu pengguna.", 23500),
]

async def gen_segments():
    for fname, text, _ in SEGMENTS:
        comm = edge_tts.Communicate(text, VOICE, rate="-5%")
        await comm.save(os.path.join(OUT_DIR, fname))

asyncio.run(gen_segments())

AUDIO_SYNC = os.path.join(OUT_DIR, "narasi_synced.mp3")
inputs = []
for fname, _, _ in SEGMENTS:
    inputs += ["-i", os.path.join(OUT_DIR, fname)]

filter_parts = []
for i, (_, _, delay_ms) in enumerate(SEGMENTS):
    filter_parts.append(f"[{i}:a]adelay={delay_ms}|{delay_ms}[a{i}]")
mix_inputs = "".join(f"[a{i}]" for i in range(len(SEGMENTS)))
filter_complex = ";".join(filter_parts) + f";{mix_inputs}amix=inputs={len(SEGMENTS)}:normalize=0,apad=whole_dur=32[outa]"

subprocess.run([
    "ffmpeg", "-y", *inputs,
    "-filter_complex", filter_complex,
    "-map", "[outa]", "-t", "32",
    AUDIO_SYNC
], check=True, stderr=subprocess.DEVNULL)

concat_file = os.path.join(OUT_DIR, "slides.txt")
with open(concat_file, "w") as f:
    f.write(f"file '{OUT_DIR}/slide_1.png'\nduration 5.2\n")
    f.write(f"file '{OUT_DIR}/slide_2.png'\nduration 9.8\n")
    f.write(f"file '{OUT_DIR}/slide_3.png'\nduration 8.5\n")
    f.write(f"file '{OUT_DIR}/slide_4.png'\nduration 8.5\n")
    f.write(f"file '{OUT_DIR}/slide_4.png'\n")

SRT_PATH = os.path.join(OUT_DIR, "A2-S01-subtitle.srt")
FINAL_MP4 = os.path.join(OUT_DIR, "A2-V01-video-vertikal.mp4")
sub_filter = f"subtitles={SRT_PATH}:force_style='Fontname=DejaVu Sans,Fontsize=9,PrimaryColour=&H00FFFFFF,BackColour=&H8012305A,OutlineColour=&H0012305A,BorderStyle=4,Outline=1,Shadow=0,MarginV=48,Alignment=2'"

subprocess.run([
    "ffmpeg", "-y",
    "-f", "concat", "-safe", "0", "-i", concat_file,
    "-i", AUDIO_SYNC,
    "-vf", f"fps=30,format=yuv420p,{sub_filter}",
    "-c:v", "libx264", "-crf", "22", "-preset", "medium",
    "-c:a", "aac", "-b:a", "192k",
    "-t", "32.0",
    "-movflags", "+faststart",
    FINAL_MP4
], check=True, stderr=subprocess.DEVNULL)

subprocess.run([
    "ffmpeg", "-y", "-ss", "00:00:07", "-i", FINAL_MP4,
    "-frames:v", "1", os.path.join(OUT_DIR, "A2-S01-preview-frame.png")
], check=True, stderr=subprocess.DEVNULL)

for fname, _, _ in SEGMENTS:
    p = os.path.join(OUT_DIR, fname)
    if os.path.exists(p): os.remove(p)

print("A2 video & preview frame updated with natural voice pacing.")
