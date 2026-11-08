# DOKUMEN PROSES DAN KELUARAN YOUTUBE A2
# Kode Bukti: A2-D01

## 1. Pilihan Bagian Sumber Acuan
- **Rentang Waktu Sumber**: Menit 00:25 – 00:55
- **Kutipan Sumber**:
  > "Mulailah dari satu pekerjaan yang berulang. Catat waktu yang dipakai, kesalahan yang sering muncul, dan siapa pengguna hasilnya."
- **Alasan Pemilihan**:
  Bagian ini memberikan langkah konkret, terukur, dan berorientasi pengguna sebelum organisasi tergesa-gesa membeli atau mengadopsi tools otomasi yang kompleks. Ini menekankan fondasi audit kerja manual terlebih dahulu.

---

## 2. Susunan Klip Video Vertikal (~32 Detik, Rasio 9:16)
Format: 1080 × 1920 piksel (9:16), aman dari tabrakan tombol antarmuka platform (TikTok, Reels, Shorts).

| Rentang Waktu | Visual (Slide) | Narasi Suara (TTS Neural / Voice) |
|---|---|---|
| **00:00 – 00:05** (5 dtk) | **Slide 1**: Pembuka SIMULASI MSI Beyond. Header: *Mulai dari Mana?* Subjudul: *Jangan langsung beli tool AI rumit*. | *"Ingin menggunakan AI di kantor? Mulai dari pekerjaan yang berulang."* |
| **00:05 – 00:15** (10 dtk) | **Slide 2**: Header: *3 Hal Wajib Dicatat*. Poin: 1. Waktu pengerjaan manual, 2. Kesalahan yang sering muncul, 3. Siapa pengguna hasilnya. | *"Catat waktu yang dipakai, kesalahan yang sering muncul, dan siapa pengguna hasilnya."* |
| **00:15 – 00:24** (9 dtk) | **Slide 3**: Header: *Contoh Nyata*. Poin: Merangkum pertanyaan klien, AI menyusun draf awal, staf memeriksa & menyetujui. | *"Misalnya, merangkum pertanyaan klien dan menyiapkan draf jawaban untuk diperiksa staf."* |
| **00:24 – 00:32** (8 dtk) | **Slide 4**: Header: *Evaluasi & Validasi*. Penutup: Pilih 1 pekerjaan fokus, ukur kondisi awal vs sesudah, pastikan membantu pengguna. | *"Pilih satu pekerjaan, ukur kondisinya, lalu uji apakah otomasi membantu pengguna."* |

*Catatan: Narasi diadaptasi untuk tujuan simulasi latihan. Contoh 'merangkum pertanyaan klien' merupakan ilustrasi alur kerja, bukan kutipan resmi narasumber.*

---

## 3. Metadata Publikasi YouTube / Shorts

### Judul:
`Mulai Otomasi AI dari Satu Pekerjaan Berulang | Simulasi MSI Beyond`

### Deskripsi:
```text
Mulailah otomasi dengan mencatat waktu pengerjaan, kesalahan yang sering muncul, dan pengguna hasilnya. 

Poin evaluasi penting sebelum menerapkan tools AI:
1. Pilih satu alur kerja manual yang sering berulang
2. Ukur durasi pengerjaan saat ini dan frekuensi error
3. Tentukan draf mana yang memerlukan persetujuan staf manusia (Human-in-the-Loop)
4. Validasi apakah solusi benar-benar meringankan beban pengguna

DISCLAIMER SIMULASI:
Video ini merupakan simulasi tes praktik kandidat MSI Group. Narasi diadaptasi dari naskah latihan simulasi, bukan merupakan pernyataan atau kutipan narasumber MSI nyata. Seluruh nama dan data bersifat fiktif untuk keperluan pengujian.

#SimulasiMSI #MSIBeyond #OtomasiAI #AIKantor #WorkflowAutomation #HumanInTheLoop
```

---

## 4. Alat AI & Kontribusi Pribadi (Penjelasan Sesuai Panduan)
- **Tools AI & Pemrograman yang Digunakan**:
  - `edge-tts` (Neural Indonesian voice `id-ID-ArdiNeural`) untuk sintesis vokal narator yang jernih dan disinkronkan per adegan.
  - Skrip animasi *motion-graphics* 30 fps (`tools/make-a2-anim.py` dengan Python + Pillow + fungsi *cubic/back easing*) untuk merender animasi roda gigi berputar, kartu *pop-in*, ikon jam/peringatan/pengguna yang bergerak, diagram alur *human-in-the-loop* yang tergambar bertahap, grafik batang komparasi yang tumbuh dinamis, serta *progress bar* dan *subtitle* animasi.
  - FFmpeg untuk *encoding* `rawvideo` 30 fps (`1080x1920`) dan penggabungan audio.
- **Koreksi Manual & Kontribusi Pribadi**:
  - Penyesuaian layout dan margin aman (safe area 280px bawah agar teks subtitle tidak tertutup caption/tombol likes TikTok/Shorts).
  - Penyusunan naskah narasi terukur dan sinkronisasi tepat milidetik pada berkas subtitle `.srt`.
  - Penambahan label jelas `SIMULASI TES PRAKTIK` di bagian atas dan disclaimer di bagian bawah frame.

