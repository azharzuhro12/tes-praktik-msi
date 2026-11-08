# DRAF JAWABAN FORM — Tes Praktik AI & Automation Specialist MSI Group

> Tanda **[ISI: ...]** = data pribadi/fakta yang hanya Anda yang tahu. JANGAN dikirim sebelum semua tanda itu diganti.
> Tautan **[URL ...]** = baru ada setelah berkas diunggah (lihat panduan di bawah).

---

## Identitas
**Azhar Zuhro**, azharzuhro74@gmail.com, **[ISI: nomor/ID lamaran, atau "belum ada"]**
GitHub: https://github.com/azharzuhro12

---

## A0 — Solusi utama dan waktu pengerjaan
**Solusi utama: A3 (Aplikasi web penilaian awards).**
Alasan: rumus dan aturan validasinya eksplisit, jadi hasilnya bisa diuji otomatis dan didemokan mendalam. Angka acuan S01 = 74,0, S02 = 72,5, S03 = 81,5 terbukti cocok.

Waktu aktual: **[ISI: jam sebenarnya, mis. "± 5 jam dalam 2 hari"]**.

Status bukti:
| Kode | Status | Catatan |
|---|---|---|
| A3 | **Berjalan** (demo lokal) | 12 uji unit + 12 uji E2E peramban lulus |
| A1 | **Prototipe berjalan** | 9 uji otomatis lulus; klasifikasi pakai aturan kata kunci, belum LLM |
| A6 | **Prototipe berjalan** | 10 uji otomatis lulus; asisten "AI" berupa templat aturan, belum LLM |
| A2 | **Contoh terbatas** | 1 klip ~32 dtk dari slide + suara sintetis |
| A4 | **Contoh manual berbantuan AI** | Briefing 1 halaman; **tidak ada otomasi ekstraksi** |
| A5 | **Contoh terbatas** | Artikel 260 kata + layout 1 halaman; **bukan berkas siap cetak** |

Tools AI: asisten pemrograman AI (Antigravity) untuk menulis kode, uji, dan dokumen. edge-tts (suara neural `id-ID-ArdiNeural`) untuk narasi A2. Selain itu Node.js, Puppeteer/Chrome headless, FFmpeg, Pillow, matplotlib.
Kontribusi pribadi: **[ISI jujur: apa yang Anda sendiri putuskan/periksa/ubah. Jangan klaim semua dikerjakan sendiri bila sebagian besar dibuat AI.]**

---

## A1 — AI agent layanan & prospek
**Ringkasan:** Asisten menjawab hanya dari teks KB01–KB04 dan mencantumkan rujukan. Di luar KB atau soal tarif/jaminan/jadwal spesifik, pertanyaan masuk antrean staf. Prospek dideduplikasi (ID dan nama perusahaan yang dinormalisasi). Draf follow-up berstatus *Menunggu persetujuan*, tidak bisa "dikirim" sebelum staf menyetujui, dan "kirim" hanya ke outbox simulasi.

**Hasil uji:**
- "Apakah harus sponsor?" → sponsorship opsional, rujukan **KB03**.
- "Dijamin bintang 5?" → tidak dapat menjanjikan, rujukan **KB04**, diteruskan ke staf.
- "Harga dan tanggal wawancara?" → belum tersedia, rujukan **KB02 + KB04**, perlu staf.
- P03 dimasukkan dua kali → 1 prospek tersimpan.
- Database gagal → pesan "BELUM tersimpan" + tombol coba ulang; tidak ada sukses palsu; coba ulang tidak menggandakan data.

**Keterbatasan:** klasifikasi pakai aturan kata kunci (bukan LLM) sehingga kalimat yang sangat berbeda dari pola bisa jatuh ke "di luar KB", yang aman karena diteruskan ke staf. Penyimpanan hanya localStorage.
**Bukti:** A1-D01 (aplikasi), A1-U01 (`tests/agent.test.js`), A1-S01 (screenshot).

## A2 — Video AI
**Bagian dipilih:** 00:25–00:55 ("Mulailah dari satu pekerjaan yang berulang…"). Alasannya, memberi langkah konkret sebelum memilih tools.
**Hasil:** klip animasi *motion-graphics* 9:16 (1080×1920, 30 fps), 32,0 dtk, 4 adegan bergerak (roda gigi berputar, ikon jam/peringatan/pengguna dengan animasi *pop-in*, diagram alur *human-in-the-loop* bertahap, dan grafik batang komparasi yang tumbuh dinamis), subtitle animasi di zona aman, label "SIMULASI MSI Beyond", serta judul dan deskripsi YouTube siap pakai.
**Peran AI & pemrograman:** suara sintetis (`edge-tts` `id-ID-ArdiNeural`), animasi 960 frame dirender dengan skrip Python + Pillow (`tools/make-a2-anim.py`, kurva *cubic/back easing*) yang dipipakan ke FFmpeg. **Koreksi manual:** tiap segmen suara disinkronkan per adegan (0 dtk, 5,2 dtk, 15,0 dtk, 23,5 dtk) tanpa distorsi tempo dan kotak subtitle ditempatkan di area aman bawah.
**Catatan pemeriksaan:** **[ISI setelah Anda menonton `bukti/A2/A2-V01-video-vertikal.mp4`: pastikan animasi, suara & subtitle sudah pas]**. Tidak ada musik latar.
**Bukti:** A2-V01 (`A2-V01-video-vertikal.mp4`), A2-S01 (`A2-S01-subtitle.srt` & `A2-S01-preview-frame.png`), A2-D01 (`A2-D01-metadata-youtube.md`).

## A3 — Aplikasi penilaian (solusi utama)
**Ringkasan:** HTML/CSS/JS murni + localStorage. Peran Admin/Juri berupa **pemilih peran simulasi, bukan autentikasi produksi**. Juri hanya bisa mengubah penilaiannya sendiri; admin mengelola bobot, peserta, dan juri (bisa ditambah/dikurangi, minimal 1) serta rekap dan ekspor. Fitur lain: catatan juri, validasi skor, riwayat perubahan, dan ekspor CSV.
**Hasil uji:** S01 74,0 / S02 72,5 / S03 81,5 cocok; skor 6 ditolak (pesan rentang 0–5); J2 kosong → "Belum lengkap", bukan nol; bobot 50/30/20 → S01 J1 jadi 74,0; total bobot ≠ 100% ditolak; ekspor = dashboard; gagal simpan → pesan + coba ulang tanpa sukses palsu; tambah/hapus juri otomatis menyesuaikan rata-rata.
**Bekerja vs rancangan:** *Bekerja* = semua di atas (12 uji unit + 12 uji E2E lulus). *Rancangan* = login/otentikasi nyata, database server, hak akses di sisi server.
**Bukti:** A3-D01 (`bukti/A3/Demo.webm` — rekaman layar demo langsung 4 menit 15 detik), A3-U01 (`A3-U01-unit-test.txt` & `A3-U01-e2e.txt`), A3-S01 (`A3-S01-*.png`).

## A4 — Briefing
**Ringkasan:** Briefing 1 halaman: fakta bersumber halaman/timestamp, interpretasi dipisah dan berlabel, dua hipotesis layanan (asesmen proses & otomasi; pendampingan ukur manfaat AI, pelatihan hanya jika skill gap terkonfirmasi), tiga pertanyaan klarifikasi. Pertanyaan anggaran dijawab "belum tersedia pada dokumen/transkrip".
**Kerahasiaan/verifikasi/persetujuan:** hanya dokumen berizin; setiap fakta dicek ke halaman/timestamp; keluaran berstatus draf internal, ditinjau manajemen sebelum marketing menyusun apa pun; tidak ada penawaran yang dikirim.
**Keterbatasan:** ini **contoh manual berbantuan AI**; belum ada alur otomatis membaca dokumen/video. Uji A4-U01 memeriksa **isi berkas briefing** (fakta/rujukan ada), bukan akurasi otomatisasi.
**Bukti:** A4-B01, A4-U01, A4-S01.

## A5 — Artikel & layout
**Ringkasan:** Artikel 260 kata, hanya memakai fakta dan kutipan Rani yang diizinkan. Tidak ada jabatan/penghargaan/pendapatan/laba yang dikarang; ditegaskan belum ada audit independen. 25% = (120−90)÷120. Layout 1 halaman: dua kolom, pull-quote, grafik 120→90 dengan sumber "Data simulasi".
**Peran AI:** draf artikel dan grafik. Pemeriksaan klaim dilakukan lewat skrip dan baca ulang. Kredit aset: grafik dibuat sendiri (matplotlib), tanpa aset pihak ketiga.
**Keterbatasan:** layout berupa HTML→PDF, **bukan berkas siap produksi**; bleed, CMYK, proof cetak belum diuji; perlu persetujuan editor.
**Bukti:** A5-N01, A5-L01, A5-U01.

## A6 — CRM
**Ringkasan:** 10 prospek fiktif (sektor, AE, status, kebutuhan awal **belum terverifikasi**), pipeline, catatan dengan sumber dan waktu, tindak lanjut + pengingat internal, histori perubahan, dashboard (Baru 3 / Kualifikasi 3 / Follow-up 3 / Penawaran draf 1; AE A 5, AE B 5). Draf penawaran dari "AI" berstatus *Menunggu persetujuan*, hanya manajer yang menyetujui. Penawaran draf ditolak sebelum kebutuhan dikonfirmasi dengan bukti. AE hanya mengubah prospeknya sendiri.
**Uji:** P03 dimasukkan lagi → tetap 10 (duplikasi ditandai); gagal simpan sebelum/sesudah tersimpan → coba ulang tidak menggandakan data. Tanggal tindak lanjut P03 = **5 Nov 2026 (tanggal simulasi)**.
**Keterbatasan:** "AI" = templat aturan, bukan LLM. Tidak ada nilai penjualan.
**Bukti:** A6-D01, A6-S01, A6-U01. Bukti P03 yang sama dengan A1 dirujuk ulang.

---

## A7 — Tautan laporan
**[URL laporan `AzharZuhro_TesPraktik_MSI.pdf` / `.md` di Google Drive/GitHub, hak "Siapa saja dengan link: Pelihat"]**, **[URL folder `bukti/`]**
Nama berkas: **AzharZuhro_TesPraktik_MSI**.

## A8 — Tautan demo
**[URL rekaman `bukti/A3/Demo.webm` di Google Drive]**, kode **A3**, ID bukti **A3-D01, A3-U01, A3-S01**.
Akses aman: rekaman demo (`Demo.webm`, 4 menit 15 detik) dapat langsung diputar tanpa akses produksi; aplikasi juga dapat dijalankan lokal (`python3 -m http.server 8080 --directory A3-penilaian-awards`, buka `http://localhost:8080`) tanpa kata sandi/kredensial; seluruh data fiktif.

---

## B1 — Kesediaan
**[ISI: bersedia / perlu diskusi / tidak bersedia — full-time, on-site Jakarta Selatan, koordinasi langsung dengan CEO]**

## B2 — Ekspektasi gaji
**[ISI: nominal Rp … per bulan, dasar gross / THP-net / perlu klarifikasi]** — isi angka Anda yang sebenarnya.

## B3 — Batas minimum
**[ISI: nominal Rp … , dasar gross/THP-net/perlu klarifikasi]** — terpisah dari B2.

## B4 — Waktu bergabung
**[ISI: tanggal paling awal, notice period, komitmen berjalan]**

## B5 — Keunggulan & dukungan
**[ISI: contoh nyata dari pengalaman Anda]**. Bahan yang bisa Anda pakai bila memang benar: kebiasaan menguji (bukti uji otomatis di A1/A3/A6), kejujuran batas implementasi (label simulasi/rancangan), dan desain "human-in-the-loop". Tugas yang butuh pendampingan: **[ISI jujur]**. Kendala kesiapan: **[ISI atau "tidak ada"]**.

---

## C1 — Portofolio 1–3 proyek AI terdahulu
*(Disusun dari repositori publik Anda di https://github.com/azharzuhro12 — periksa kembali detail peran & periode sebelum kirim)*

1. **P01 — BizAssist AI (Asisten FAQ Operasional UMKM Berbasis Sumber)** | Periode: **Oktober 2026** (Portofolio mandiri)
   - **Masalah & pengguna:** Pengetahuan operasional UMKM tersebar di catatan/spreadsheet sehingga staf lama mencari jawaban. Pengguna: staf operasional UMKM.
   - **Fitur:** Web chat responsif, indikator koneksi backend, percakapan berkelanjutan (`conversation_id`), validasi input sisi server (maks. 2.000 karakter), pesan error ramah dengan tombol *Coba lagi* (retry), dan batasan ketat hanya menjawab dari `faq_umkm.txt` (mengakui jika jawaban tidak ada, tanpa mengarang stok/harga).
   - **Teknologi/integrasi:** Python (FastAPI, Pydantic v2, HTTPX async), Dify Chatflow (Knowledge Retrieval), Google Gemini, HTML/CSS/JS murni, pytest (`TestClient` + mocking).
   - **Penggunaan AI:** Sebagai fitur utama (RAG/Knowledge Retrieval + Gemini di Dify) dan asisten coding saat pengembangan.
   - **Peran pribadi:** **[ISI/konfirmasi: Merancang arsitektur FastAPI–Dify, menulis aturan grounding FAQ, validasi & uji pytest]**.
   - **Status & pengujian:** Prototipe lokal berjalan; dilengkapi *automated test suite* offline (API, kontrak frontend, keamanan header & env).
   - **Keterbatasan:** Belum ada autentikasi, *rate limiting*, database persisten di luar sesi, atau deployment publik.
   - **Relevansi tugas MSI:** Sangat relevan dengan **A1** (AI agent berbasis Knowledge Base, menolak mengarang di luar sumber, dan penanganan gagal/retry).

2. **P02 — CatatAI (Asisten Pencatatan Keuangan UMKM Multimodal)** | Periode: **Oktober 2026** (Portofolio mandiri)
   - **Masalah & pengguna:** Pedagang kecil kesulitan mencatat pemasukan, pengeluaran, dan piutang ("bon") secara terstruktur. Pengguna: pemilik warung/UMKM.
   - **Fitur:** Input transaksi via chat bahasa sehari-hari (*"jual bakso 50rb"*, *"bayar separo utang galon"*), input suara (transkripsi + parsing), scan foto struk belanja, pelacakan & pelunasan piutang, dashboard metrik, laporan harian/mingguan/bulanan, dan narasi *AI insight*.
   - **Teknologi/integrasi:** Next.js 14 (TypeScript, Tailwind CSS, Recharts), FastAPI (Python), Groq (LLM untuk parsing & insight, Whisper untuk suara, model multimodal untuk struk), Supabase (PostgreSQL), ter-deploy di Vercel.
   - **Penggunaan AI:** Sebagai fitur inti (ekstraksi teks/suara/gambar ke struktur transaksi & pembuatan insight) serta bantuan coding.
   - **Peran pribadi:** **[ISI/konfirmasi: Merancang skema database Supabase, endpoint FastAPI, prompt ekstraksi transaksi/piutang, dan integrasi frontend-backend di Vercel]**.
   - **Status & pemeliharaan:** Ter-deploy publik (live demo Vercel + Supabase); dilengkapi skrip setup (`setup.sh`, `seed.py`) dan dokumentasi API (`/docs`).
   - **Keterbatasan:** Masih menggunakan *demo user* (autentikasi multi-user, ekspor PDF/Excel, dan pengingat jatuh tempo masih di *roadmap*).
   - **Relevansi tugas MSI:** Relevan dengan **A3** (aplikasi web dengan perhitungan, rekap, dan dashboard) serta **A6** (pencatatan terstruktur, status piutang/tindak lanjut, dan ringkasan AI).

3. **P03 — Otomasi Workflow n8n: Admin Warehouse & Minori** | Periode: **Oktober 2026** (Portofolio mandiri)
   - **Masalah & pengguna:** Pencatatan barang masuk/keluar gudang dari chat bebas dan pengiriman pengingat kandidat masih manual. Pengguna: admin gudang dan tim rekrutmen/manajemen.
   - **Fitur:** (a) *Admin Warehouse*: bot Telegram menerima pesan bebas → Google Gemini + *Structured Output Parser* mengekstrak `date, type, name, quantity, unit, person` → validasi tanggal → simpan ke Google Sheets & konfirmasi Telegram; ketik `laporan` untuk filter tanggal & kirim file CSV otomatis. (b) *Minori*: jadwal harian 08:00 WIB untuk *matching* kandidat, pengingat WhatsApp (Fonnte)/email, dan laporan manajemen harian.
   - **Teknologi/integrasi:** n8n (Docker Compose), Telegram Bot API, Google Gemini, Google Sheets OAuth2, Fonnte, SMTP.
   - **Penggunaan AI:** Sebagai fitur ekstraksi data tidak terstruktur menjadi kolom tabel yang tervalidasi.
   - **Peran pribadi:** **[ISI/konfirmasi: Menyusun node workflow n8n, skema parser Gemini, aturan validasi tanggal, dan konfigurasi dry-run]**.
   - **Status & keterbatasan:** Workflow fungsional; pada workflow *Minori*, node pengiriman pesan keluar sengaja dinonaktifkan (*dry-run*) sampai kredensial produksi disetujui. Belum ada penanganan antrean skala besar.
   - **Relevansi tugas MSI:** Relevan dengan **A1 & A6** (ekstraksi berbantuan AI, pencatatan ke tabel/database, pembuatan pengingat, dan prinsip aman *dry-run*/tidak mengirim pesan keluar tanpa izin).

## C2 — Keunggulan proyek dan bukti hasil
- **P01 (BizAssist AI) — Keandalan & keamanan kunci API:** Dibandingkan menaruh dokumen FAQ mentah atau memanggil API model langsung dari browser, arsitektur proxy FastAPI menjaga API key Dify tetap di server (*same-origin*), memvalidasi input (batas 2.000 karakter), menyediakan tombol *Coba lagi* saat jaringan gagal, dan membatasi jawaban hanya pada `faq_umkm.txt`.
  - *Bukti terukur:* Suite uji otomatis offline (`tests/test_api.py`, `test_frontend.py`, `test_security.py`) dan tangkapan layar sesi live di `docs/screenshots/`.
  - *Belum diukur:* Persentase penurunan waktu cari informasi oleh staf UMKM di lapangan.
- **P02 (CatatAI) — Kemudahan input & kecepatan pencatatan:** Dibandingkan mengisi form akuntansi manual (memilih kategori, mengetik nominal, memisahkan piutang), pengguna cukup mengetik/bicara satu kalimat sehari-hari (mis. *"bon budi 50rb, udah bayar 20rb"*) atau memfoto struk, lalu sistem otomatis memisahkan nilai piutang dan pembayaran.
  - *Bukti terukur:* Aplikasi dan API live yang dapat diuji langsung (`/health` dan endpoint `/api/v1/transaksi/*`), skema `supabase/schema.sql`, serta screenshot di `docs/screenshots/`.
  - *Belum diukur:* Akurasi ekstraksi pada ribuan variasi bahasa daerah/struk buram dan penghematan waktu terukur pada pedagang nyata.
- **P03 (n8n Admin Warehouse & Minori) — Ketelitian format & integrasi:** Dibandingkan menyalin pesan Telegram ke spreadsheet dan membuat rekap secara manual, workflow otomatis mengubah pesan teks bebas menjadi baris Google Sheets berkolom baku setelah lolos validasi tanggal, serta menghasilkan CSV laporan sesuai rentang tanggal. Pada *Minori*, mode *dry-run* mencegah pengiriman pesan WhatsApp/email yang belum disetujui.
  - *Bukti terukur:* File definisi workflow (`Admin-Werehouse.json`, `minori_n8n_workflow.json`), diagram alur (`graphviz.svg`), dan contoh keluaran nyata `laporan Gudang 2026-09-01 sampai 2026-09-30.csv`.
  - *Belum diukur:* Penghematan jam kerja admin gudang pada operasional harian penuh.

## C3 — Tautan demo atau screenshot proyek terdahulu
- **P01 — BizAssist AI**
  - Repositori & dokumentasi: https://github.com/azharzuhro12/BizAssist-AI
  - Screenshot berurutan (tampilan awal, tanya jawab berbasis FAQ, dan penanganan error): https://github.com/azharzuhro12/BizAssist-AI/tree/main/docs/screenshots
  - Keterangan: Proyek menggunakan data FAQ UMKM simulasi (`faq_umkm.txt`), terpisah dari sistem produksi mana pun, tanpa kredensial rahasia.
- **P02 — CatatAI**
  - Live Demo Aplikasi: https://catat-ai-azhars-projects-da34b643.vercel.app
  - Live API & Health Check: https://catat-ai-api-azhars-projects-da34b643.vercel.app/health
  - Repositori & screenshot (dashboard, laporan mingguan, input chat): https://github.com/azharzuhro12/catat-ai (folder `docs/screenshots`)
  - Keterangan: Menggunakan akun demo (`seed-demo.sql`) dan data transaksi dummy; dapat langsung dibuka penilai tanpa login/kata sandi.
- **P03 — Workflow n8n (Admin Warehouse & Minori)**
  - Repositori, file JSON workflow & contoh hasil CSV: https://github.com/azharzuhro12/n8n
  - Visualisasi alur workflow: https://github.com/azharzuhro12/n8n/blob/main/minori/graphviz.svg
  - Keterangan: Hanya berisi definisi workflow, contoh CSV simulasi, dan `.env.example` (tanpa token Telegram/Fonnte/API key asli).

## C4 — Pernyataan akhir
"Saya menyatakan informasi dan kontribusi saya dijelaskan secara jujur. Materi boleh dibagikan dan tidak berisi data rahasia, kredensial, atau akses produksi. Bantuan AI (asisten pemrograman AI, edge-tts) sudah saya sebutkan **[tambahkan pihak lain bila ada]**. Tautan sudah saya periksa dapat dibuka. Saya memahami tes ini tidak menjamin penerimaan dan gaji memerlukan kesepakatan kedua pihak. **[Batasan: ... atau 'tidak ada']**"

---

# CATATAN SEBELUM MENGIRIM
1. **Tautan belum ada.** Unggah folder `proyek-msi/` (terutama `bukti/` dan laporan) ke Google Drive/GitHub dengan akses "pelihat saja" untuk siapa pun yang punya link, lalu isi semua **[URL]**. Saya tidak bisa mengunggah atas nama Anda.
2. **Rekam demo A3 sendiri** (A8). Video `A3-D01-demo.mp4` hanya rangkaian screenshot otomatis dan jangan disebut rekaman real-time.
3. **A2:** tonton `bukti/A2/A2-V01-video-vertikal.mp4` dulu. Saya belum menonton hasilnya.
4. **Laporan (A7)** belum memuat pembanding, pemeliharaan, dan perkiraan biaya/asumsi per tugas. Minta saya tambahkan bila mau.
5. Laporan lama menulis "Kandidat: AI & Automation Specialist Candidate" dan tidak memuat nama Anda. Ganti dengan nama asli, dan beri nama berkas `NamaAnda_TesPraktik_MSI`.
6. Batas pengumpulan: **Senin, 9 November 2026**.

