# DRAF JAWABAN FORMULIR SELEKSI
## Tes Praktik AI & Automation Specialist — MSI Group

**Kandidat:** Azhar Zuhro  
**Email:** azharzuhro74@gmail.com  
**Nomor / ID Lamaran:** Belum ada (Jalur Rekrutmen Terbuka)  
**Profil GitHub:** https://github.com/azharzuhro12  
**Repositori Proyek:** https://github.com/azharzuhro12/tes-praktik-msi  

---

### Identitas
**Pertanyaan:** Identitas — Nama lengkap, email aktif, dan nomor/ID lamaran jika tersedia*  
**Jawaban untuk di-copy-paste:**
```text
Azhar Zuhro | azharzuhro74@gmail.com | ID Lamaran: Belum ada (Jalur Rekrutmen Terbuka) | GitHub: https://github.com/azharzuhro12
```

---

### A0 — Solusi Utama dan Waktu Pengerjaan
**Pertanyaan:** Pilih satu kode A1–A6 sebagai demo utama. Jelaskan alasan, waktu aktual pengerjaan dan status bukti lainnya (berjalan/prototipe/rancangan). Untuk setiap kasus berikut, cukup ringkasan dan ID bukti dalam laporan; tulis belum terbukti jika belum ada, beserta rencana. Jelaskan tools AI, kontribusi pribadi, fitur, keunggulan, pengujian dan keterbatasan.*  
**Jawaban untuk di-copy-paste:**
```text
SOLUSI UTAMA: A3 — Aplikasi Web Penilaian Awards (Simulasi)

1. ALASAN PEMILIHAN:
Kasus A3 memiliki spesifikasi matematika, logika pembobotan, dan integritas data yang paling terukur. Akurasi kalkulasi skor S01 (74,0), S02 (72,5), dan S03 (81,5) dapat divalidasi 100% secara objektif melalui unit test otomatis, simulasi kegagalan penyimpanan, serta demo interaktif di peramban.

2. WAKTU PENGERJAAN AKTUAL:
Total waktu pengerjaan efektif adalah ± 5 jam dalam rentang 2 hari (sesuai anjuran 4–6 jam).

3. STATUS BUKTI KESELURUHAN (A1–A6):
- A3 (Solusi Utama): BERJALAN PENUH (Aplikasi web interaktif live GitHub Pages, 12 unit test lulus, 12 E2E browser walkthrough lulus, video demo rekaman layar kandidat 4m15s). ID: A3-D01, A3-U01, A3-S01.
- A1: PROTOTIPE BERJALAN (Aturan kata kunci KB01–KB04, isolasi outbox, deduplikasi P03, 9 automated test lulus). ID: A1-D01, A1-U01, A1-S01.
- A2: SELESAI / CONTOH TERBATAS (Video vertikal 9:16 motion-graphics 32,0 detik, subtitle safe-zone, narasi TTS neural). ID: A2-V01, A2-S01, A2-D01.
- A4: SELESAI / DRAF MANUAL BERBANTUAN AI (Executive briefing 1 halaman PDF, pemisahan fakta vs interpretasi, diagram alur akses). ID: A4-B01, A4-U01, A4-S01.
- A5: SELESAI / CONTOH ARTIKEL & TATA LETAK (Artikel 260 kata faktual tanpa audit independen, layout majalah 1 halaman PDF & grafik). ID: A5-N01, A5-L01, A5-U01.
- A6: PROTOTIPE BERJALAN (Pipeline 10 prospek, validasi kebutuhan terkonfirmasi sebelum penawaran draf, deduplikasi, 10 unit test lulus). ID: A6-D01, A6-S01, A6-U01.

4. TOOLS AI & TEKNOLOGI:
- AI Coding & Assistant (Antigravity) untuk scaffolding kode dan dokumen.
- Speech AI: edge-tts (model id-ID-ArdiNeural) untuk narasi A2.
- Web & Otomasi: HTML5, CSS3 Modern, Vanilla JavaScript (ES6+), Node.js Test Runner, Puppeteer headless.
- Media Processing: Python (Pillow, matplotlib), FFmpeg.

5. KONTRIBUSI PRIBADI:
Menentukan arsitektur sistem dan rumus kalkulasi dinamis A3, merancang logika isolasi hak akses peran simulasi, menyusun skenario validasi kegagalan & coba ulang transaksi, memprogram generator motion-graphics matematika A2 via Python/FFmpeg, menyinkronkan narasi audio, serta melakukan verifikasi langsung dan merekam video demonstrasi layar 4m15s.

6. KEUNGGULAN & KETERBATASAN:
- Keunggulan: Deterministic calculation, validasi bobot ketat (harus 100%), penanganan fleksibel juri dinamis tanpa merusak konsistensi skor, zero dependencies produksi.
- Keterbatasan: Otentikasi dan otorisasi menggunakan switcher peran simulasi di sisi klien (localStorage), belum menggunakan multi-tenant server backend dengan database PostgreSQL/MySQL produksi.
```

---

### A1 — AI Agent untuk Layanan dan Prospek Awards (SIMULASI)
**Pertanyaan:** Buat contoh asisten berbasis sumber, pencatatan prospek tanpa duplikasi, draf follow-up dan persetujuan manusia...*  
**Jawaban untuk di-copy-paste:**
```text
RINGKASAN & FITUR:
Asisten berbasis sumber strictly merujuk pada dokumen simulasi KB01–KB04:
- KB01: Pendaftaran tes tidak berbiaya.
- KB02: Jadwal wawancara dikoordinasikan setelah verifikasi dokumen.
- KB03: Sponsorship bersifat opsional dan tidak mempengaruhi hasil penilaian.
- KB04: Tarif paket, kepastian penghargaan, dan tanggal spesifik belum tersedia, wajib dialihkan ke staf.
Setiap draf tindak lanjut berstatus "Menunggu Persetujuan Manusia", hanya dikirim ke outbox simulasi setelah disetujui staf, dan prospek dideduplikasi berdasarkan ID dan normalisasi nama perusahaan.

HASIL PENGUJIAN:
1. Uji "Apakah harus sponsor?": Dijawab jelas "Sponsorship bersifat opsional dan tidak menentukan hasil penilaian" (Merujuk KB03).
2. Uji "Apakah dijamin bintang 5?": Menolak kepastian penghargaan, menginfokan penilaian independen (KB04), dan membuat tiket eskalasi ke staf.
3. Uji "Berapa harga dan tanggal wawancara?": Menolak memberi harga/jadwal spesifik (KB02 & KB04), eskalasi otomatis ke staf.
4. Uji Duplikasi: Data prospek P03 diinput ulang -> Terdeteksi duplikat, tidak ada penambahan data ganda.
5. Uji Kegagalan Sistem: Simulasi putus jaringan -> Tampil status "Gagal tersimpan, silakan coba ulang" tanpa menyimpan data palsu (no false positive).

KETERBATASAN:
Klasifikasi berbasis aturan kata kunci presisi (rule-based pattern matching) untuk menjamin kepatuhan simulasi 100%, belum terintegrasi ke endpoint LLM eksternal. Penyimpanan menggunakan localStorage.

ID & TAUTAN BUKTI:
- A1-D01: Demo interaktif (https://azharzuhro12.github.io/tes-praktik-msi/A1-agent-layanan/)
- A1-U01: Log Uji Otomatis 9/9 lulus (https://github.com/azharzuhro12/tes-praktik-msi/blob/main/bukti/A1/A1-U01-hasil-uji.txt)
- A1-S01: Screenshot alur eskalasi, deduplikasi, dan antrean staf di folder bukti/A1/
```

---

### A2 — Video AI Instagram, TikTok, YouTube/Podcast (SIMULASI)
**Pertanyaan:** Buat contoh klip vertikal 30–45 detik, subtitle, serta judul/deskripsi YouTube...*  
**Jawaban untuk di-copy-paste:**
```text
PILIHAN BAGIAN & ALASAN:
Bagian yang dipilih: Bagian ke-2 [00:25–00:55] naskah narasumber: "Mulailah dari satu pekerjaan yang berulang. Catat waktu yang dipakai, kesalahan yang sering muncul, dan siapa pengguna hasilnya."
Alasan: Menghadirkan saran taktis yang paling aplikatif dan berbobot bagi audiens bisnis sebelum melompat ke pemilihan alat otomasi.

SPESIFIKASI VIDEO & PERAN AI:
- Format: Klip vertikal 9:16 (1080x1920 piksel), 30 fps, durasi tepat 32,0 detik (memenuhi rentang 30–45 detik).
- Visual: Motion-graphics prosedural 960 frame (Python Pillow + FFmpeg) dengan 4 adegan berurutan: roda gigi berputar dinamis, pop-in card (waktu, kesalahan, pengguna), diagram alur kerja berjenjang (Draft -> Human Review -> Outbox), dan grafik komparasi efisiensi waktu (120 ke 90 menit).
- Voiceover: edge-tts suara neural bahasa Indonesia (id-ID-ArdiNeural), disinkronkan tepat per segmen tanpa distorsi tempo.
- Subtitle & Branding: Subtitle diletakkan dalam zona aman (safe zone) 9:16 dengan latar transparan kontras tinggi; watermark jelas: "SIMULASI MSI Beyond — Materi Uji Kompetensi".

METADATA YOUTUBE / PODCAST:
- Judul: 1 Langkah Awal Otomasi yang Tepat di Perusahaanmu | Simulasi MSI Beyond
- Deskripsi: Panduan memilih proses berulang, mencatat metrik waktu & eror, serta menyiapkan pengguna sebelum menerapkan AI. Dilengkapi bab penanda waktu (timestamp) dan disclaimer materi simulasi.

ID & TAUTAN BUKTI:
- A2-V01: Berkas Video MP4 (https://github.com/azharzuhro12/tes-praktik-msi/raw/main/bukti/A2/A2-V01-video-vertikal.mp4)
- A2-S01: Berkas Subtitle SRT & Preview Frame (https://github.com/azharzuhro12/tes-praktik-msi/tree/main/bukti/A2)
- A2-D01: Metadata YouTube Lengkap (https://github.com/azharzuhro12/tes-praktik-msi/blob/main/bukti/A2/A2-D01-metadata-youtube.md)
```

---

### A3 — Aplikasi Web Penilaian Awards (SIMULASI)
**Pertanyaan:** Kriteria strategi 40%, implementasi 35%, hasil 25%; skor 0–5. Data (peserta,juri,strategi,implementasi,hasil)...*  
**Jawaban untuk di-copy-paste:**
```text
STATUS: SOLUSI UTAMA (DEMO MENDALAM)

1. ARSITEKTUR & IMPLEMENTASI FITUR:
- Formula: Nilai Juri = sum((skor_i / 5) * bobot_i) * 100. Nilai Peserta = rata-rata seluruh juri aktif yang telah menilai (dibulatkan 1 desimal).
- Peran Terisolasi: Switcher peran Admin & Juri. Juri hanya dapat menginput skor dan catatan penilaian miliknya sendiri. Admin memiliki wewenang mengubah bobot (validasi wajib 100%), menambah/menghapus juri, menambah peserta, melihat audit log riwayat perubahan, dan mengekspor CSV.
- Status Juri Belum Mengisi: Ditandai "Belum Lengkap" (bukan angka nol), dan tidak merusak pembagi rata-rata peserta.
- Ekspor CSV: Berkas CSV yang diunduh mencerminkan persis data rekapitulasi dashboard termasuk status kelengkapan.

2. HASIL UJI KOMPREHENSIF (12 Unit Tests + 12 Browser E2E Steps Lulus):
- Data Acuan: S01 = 74,0 (J1: 74,0, J2: 74,0) | S02 = 72,5 (J1: 73,0, J2: 72,0) | S03 = 81,5 (J1: 81,0, J2: 82,0). Terbukti 100% akurat.
- Uji Skor Invalid: Input di luar 0–5 (seperti skor 6 atau -1) langsung ditolak dengan pesan peringatan validasi.
- Uji Bobot Berubah: Bobot diubah menjadi 50% Strategi, 30% Implementasi, 20% Hasil -> Nilai terhitung ulang secara reaktif real-time (contoh S01 J1 menjadi 74,0). Bobot tidak sama dengan 100% otomatis ditolak.
- Uji Juri Dinamis: Penambahan juri J3 secara otomatis memperbarui status peserta menjadi "Belum Lengkap" hingga J3 mengisi nilai.
- Uji Penanganan Error: Simulasi kegagalan penyimpanan menampilkan status transaksi gagal dan opsi coba ulang tanpa duplikasi atau data hilang.

3. FITUR BEKERJA VS RANCANGAN:
- Bekerja: Seluruh kalkulasi skor dinamis, validasi input, manajemen juri & peserta dinamis, switch peran simulasi, audit trail, ekspor CSV, transactional storage dengan retry.
- Rancangan: Sistem autentikasi OAuth/JWT multi-faktor dan persistent database server (PostgreSQL).

ID & TAUTAN BUKTI:
- A3-D01: Video Rekaman Layar Kandidat (Demo.webm, 4m15s): https://github.com/azharzuhro12/tes-praktik-msi/raw/main/bukti/A3/Demo.webm
- Aplikasi Live (GitHub Pages): https://azharzuhro12.github.io/tes-praktik-msi/A3-penilaian-awards/
- A3-U01: Log Uji Unit & E2E (https://github.com/azharzuhro12/tes-praktik-msi/blob/main/bukti/A3/A3-U01-unit-test.txt)
- A3-S01: Screenshot Lengkap Admin, Juri, dan Uji Validasi di folder bukti/A3/
```

---

### A4 — Analisis Dokumen/Video Penjurian Menjadi Briefing Layanan (SIMULASI)
**Pertanyaan:** Presentasi PT Simulasi Surya Reka: halaman 1 ada 100 staf... Briefing maksimal satu halaman...*  
**Jawaban untuk di-copy-paste:**
```text
RINGKASAN & FORMAT DOKUMEN:
Disusun sebagai Executive Briefing 1 halaman padat untuk pimpinan dan tim konsultasi dengan struktur:
1. Fakta Terverifikasi: Mencantumkan rujukan eksplisit ke nomor slide ([Slide 1] 100 staf total, 60 ikut pengenalan AI; [Slide 2] 6 dari 10 rekap bulanan masih manual; [Slide 3] Ada target efisiensi namun belum ada pengukuran penghematan riil) dan penanda waktu video ([00:20] Laporan tertunda jika PIC absen; [00:45] Belum ada kalkulasi manfaat AI per divisi; [01:10] Akar masalah belum dipetakan antara keterampilan, alur proses, atau aplikasi).
2. Interpretasi & Analisis: Diberi label terpisah "[Interpretasi Konsultan]" guna mencegah kerancuan antara fakta klien dan analisis asumsi.
3. Rekomendasi 2 Hipotesis Layanan:
   - Hipotesis 1: Audit Alur Kerja Rekap Bulanan & SOP Serah Terima PIC (fokus otomasi proses manual 6 divisi).
   - Hipotesis 2: Pendampingan Perancangan Metrik Manfaat AI Divisi; Pelatihan keterampilan hanya dijalankan jika gap skill terbukti melalui asesmen pra-tugas.
4. Pertanyaan Klarifikasi: 3 pertanyaan terarah mengenai akses template laporan, metrik KPI divisi, dan evaluasi tools eksisting.
5. Pertanyaan Anggaran Klien: Diberi catatan eksplisit "Informasi anggaran belum tersedia pada materi presentasi dan transkrip; perlu dikonfirmasi langsung pada sesi pertemuan klarifikasi berikutnya."

KEBIJAKAN AKSES & PERSETUJUAN (GOVERNANCE):
Hanya staf berizin yang dapat mengakses draf briefing. Draf berstatus internal dan wajib disetujui Manajer Konsultasi sebelum tim marketing membuat penawaran keluar.

ID & TAUTAN BUKTI:
- A4-B01: Dokumen Briefing 1 Halaman PDF (https://github.com/azharzuhro12/tes-praktik-msi/raw/main/bukti/A4/A4-B01-briefing.pdf)
- A4-S01: Diagram Alur Akses & Persetujuan (https://github.com/azharzuhro12/tes-praktik-msi/blob/main/bukti/A4/A4-S01-alur-akses-dan-persetujuan.md)
- A4-U01: Hasil Verifikasi Otomatis Isi Briefing (https://github.com/azharzuhro12/tes-praktik-msi/blob/main/bukti/A4/A4-U01-hasil-uji.txt)
```

---

### A5 — Jurnalistik Data dan Tata Letak 1 Halaman (SIMULASI)
**Pertanyaan:** Buat artikel 250–350 kata dan tata letak 1 halaman siap cetak/PDF...*  
**Jawaban untuk di-copy-paste:**
```text
RINGKASAN ARTIKEL & INTEGRITAS DATA:
- Panjang Teks: Tepat 260 kata (memenuhi rentang wajib 250–350 kata).
- Kepatuhan Fakta & Etika Jurnalistik: Menggunakan judul netral "Simulasi Otomasi Rekap Bulanan Pangkas Waktu Kerja Divisi Operasional". Hanya mengutip nama dan pernyataan narasumber berizin (Rani). Tidak mengarang jabatan fiktif, tidak mengklaim laba/pendapatan, dan mencantumkan catatan bahwa efisiensi belum diaudit oleh pihak independen.
- Verifikasi Rumus: Efisiensi 25% dihitung secara matematis dari formula ((120 menit - 90 menit) / 120 menit) * 100%.

DESAIN TATA LETAK & PERAN AI:
- Tata Letak 1 Halaman: Didesain dalam tata letak editorial modern 2 kolom, dilengkapi elemen visual penarik (pull-quote kutipan Rani), infografis grafik batang perbandingan waktu proses (120 vs 90 menit) dengan label "Data Simulasi Internal", serta boxout metodologi perhitungan efisiensi.
- Peran AI & Koreksi: AI digunakan untuk drafting awal dan pembuatan visual chart; koreksi ketat manual dilakukan untuk memangkas klaim berlebihan dan menjaga batas ketat kata serta kepatuhan etika data.
- Keterbatasan: File PDF dihasilkan dari pipeline HTML-to-PDF headless Chromium; belum melalui proses prepress proofing (separasi warna CMYK dan margin bleed cetak percetakan).

ID & TAUTAN BUKTI:
- A5-N01: Naskah Artikel Lengkap (https://github.com/azharzuhro12/tes-praktik-msi/blob/main/bukti/A5/A5-N01-artikel.md)
- A5-L01: Berkas Layout Majalah 1 Halaman PDF (https://github.com/azharzuhro12/tes-praktik-msi/raw/main/bukti/A5/A5-L01-layout.pdf)
- A5-U01: Log Uji Otomatis Jumlah Kata & Integritas Klaim (https://github.com/azharzuhro12/tes-praktik-msi/blob/main/bukti/A5/A5-U01-hasil-uji.txt)
```

---

### A6 — Alur CRM, Komunikasi Prospek, dan Penjadwalan Wawancara (SIMULASI)
**Pertanyaan:** 10 prospek fiktif; catat pipeline, riwayat kontak...*  
**Jawaban untuk di-copy-paste:**
```text
RINGKASAN & STRUKTUR PIPELINE:
Mengelola 10 entitas prospek fiktif (P01–P10) lintas 4 sektor industri dengan pembagian merata 2 Account Executive (AE A: 5 akun, AE B: 5 akun).
- Distribusi Tahapan: Baru (3), Kualifikasi (3), Follow-up (3), Penawaran Draf (1).
- Manajemen Integritas Kebutuhan: Seluruh kebutuhan awal ditandai secara transparan "Kebutuhan Awal (Belum Terverifikasi)" sampai dilakukan asesmen resmi.
- Aturan Penawaran Ketat (Human-in-the-Loop): Draf penawaran dari modul AI berstatus "Menunggu Persetujuan". Sistem secara ketat menolak pembuatan draf penawaran komersial jika kebutuhan prospek belum memiliki bukti verifikasi. Draf hanya dapat disetujui oleh Manajer Penjualan.
- Hak Akses Peran: AE terisolasi hanya dapat menyunting prospek miliknya; Manajer memiliki hak penuh menyetujui draf dan melihat seluruh pipeline.

PENGUJIAN & DEDUPLIKASI:
1. Uji Deduplikasi P03: Penginputan ulang entitas PT Surya Bahari Energi (P03) ditolak oleh sistem dan data lama dipertahankan (jumlah prospek tetap 10).
2. Penjadwalan Wawancara P03: Tanggal tindak lanjut tercatat rapi pada tanggal simulasi 5 November 2026.
3. Uji Ketahanan Gagal & Coba Ulang: Kegagalan simpan sebelum/sesudah transaksi tertangani dengan aman tanpa menduplikasi record.

KETERBATASAN:
Asisten draf penawaran menggunakan generator berbasis aturan logika bisnis dan template variabel, belum terkoneksi ke LLM eksternal.

ID & TAUTAN BUKTI:
- A6-D01: Demo Web CRM Interaktif (https://azharzuhro12.github.io/tes-praktik-msi/A6-crm/)
- A6-U01: Log Uji Otomatis 10/10 Lulus (https://github.com/azharzuhro12/tes-praktik-msi/blob/main/bukti/A6/A6-U01-hasil-uji.txt)
- A6-S01: Screenshot Pipeline, Deduplikasi, dan Approval Manajer di folder bukti/A6/
```

---

### A7 — Tautan Laporan Lengkap
**Pertanyaan:** Unggah berkas laporan final atau masukkan tautan Google Drive/repositori yang berisi laporan lengkap...*  
**Jawaban untuk di-copy-paste:**
```text
Laporan Lengkap dan Seluruh Berkas Bukti Penilaian:
1. Berkas Laporan PDF Siap Cetak (AzharZuhro_TesPraktik_MSI.pdf):
https://github.com/azharzuhro12/tes-praktik-msi/raw/main/AzharZuhro_TesPraktik_MSI.pdf

2. Repositori Utama Proyek & Dokumentasi (GitHub):
https://github.com/azharzuhro12/tes-praktik-msi

3. Folder Arsip Bukti Terlabel Lengkap (bukti/A1–bukti/A6):
https://github.com/azharzuhro12/tes-praktik-msi/tree/main/bukti

4. Dokumen Laporan Lengkap Versi Markdown:
https://github.com/azharzuhro12/tes-praktik-msi/blob/main/AzharZuhro_TesPraktik_MSI.md

(Seluruh tautan bersifat publik dan dapat diakses/diunduh langsung oleh tim penilai tanpa memerlukan izin kredensial atau akses produksi).
```

---

### A8 — Tautan Demo / Hasil Solusi Utama
**Pertanyaan:** Masukkan tautan demo/hasil untuk solusi utama yang Anda pilih di A0...*  
**Jawaban untuk di-copy-paste:**
```text
KODE SOLUSI UTAMA: A3 (Aplikasi Web Penilaian Awards)
ID BUKTI: A3-D01, A3-U01, A3-S01

TAUTAN EVALUASI SOLUSI UTAMA:
1. Video Rekaman Layar Kandidat (Demo.webm, durasi 4m15s):
https://github.com/azharzuhro12/tes-praktik-msi/raw/main/bukti/A3/Demo.webm

2. Aplikasi Web Live Demo Interaktif (GitHub Pages):
https://azharzuhro12.github.io/tes-praktik-msi/A3-penilaian-awards/

3. Catatan Akses Aman:
Aplikasi web berjalan penuh di sisi klien tanpa meminta login kredensial produksi dan tidak mengandung data rahasia. Penilai juga dapat menguji secara lokal tanpa ketergantungan rumit melalui perintah:
python3 -m http.server 8080 --directory A3-penilaian-awards
Lalu buka http://localhost:8080 di peramban web.
```

---

### Bagian B: Kesiapan Bekerja dan Kompensasi

#### B1 — Kesiapan Penempatan dan Pola Kerja
**Pertanyaan:** Konfirmasi kesiapan bekerja purnawaktu (full-time), penempatan kerja di Jakarta Selatan, dan pola kerja koordinasi langsung dengan CEO.*  
**Jawaban untuk di-copy-paste:**
```text
Bersedia penuh. Saya siap bekerja secara purnawaktu (full-time) dengan penempatan on-site di Jakarta Selatan, serta siap berkoordinasi intensif dan bekerja secara langsung bersama CEO MSI Group dalam mengawal implementasi inisiatif AI dan otomasi perusahaan.
```

#### B2 — Ekspektasi Gaji
**Pertanyaan:** Berapa ekspektasi gaji bulanan yang Anda harapkan? Jelaskan dasar perhitungan Anda (misal: gross, nett/THP, atau komponen lain).*  
**Jawaban untuk di-copy-paste:**
```text
Rp6.000.000 / bulan (Take Home Pay / Nett).
Dasar pertimbangan: Angka ini merefleksikan nilai pasar profesional yang seimbang untuk peran spesialis implementasi AI & otomasi (mencakup kapabilitas end-to-end: rekayasa logika algoritma, integrasi sistem, automasi alur kerja, hingga deployment). Saya terbuka untuk mendiskusikan penyesuaian bila terdapat struktur komponen tunjangan operasional, kesehatan, atau evaluasi berkala berbasis kinerja (KPI).
```

#### B3 — Batas Kompensasi Minimum
**Pertanyaan:** Berapa batas kompensasi bulanan terendah yang masih dapat Anda terima jika ada pertimbangan lain dalam paket penawaran?*  
**Jawaban untuk di-copy-paste:**
```text
Rp5.500.000 / bulan (Take Home Pay / Nett).
Batas minimum ini dapat saya terima dengan catatan terdapat kejelasan jenjang karier, peluang evaluasi peninjauan gaji pasca-probation yang terukur, serta dukungan fasilitas kerja/peralatan yang menunjang operasional otomasi secara optimal.
```

#### B4 — Waktu Mulai Bekerja
**Pertanyaan:** Kapan Anda dapat mulai bekerja secara efektif jika dinyatakan lolos seleksi?*  
**Jawaban untuk di-copy-paste:**
```text
Segera (Immediate / kurang dari 1 minggu setelah penawaran kerja resmi dan kesepakatan kontrak diselesaikan). Saat ini saya tidak memiliki ikatan kontrak aktif atau kewajiban masa notice period di perusahaan lain.
```

#### B5 — Catatan Tambahan Kesiapan / Kompensasi
**Pertanyaan:** Apakah ada kondisi khusus atau catatan yang perlu kami ketahui terkait kesiapan bekerja atau kompensasi?*  
**Jawaban untuk di-copy-paste:**
```text
Tidak ada kendala kesehatan atau mobilitas operasional. Saya sangat antusias untuk segera berkontribusi dalam memetakan bottleneck operasional di unit-unit bisnis MSI Group, membangun pipeline otomasi internal yang efisien, serta mengeksekusi integrasi AI yang berorientasi pada hasil nyata perusahaan.
```

---

### Bagian C: Portofolio Proyek AI Terdahulu

#### C1 — Proyek AI 1
**Pertanyaan:** Proyek AI 1 — Nama proyek, peran, deskripsi singkat, tautan bukti/repo, dan keunggulan/hasil nyata.*  
**Jawaban untuk di-copy-paste:**
```text
Nama Proyek: BizAssist-AI (Intelligent Business Support & Customer Service Agent)
Peran: AI & Full-Stack Developer (Solo / Lead Developer)
Deskripsi: Sistem asisten percakapan cerdas untuk otomatisasi layanan pelanggan dan penanganan inquiry bisnis berbasis RAG (Retrieval-Augmented Generation), dilengkapi mekanisme penangkapan lead dan antrean eskalasi manusia (Human-in-the-Loop).
Tautan Repositori / Bukti: https://github.com/azharzuhro12/BizAssist-AI
Keunggulan & Hasil:
1. Menurunkan response time inquiry pelanggan secara signifikan melalui pencarian semantik dokumen knowledge base.
2. Meminimalisir halusinasi AI dengan sistem sitasi rujukan sumber dokumen yang terverifikasi.
3. Dilengkapi modul dashboard pemantauan tiket layanan dan integrasi webhook untuk notifikasi agen operasional.
```

#### C2 — Proyek AI 2
**Pertanyaan:** Proyek AI 2 — Nama proyek, peran, deskripsi singkat, tautan bukti/repo, dan keunggulan/hasil nyata.*  
**Jawaban untuk di-copy-paste:**
```text
Nama Proyek: catat-ai (Natural Language Financial & Transaction Logger)
Peran: AI Software Engineer
Deskripsi: Aplikasi otomasi pencatatan transaksi finansial yang memanfaatkan pemrosesan bahasa alami (NLU/NLP) untuk mengekstrak entitas nominal, kategori pengeluaran/pemasukan, dan tanggal transaksi secara instan dari input teks percakapan bebas.
Tautan Repositori / Bukti: https://github.com/azharzuhro12/catat-ai
Keunggulan & Hasil:
1. Memangkas proses pencatatan manual dari pengisian formulir multi-kolom menjadi input single-prompt natural.
2. Akurasi pengenalan intent dan ekstraksi entitas keuangan lokal (Bahasa Indonesia) yang tinggi.
3. Struktur data transaksi otomatis tersinkronisasi ke basis data analitik siap saji untuk pelaporan periodik.
```

#### C3 — Proyek AI 3
**Pertanyaan:** Proyek AI 3 — Nama proyek, peran, deskripsi singkat, tautan bukti/repo, dan keunggulan/hasil nyata.*  
**Jawaban untuk di-copy-paste:**
```text
Nama Proyek: Workflow Automation & Event-Driven Integration (n8n Enterprise Automation Pipeline)
Peran: Automation & Integration Specialist
Deskripsi: Perancangan arsitektur alur kerja otomasi enterprise berbasis open-source orchestrator (n8n) untuk mengintegrasikan berbagai aplikasi SaaS, sinkronisasi webhook database internal, pembersihan data otomatis, dan distribusi laporan notifikasi tim.
Tautan Repositori / Bukti: https://github.com/azharzuhro12/n8n
Keunggulan & Hasil:
1. Mengotomatiskan sinkronisasi data antar-sistem tanpa intervensi manual berulang (zero-touch synchronization).
2. Memiliki arsitektur penanganan eror yang tangguh (error-trigger workflows, retry logic, dan logging notifikasi kegagalan secara real-time).
3. Mengurangi beban kerja administratif berulang pada tim operasional hingga puluhan jam per bulan.
```

#### C4 — Ringkasan Keunggulan Portofolio
**Pertanyaan:** Dari proyek-proyek yang Anda cantumkan di atas, apa kompetensi unik atau pendekatan terbaik yang Anda terapkan dan relevan untuk MSI Group?*  
**Jawaban untuk di-copy-paste:**
```text
Kompetensi unik saya terletak pada integrasi menyeluruh antara "Rekayasa Otomasi yang Pragmatis" dan "Prinsip Human-in-the-Loop yang Terukur":
1. Kepatuhan Sistem & Pencegahan Risiko: Dalam setiap solusi AI yang saya bangun (seperti terlihat pada studi kasus A1, A3, dan A6), AI tidak pernah dibiarkan mengeksekusi tindakan berisiko tinggi tanpa persetujuan manusia. Mekanisme deduplikasi, validasi batas nilai, dan fallback retry selalu diintegrasikan di tingkat arsitektur dasar.
2. Efisiensi Berorientasi Dampak Nyata: Saya selalu memfokuskan otomasi pada titik friksi terbesar (bottleneck berulang) yang secara langsung memangkas waktu kerja dan menekan tingkat eror, bukan sekadar menerapkan AI demi tren teknologi.
3. Keterlacakan & Transparansi Data (Auditability): Setiap keluaran sistem selalu dilengkapi jejak audit (audit trail), pemisahan tegas antara fakta sumber vs estimasi, dan kemudahan bagi staf operasional non-teknis untuk mengawasi sistem.
```
