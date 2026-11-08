# LAPORAN LENGKAP PENGERJAAN TUGAS PRAKTIK A1 SAMPAI A6
**Posisi**: AI & Automation Specialist — MSI Group  
**Kandidat**: Azhar Zuhro  
**Sifat**: SELURUH MATERI ADALAH SIMULASI (Data Dummy & Aset Berizin)  
**Dokumen Acuan**: Naskah Tes Praktik Kandidat MSI, Versi 2 (Diperbarui 31 Oktober 2026)  
**Solusi Utama (Diperagakan Mendalam)**: **A3 Aplikasi Web Penilaian Awards**  
**Solusi Pendukung (Prototipe Berjalan & Bukti Teruji)**: **A1, A2, A4, A5, A6**

---

## DAFTAR INDEKS KODE BUKTI LENGKAP

| Kode Bukti | Deskripsi Berkas Bukti | Format / Tautan Berkas | Keterangan & Status |
|---|---|---|---|
| **A3-D01** | Demo Aplikasi Penilaian Awards (Alur Lengkap E2E) | [A3-D01-demo.mp4](file:///home/zarr/Documents/proyek-msi/bukti/A3/A3-D01-demo.mp4) | Video rangkaian uji E2E (Chrome Headless) |
| **A3-U01** | Hasil Uji Otomatis & E2E (11 Tes Unit + 12 Tes Browser) | [A3-U01-e2e.txt](file:///home/zarr/Documents/proyek-msi/bukti/A3/A3-U01-e2e.txt) | Lulus 100% (Skor invalid, bobot, gagal simpan) |
| **A3-S01** | Screenshot Tampilan Admin (Dashboard, Bobot) & Juri | [A3-S01-admin-dashboard.png](file:///home/zarr/Documents/proyek-msi/bukti/A3/A3-S01-admin-dashboard.png) | Tangkapan layar beresolusi tinggi |
| **A1-D01** | Demo Tanya Jawab, Eskalasi, Dedup & Draf | [A1 App](file:///home/zarr/Documents/proyek-msi/A1-agent-layanan/index.html) | Antarmuka interaktif lokal |
| **A1-U01** | Hasil Uji Unit Agent, Aturan KB & Dedup P03 | [agent.test.js](file:///home/zarr/Documents/proyek-msi/A1-agent-layanan/tests/agent.test.js) | 9 uji otomatis lulus (Node.js test runner) |
| **A1-S01** | Screenshot Rujukan KB, Eskalasi & Draf Staf | [A1-S01-chat-kb-eskalasi.png](file:///home/zarr/Documents/proyek-msi/bukti/A1/A1-S01-chat-kb-eskalasi.png) | Bukti kepatuhan rujukan KB01–KB04 |
| **A2-V01** | Video Vertikal 9:16 (~32 Detik) Bersuara & Subtitle | [A2-V01-video-vertikal.mp4](file:///home/zarr/Documents/proyek-msi/bukti/A2/A2-V01-video-vertikal.mp4) | MP4 1080×1920 (Neural Voice + Subtitle) |
| **A2-S01** | Naskah Subtitle Tersinkronisasi | [A2-S01-subtitle.srt](file:///home/zarr/Documents/proyek-msi/bukti/A2/A2-S01-subtitle.srt) | Waktu kemunculan presisi milidetik |
| **A2-D01** | Metadata Publikasi YouTube, Pemilihan Sumber & Proses | [A2-D01-metadata-youtube.md](file:///home/zarr/Documents/proyek-msi/bukti/A2/A2-D01-metadata-youtube.md) | Judul, deskripsi, tag, dan analisis proses |
| **A4-B01** | Briefing Eksekutif Manajemen 1 Halaman | [A4-B01-briefing.pdf](file:///home/zarr/Documents/proyek-msi/bukti/A4/A4-B01-briefing.pdf) | PDF 1 Halaman standar cetak eksekutif |
| **A4-U01** | Pengujian Fakta, Rujukan Halaman & Kepatuhan Anggaran | [test-a4.js](file:///home/zarr/Documents/proyek-msi/tools/test-a4.js) | 8 pengujian otomatis lulus |
| **A4-S01** | Diagram Alur Akses Data Berizin & Persetujuan | [A4-S01-alur-akses-dan-persetujuan.md](file:///home/zarr/Documents/proyek-msi/bukti/A4/A4-S01-alur-akses-dan-persetujuan.md) | Mermaid chart tata kelola etis AI |
| **A5-N01** | Draf Artikel Jurnalistik Berbasis Bahan | [A5-N01-artikel.md](file:///home/zarr/Documents/proyek-msi/bukti/A5/A5-N01-artikel.md) | Artikel terkontrol tanpa klaim palsu |
| **A5-L01** | Tata Letak Majalah 1 Halaman (Dua Kolom + Grafik) | [A5-L01-layout.pdf](file:///home/zarr/Documents/proyek-msi/bukti/A5/A5-L01-layout.pdf) | PDF & PNG resolusi tinggi dengan grafik |
| **A5-U01** | Uji Akurasi Hitungan (25%) & Verifikasi Bebas Klaim Laba | [test-a5.js](file:///home/zarr/Documents/proyek-msi/tools/test-a5.js) | 4 pengujian otomatis lulus |
| **A6-D01** | Prototipe CRM Marketing Berbantuan AI | [A6 App](file:///home/zarr/Documents/proyek-msi/A6-crm/index.html) | Pipeline Kanban & histori interaktif |
| **A6-U01** | Pengujian Pipeline, Idempotensi, Gagal Simpan & Akses AE | [crm.test.js](file:///home/zarr/Documents/proyek-msi/A6-crm/tests/crm.test.js) | 10 uji otomatis lulus |
| **A6-S01** | Screenshot Pipeline, Detail P03 & Draf Terkunci | [A6-S01-pipeline-detail-p03.png](file:///home/zarr/Documents/proyek-msi/bukti/A6/A6-S01-pipeline-detail-p03.png) | Tangkapan layar pipeline & audit trail |

---

## 1. TUGAS UTAMA: A3 APLIKASI WEB PENILAIAN AWARDS

### 1.1 Masalah & Kebutuhan
Proses penilaian konvensional sering menghadapi risiko ketidakkonsistenan rumus, kesalahan penanganan nilai kosong (yang kerap keliru dihitung sebagai angka nol), bobot kriteria yang tidak seimbang, serta potensi manipulasi data saat juri dapat mengakses penilaian juri lain. Diperlukan aplikasi web transparan yang memisahkan logika matematika murni dari tampilan antarmuka, memiliki validasi ketat, serta tahan terhadap kegagalan penyimpanan jaringan.

### 1.2 Arsitektur Solusi & Peran AI
- **Arsitektur Tanpa Ketergantungan (Pure Vanilla JS)**: Menggunakan pola modular (`scoring.js` untuk komputasi deterministik, `store.js` untuk manajemen state transaksional, dan `app.js` untuk antarmuka pengguna).
- **Peran AI**: AI dimanfaatkan dalam pembuatan kerangka logika awal, penyusunan fungsi pembulatan presisi desimal, dan perancangan skenario pengujian unit (TDD).
- **Kontribusi Pribadi**:
  1. Mengimplementasikan guard `Math.round(x * 10 + 1e-9) / 10` untuk mencegah galat representasi floating-point IEEE-754 pada kasus kritis desimal (mis. `72.45` dibulatkan tepat ke `72.5`).
  2. Merancang arsitektur penyimpanan transaksional: data di memori baru diperbarui jika penulisan ke media penyimpanan (*localStorage*) sukses.
  3. Memastikan fungsi ekspor CSV dan tabel Dashboard memanggil satu fungsi tunggal (`buildRecap()`), menjamin kesamaan 100% data tampilan dan laporan ekspor.

### 1.3 Rumus Penjurian & Pembuktian Data Naskah Acuan
- **Rumus Nilai per Juri**:
  $$\text{Nilai Juri} = \left(\frac{\text{Strategi}}{5} \times 40\right) + \left(\frac{\text{Implementasi}}{5} \times 35\right) + \left(\frac{\text{Hasil}}{5} \times 25\right)$$
- **Nilai Perusahaan**: Rata-rata nilai juri, ditampilkan dengan 1 angka desimal format Indonesia (koma).

**Tabel Hasil Verifikasi Aplikasi vs Naskah Acuan**:
| Peserta | Juri 1 (J1) | Juri 2 (J2) | Nilai Perusahaan | Status di Aplikasi |
|---|---|---|---|---|
| **S01** (PT Simulasi Peserta Satu) | 73,0 | 75,0 | **74,0** | Lengkap (Cocok 100%) |
| **S02** (PT Simulasi Peserta Dua) | 72,0 | 73,0 | **72,5** | Lengkap (Cocok 100%) |
| **S03** (PT Simulasi Peserta Tiga) | 83,0 | 80,0 | **81,5** | Lengkap (Cocok 100%) |

### 1.4 Hasil Pengujian Kritis (11 Unit Tests + 12 Browser E2E Tests)
1. **Skor Invalid (Angka 6, Negatif, Teks)**: Ditolak dengan pesan kesalahan spesifik rentang 0–5. State data lama tidak tersentuh.
2. **Juri Mengosongkan Nilai**: Jika J2 mengosongkan penilaian pada S01, sistem menetapkan status **"Belum lengkap"** dan nilai perusahaan menampilkan tanda setrip (`—`), **bukan angka nol** dan bukan nilai parsial final.
3. **Perubahan Bobot Dinamis**: Saat bobot diubah menjadi 50%, 30%, 20%, sistem secara instan menghitung ulang seluruh tabel (nilai S01 J1 otomatis berubah dari 73,0 menjadi 74,0).
4. **Validasi Bobot $\neq 100\%$**: Input bobot dengan total 110% ditolak seketika; bobot lama dipertahankan.
5. **Simulasi Kegagalan Penyimpanan & Coba Ulang (Retry)**:
   Saat tombol simulasi kegagalan aktif, proses simpan gagal memunculkan banner peringatan *"Data BELUM tersimpan; silakan coba ulang"*. Tidak ada keberhasilan palsu. Tombol **"Coba ulang"** mengulangi mutasi secara aman dan berhasil menyimpan data begitu kendala teratasi.
6. **Pemisahan Peran (Role Isolation)**: Juri J1 hanya dapat mengubah nilai lembar miliknya sendiri dan tidak dapat melihat/mengedit skor milik Juri J2.

### 1.5 Keterbatasan & Rencana Perbaikan Produksi
- *Keterbatasan Saat Ini*: Pemilih peran (`Admin / J1 / J2`) bersifat simulasi lokal peramban (*client-side UI state*), belum menggunakan JWT atau sesi terotentikasi server.
- *Langkah Perbaikan*: Integrasi autentikasi OAuth2/OIDC, migrasi *storage* ke PostgreSQL dengan *row-level security* (RLS), dan penambahan enkripsi *field-level* untuk catatan kualitatif juri.

---

## 2. TUGAS PENDUKUNG A1: AI AGENT LAYANAN & PROSPEK AWARDS

### 2.1 Alur Solusi & Perilaku Agen
- Agen bertugas menyaring pertanyaan calon peserta awards secara deterministik berdasarkan Knowledge Base resmi (KB01–KB04).
- Pertanyaan masuk diklasifikasikan ke label intensi. Jawaban hanya dirangkai dari kutipan resmi KB terkait.
- Jika calon peserta menanyakan tarif, kepastian menang, atau jadwal spesifik, agen secara tegas menolak membuat janji, merujuk KB04, dan meneruskan tiket ke antrean staf.
- Draf balasan (*follow-up*) dibuat otomatis dengan status **"Menunggu persetujuan"** dan dikunci sehingga agen AI tidak memiliki wewenang mengirimkannya ke luar tanpa persetujuan manusia (*Human-in-the-Loop*).

### 2.2 Pencegahan Duplikasi & Ketahanan Database
- Pencatatan prospek menggunakan aturan normalisasi nama perusahaan (menghapus prefiks PT/CV dan tanda baca). Jika prospek P03 diinput berulang kali, total prospek unik tetap 1, sementara percakapan baru dihubungkan ke catatan yang sudah ada.
- Kegagalan penyimpanan jaringan disimulasikan secara transaksional dengan opsi coba ulang tanpa duplikasi data.

---

## 3. TUGAS PENDUKUNG A2: VIDEO AI VERTIKAL (TIKTOK / REELS / SHORTS)

### 3.1 Pilihan Sumber & Konsep
- **Potongan Sumber**: 00:25–00:55 (*"Mulailah dari satu pekerjaan yang berulang. Catat waktu yang dipakai, kesalahan yang sering muncul, dan siapa pengguna hasilnya."*).
- **Rasional**: Menanamkan pola pikir fundamental otomasi berbasis data sebelum memutuskan adopsi perangkat lunak AI.

### 3.2 Spesifikasi Teknis Video
- **Format**: Video Vertikal MP4 (Rasio 9:16, $1080 \times 1920$ piksel, durasi 32 detik).
- **Audio**: Neural Speech Synthesis bahasa Indonesia (`id-ID-ArdiNeural`) berintonasi jernih dan berkecepatan teratur.
- **Visual & Subtitle**: Slide berbasis kartu grafis kontras tinggi dengan zona aman (*safe margin*) 280 piksel dari bawah agar subtitle tidak bertabrakan dengan tombol antarmuka platform.
- **Label Kepatuhan**: Memuat tanda air *SIMULASI TES PRAKTIK MSI BEYOND* dan sangkalan bahwa narasi merupakan materi latihan, bukan kutipan resmi narasumber nyata.

---

## 4. TUGAS PENDUKUNG A4: ANALISIS PENJURIAN MENJADI BRIEFING LAYANAN

### 4.1 Pemisahan Fakta & Interpretasi (Maksimal 1 Halaman)
- Menghubungkan fakta literal dari dokumen (Hal 1: 100 staf/60 ikut AI; Hal 2: 6/10 rekap manual; Hal 3: efisiensi belum terukur) dan transkrip (00:20 penundaan laporan saat PIC berhalangan; 00:45 nihil pengukuran manfaat per unit; 01:10 akar masalah belum teridentifikasi).
- **Pemisahan Tegas**: Masalah operasional tidak serta merta disimpulkan sebagai "kebutuhan pelatihan karyawan". Disusun 2 hipotesis layanan asesmen proses kerja yang wajib dikonfirmasi terlebih dahulu melalui 3 pertanyaan klarifikasi.

### 4.2 Kepatuhan Pertanyaan Anggaran
- Agen mematuhi kebijakan perlindungan etis: jika ditanya perkiraan biaya/anggaran konsultasi, sistem merespons dengan jawaban baku:
  > *"Informasi anggaran konsultasi belum tersedia pada dokumen dan transkrip simulasi. Anggaran perlu diklarifikasi kepada pihak berwenang."*
  Sistem dilarang keras mengarang estimasi nominal.

---

## 5. TUGAS PENDUKUNG A5: JURNALISTIK & TATA LETAK MAJALAH

### 5.1 Integritas Berita & Verifikasi Rumus
- Naskah berita membatasi klaim hanya pada data uji yang tersedia (20 staf, durasi 4 minggu, penurunan waktu dari 120 menit menjadi 90 menit).
- **Verifikasi Matematis**:
  $$\text{Penghematan} = \frac{120 - 90}{120} \times 100\% = 25\%$$
- Naskah menegaskan bahwa penghematan waktu internal belum diaudit independen dan dilarang mengklaim peningkatan profitabilitas/omzet korporasi.

### 5.2 Tata Letak 1 Halaman (A5-L01)
- Dibuat dalam format majalah 1 halaman (*two-column layout*), dilengkapi rubrik editorial, *lead paragraph*, *pull-quote* narasumber (Rani, Koordinator Proyek Simulasi), serta grafik batang komparasi waktu pengerjaan sebelum vs sesudah AI.
- Memuat catatan editorial bahwa berkas merupakan draf simulasi yang memerlukan persetujuan dewan redaksi, serta spesifikasi warna *bleed* dan *proofing* cetak belum diuji untuk skala penerbitan massal.

---

## 6. TUGAS PENDUKUNG A6: CRM MARKETING BERBANTUAN AI

### 6.1 Manajemen Database & Pipeline
- Mengelola 10 prospek awal fiktif (P01–P10) dengan pembagian AE A dan AE B serta 4 tahapan pipeline (*Baru*, *Kualifikasi*, *Follow-up*, *Penawaran draf*).
- Menampilkan metrik pipeline tanpa mengarang angka nominal penjualan (*pipeline value*).

### 6.2 Alur Tindak Lanjut & Kebutuhan Terkonfirmasi
- Prospek P03 dicatat dengan tanggal tindak lanjut 5 November 2026. Sistem otomatis menghasilkan pengingat internal (*reminder*).
- **Aturan Bisnis Kritis**: Minat awal calon klien **tidak dianggap sebagai kebutuhan terkonfirmasi**. Status prospek dilarang berpindah ke *Penawaran draf* sebelum AE mencantumkan kebutuhan spesifik beserta bukti konfirmasinya.
- Draf komunikasi yang disiapkan oleh AI berstatus *Menunggu persetujuan* dan hanya dapat disetujui oleh peran manajer sebelum dipindahkan ke antrean keluar simulasi (*outbox*).

---

## 7. KESIMPULAN & PENILAIAN DIRI KANDIDAT
Pengerjaan tugas praktik ini diselesaikan dengan fokus mendalam pada ketelitian data, kejujuran teknis, dan kesiapan demonstrasi. Pendekatan yang diterapkan membuktikan bahwa implementasi otomasi dan kecerdasan buatan dalam lingkungan MSI Group harus selalu berlandaskan validasi aturan bisnis yang kuat, transparansi metodologi, dan pengawasan manusia (*Human-in-the-Loop*).

