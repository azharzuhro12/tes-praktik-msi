# Azhar Zuhro — Tes Praktik AI & Automation Specialist MSI Group (Laporan Bagian A–C)

> **Nama berkas:** `AzharZuhro_TesPraktik_MSI`
> **Kandidat:** Azhar Zuhro (`azharzuhro74@gmail.com`) · **GitHub:** https://github.com/azharzuhro12
> **Repositori Laporan & Bukti:** https://github.com/azharzuhro12/tes-praktik-msi
> **Halaman Live Demo & Bukti (GitHub Pages):** https://azharzuhro12.github.io/tes-praktik-msi/
> **SIMULASI TES.** Seluruh nama perusahaan, data, angka, dan skenario dalam tugas A1–A6 bersifat fiktif untuk evaluasi rekrutmen. Tidak ada kontak nyata, data rahasia, kredensial, atau akses produksi.

## 0. Ringkasan Eksekutif (A0)
| Kode | Tugas | Status Bukti | ID Bukti & Tautan |
|---|---|---|---|
| **A3** | Aplikasi web penilaian awards | **SOLUSI UTAMA, berjalan** (demo lokal & live GitHub Pages) | **A3-D01** (`bukti/A3/Demo.webm`), **A3-U01** (`bukti/A3/A3-U01-unit-test.txt`, `A3-U01-e2e.txt`), **A3-S01** (`bukti/A3/A3-S01-*.png`) |
| **A1** | AI agent layanan & prospek | **Prototipe berjalan** | **A1-D01** (`A1-agent-layanan/`), **A1-U01** (`bukti/A1/A1-U01-hasil-uji.txt`), **A1-S01** (`bukti/A1/A1-S01-*.png`) |
| **A6** | CRM marketing berbantuan AI | **Prototipe berjalan** | **A6-D01** (`A6-crm/`), **A6-U01** (`bukti/A6/A6-U01-hasil-uji.txt`), **A6-S01** (`bukti/A6/A6-S01-*.png`) |
| **A2** | Video AI vertikal 9:16 | **Contoh terbatas berjalan** (klip animasi 32 dtk) | **A2-V01** (`bukti/A2/A2-V01-video-vertikal.mp4`), **A2-S01** (`A2-S01-subtitle.srt`, `A2-S01-preview-frame.png`), **A2-D01** (`A2-D01-metadata-youtube.md`) |
| **A4** | Briefing layanan dari penjurian | **Contoh manual berbantuan AI** (1 halaman PDF) | **A4-B01** (`bukti/A4/A4-B01-briefing.pdf`), **A4-U01** (`bukti/A4/A4-U01-hasil-uji.txt`), **A4-S01** (`A4-S01-alur-akses-dan-persetujuan.md`) |
| **A5** | Artikel jurnalistik & layout majalah | **Contoh terbatas** (artikel 260 kata + layout 1 hal) | **A5-N01** (`bukti/A5/A5-N01-artikel.md`), **A5-L01** (`bukti/A5/A5-L01-layout.pdf`, `.png`), **A5-U01** (`bukti/A5/A5-U01-hasil-uji.txt`) |

- **Alasan memilih A3 sebagai solusi utama:** Rumus penilaian, bobot, dan aturan validasinya eksplisit sehingga ketepatan perhitungannya dapat dibuktikan secara matematis dan diuji otomatis (S01 = **74,0**, S02 = **72,5**, S03 = **81,5**).
- **Waktu aktual pengerjaan:** ± 5,5 jam dalam 2 hari (7–8 November 2026).
- **Tools AI & teknologi yang digunakan:** Asisten pemrograman AI (Antigravity) untuk akselerasi penulisan kode, skrip pengujian, dan penyusunan draf dokumen; `edge-tts` (`id-ID-ArdiNeural`) untuk sintesis suara narasi A2; Node.js (test runner bawaan), Puppeteer/Chrome headless, Python (Pillow, matplotlib), dan FFmpeg.
- **Kontribusi pribadi kandidat:** Memilih A3 sebagai solusi utama dan menetapkan arsitektur HTML/CSS/JS murni tanpa server berbayar; meminta penambahan fitur dinamis tambah/hapus juri beserta penyesuaian rata-rata otomatis pada A3; menguji langsung aplikasi di peramban dan merekam sendiri video demo real-time (`bukti/A3/Demo.webm`, 4 menit 15 detik); mengarahkan perbaikan visual A2 menjadi animasi *motion-graphics* 30 fps; serta meninjau kesesuaian seluruh keluaran terhadap batasan etis panduan MSI.
- **Catatan jujur tentang "AI" pada prototipe A1 & A6:** Klasifikasi pertanyaan pada A1 dan asisten ringkasan/draf pada A6 menggunakan **aturan kata kunci dan templat deterministik**, bukan pemanggilan LLM berbayar secara langsung, agar prototipe dapat diuji 100% secara offline, bebas biaya, dan tidak pernah membocorkan kredensial API di sisi klien. Titik integrasi LLM (`classify()` pada A1 dan `aiSuggest()` pada A6) sudah disiapkan di kode untuk pengembangan produksi.

---

## A3 — Aplikasi Web Penilaian Awards (SOLUSI UTAMA)

**1. Masalah & pengguna.** Panitia dan dewan juri membutuhkan alur input nilai, validasi, perhitungan berbobot, dan rekap yang bebas dari kesalahan rumus spreadsheet manual, mencegah nilai kosong terhitung sebagai nol, serta memisahkan hak akses antar-juri. Pengguna: Admin panitia dan Juri (J1, J2, dst.).

**2. Input → proses → output.**
- *Input:* Skor kriteria (Strategi 40%, Implementasi 35%, Hasil 25%) pada rentang 0–5 per peserta per juri, catatan kualitatif juri, serta konfigurasi bobot/peserta/juri oleh admin.
- *Proses:* Validasi tipe & rentang skor (0–5) dan validasi total bobot (wajib 100%) → hitung nilai per juri = $\sum(\text{skor} \div 5 \times \text{bobot})$ → hitung nilai peserta = rata-rata nilai seluruh juri aktif, dibulatkan satu kali di akhir ke 1 angka desimal. Jika ada isian juri yang kosong, status ditandai **"Belum lengkap"** (bukan angka nol).
- *Output:* Dashboard kelengkapan & rekap nilai perusahaan, tabel rincian per juri, ekspor laporan CSV (pemisah titik koma) & cetak PDF, serta tabel jejak perubahan (*audit trail*).
- *Verifikasi data naskah acuan:*
  - S01: J1 = 73,0; J2 = 75,0 → Nilai perusahaan = **74,0** (Lengkap)
  - S02: J1 = 72,0; J2 = 73,0 → Nilai perusahaan = **72,5** (Lengkap)
  - S03: J1 = 83,0; J2 = 80,0 → Nilai perusahaan = **81,5** (Lengkap)

**3. Tools AI.** Asisten AI membantu menyusun modul perhitungan (`scoring.js`), penyimpanan transaksional (`store.js`), antarmuka (`app.js`), serta skrip uji otomatis; kandidat menguji, meminta fitur manajemen juri dinamis, dan merekam demo.

**4. Fitur, keunggulan & pembanding.**
- *Fitur bekerja:* Pemilih peran Admin/Juri, isolasi lembar penilaian per juri, tambah/hapus peserta & juri secara dinamis (minimal 1 juri), ubah bobot kriteria dengan hitung ulang otomatis, validasi skor & bobot, pemeriksaan otomatis kesamaan angka dashboard vs CSV, riwayat perubahan, serta simulasi gagal simpan dengan tombol *Coba ulang*.
- *Keunggulan terbukti:* Perhitungan terpusat pada satu fungsi murni (`buildRecap()`) yang dipakai bersama oleh UI dashboard dan ekspor CSV sehingga tidak mungkin terjadi selisih angka antara tampilan dan laporan; penyimpanan bersifat transaksional (jika gagal simpan, state memori tidak berubah dan tidak memunculkan pesan berhasil palsu).
- *Pembanding:* Rekap spreadsheet manual yang rawan rumus tertimpa atau sel kosong terhitung `0`. Penghematan waktu kerja panitia pada acara nyata belum diukur secara kuantitatif.

**5. Peran pribadi.** Menentukan skenario pengujian, meminta dan memverifikasi fitur tambah/kurang juri, serta melakukan perekaman demo langsung (`Demo.webm`).

**6. Pengujian & penanganan kegagalan (12 uji unit + 12 uji E2E lulus).**
- Skor `6`, `-1`, atau teks `abc` → ditolak dengan pesan *"skor harus pada rentang 0–5"*, data lama tidak berubah.
- Isian J2 dikosongkan → status S01 berubah menjadi **Belum lengkap (1/2)**, nilai perusahaan tampil `—` (bukan nol).
- Bobot diubah menjadi 50%, 30%, 20% → seluruh rekap dihitung ulang otomatis; S01 J1 berubah dari `73,0` menjadi `74,0`.
- Total bobot 110% → ditolak dengan pesan *"Total bobot 110% ditolak: total harus tepat 100%"*.
- Tambah juri J3 → status menjadi *Belum lengkap (2/3)* sampai J3 mengisi; hapus J3 → rata-rata kembali ke 2 juri.
- Simulasi penyimpanan gagal → muncul peringatan merah *"Data BELUM tersimpan; silakan coba ulang"* + tombol **Coba ulang**; setelah dicoba ulang, data tersimpan utuh.

**7. Batasan implementasi (bekerja vs rancangan).** Pemilih peran di pojok kanan atas adalah **simulasi untuk demo**, bukan autentikasi/keamanan produksi. Penyimpanan menggunakan `localStorage` pada satu peramban lokal. Fitur yang masih berupa rancangan untuk produksi: login SSO/JWT, database terpusat (PostgreSQL), dan otorisasi di sisi server.

**8. Pemeliharaan.** Logika rumus terpisah di `js/scoring.js`; setiap perubahan diuji dengan `node --test A3-penilaian-awards/tests/penilaian.test.js` (< 1 detik).

**9. Perkiraan biaya & asumsi.** Prototipe berjalan dengan biaya **Rp0** (HTML/JS statis tanpa server berbayar). Untuk produksi dengan autentikasi dan database cloud terkelola, biaya bergantung pada skala pengguna dan penyedia infrastruktur yang dipilih oleh MSI Group.

---

## A1 — AI Agent untuk Layanan dan Prospek Awards

**1. Masalah & pengguna.** Calon peserta sering menanyakan hal berulang (biaya pendaftaran, jadwal wawancara, sifat sponsorship, kepastian menang/tarif paket). Pengguna: calon peserta awards dan staf layanan MSI.

**2. Input → proses → output.** Pertanyaan masuk + identitas prospek → klasifikasi topik → penyusunan jawaban **hanya dari butir KB01–KB04** beserta kode rujukan → pencatatan prospek dengan deduplikasi (berdasarkan ID dan normalisasi nama perusahaan) → pembuatan draf follow-up berstatus *Menunggu persetujuan* → pembuatan tiket antrean staf jika pertanyaan di luar KB atau menyangkut KB04.

**3. Tools AI.** Klasifikasi deterministik berbasis kata kunci di `A1-agent-layanan/js/agent.js` (dengan template prompt LLM yang disiapkan untuk integrasi API); asisten AI membantu penulisan kode dan 9 skrip uji otomatis.

**4. Fitur, keunggulan & pembanding.** Setiap jawaban wajib memuat badge rujukan (`KB01`–`KB04`); pantang menjanjikan bintang/penghargaan; menolak mengirim draf sebelum klik *Setujui* oleh peran Staf; tombol *Kirim* hanya mencatat ke *outbox simulasi*. Pembanding: balasan chat manual tanpa standar rujukan KB.

**5. Peran pribadi.** Meninjau aturan jawaban KB01–KB04, alur eskalasi staf, dan skenario uji duplikasi P03.

**6. Pengujian & kegagalan (9 uji otomatis lulus — `A1-U01`).**
- *"Apakah harus menjadi sponsor?"* → Dijawab opsional & tidak menentukan hasil (**Rujukan: KB03**).
- *"Bisakah dijamin mendapat bintang 5?"* → Menolak menjanjikan penghargaan, diteruskan ke staf (**Rujukan: KB04**; atau **KB03 & KB04** bila dikaitkan sponsor).
- *"Berapa harga paket serta tanggal wawancara saya?"* → Dijawab tarif & jadwal spesifik belum tersedia, jadwal dikoordinasikan setelah verifikasi, diteruskan ke staf (**Rujukan: KB02, KB04**).
- P03 (`PT Simulasi Tani Makmur`) dimasukkan dua kali → hanya **1 prospek unik** yang tersimpan, jumlah pertanyaan bertambah.
- Simulasi database gagal → tampil pesan *"Pencatatan gagal... BELUM tersimpan"* beserta tombol **Coba ulang pencatatan** tanpa keberhasilan palsu.

**7. Batasan.** Klasifikasi masih berbasis aturan kata kunci lokal dan penyimpanan di `localStorage`; belum terhubung ke WhatsApp/email nyata.

**8. Pemeliharaan.** Pembaruan butir pengetahuan cukup dilakukan pada objek `KB` di `js/agent.js` lalu diuji ulang dengan `node --test`.

**9. Biaya & asumsi.** Prototipe **Rp0**. Jika diintegrasikan ke API LLM (mis. Gemini Flash), biaya mengikuti tarif token per percakapan.

---

## A2 — Video AI untuk Instagram, TikTok, dan YouTube

**1. Masalah & pengguna.** Tim konten perlu mengubah materi diskusi/naskah panjang menjadi klip edukasi vertikal yang ringkas, jelas, dan aman dari klaim kutipan palsu. Pengguna: tim media sosial/konten MSI.

**2. Input → proses → output.** Pilihan kutipan naskah sumber `[00:25–00:55]` (*"Mulailah dari satu pekerjaan yang berulang. Catat waktu yang dipakai, kesalahan yang sering muncul, dan siapa pengguna hasilnya."*) → penyusunan 4 adegan naskah adaptasi → sintesis suara Bahasa Indonesia (`edge-tts` `id-ID-ArdiNeural`) yang disinkronkan per adegan (0 dtk, 5,2 dtk, 15,0 dtk, 23,5 dtk) → rendering animasi *motion-graphics* 30 fps (`1080 × 1920`, 960 frame) + *subtitle* `.srt` → keluaran `A2-V01-video-vertikal.mp4` (32,0 detik) beserta judul & deskripsi YouTube (`A2-D01`).

**3. Tools AI.** `edge-tts` untuk suara sintetis neural Bahasa Indonesia, Python + Pillow (`tools/make-a2-anim.py`) untuk animasi grafis bergerak, dan FFmpeg untuk penggabungan audio-video.

**4. Fitur, keunggulan & pembanding.** Rasio vertikal 9:16 murni (`1080×1920`), animasi roda gigi berputar, ikon jam/peringatan/pengguna yang bergerak mengikuti narasi, diagram alur *human-in-the-loop* bertahap, grafik batang komparasi yang tumbuh dinamis, kotak *subtitle* di zona aman (tidak tertutup tombol kanan/bawah TikTok/Reels/Shorts), serta banner jelas **SIMULASI TES PRAKTIK · MSI BEYOND**. Pembanding: slide statis tanpa animasi atau penyuntingan timeline manual.

**5. Peran pribadi.** Memilih potongan sumber `[00:25–00:55]` karena memberikan langkah paling konkret sebelum memilih tools otomasi, meminta perubahan visual dari slide statis menjadi animasi bergerak, serta memeriksa keselarasan suara dan posisi subtitle.

**6. Pemeriksaan isi, subtitle & audio.** Durasi terukur tepat **32,0 detik** (masuk rentang 30–45 detik), resolusi `1080×1920` (9:16), suara narasi jernih tanpa musik latar yang mengganggu, waktu kemunculan subtitle sesuai ucapan per adegan, dan mencantumkan sangkalan bahwa narasi adalah adaptasi simulasi (bukan kutipan narasumber MSI nyata).

**7. Batasan.** Menggunakan suara sintetis dan animasi grafis terprogram (bukan rekaman kamera narasumber manusia).

**8. Pemeliharaan.** Teks narasi, warna brand, dan durasi tiap adegan dapat diubah langsung di `tools/make-a2-anim.py` lalu dirender ulang dalam ±30 detik.

**9. Biaya & asumsi.** Biaya pembuatan prototipe **Rp0** menggunakan perangkat lunak sumber terbuka.

---

## A4 — Analisis Dokumen/Video Penjurian Menjadi Briefing Layanan

**1. Masalah & pengguna.** Manajemen dan tim layanan MSI Institute membutuhkan ringkasan cepat dari materi penjurian peserta yang memisahkan fakta terverifikasi dari interpretasi, sehingga tidak langsung menyimpulkan klien pasti membutuhkan atau mampu membeli pelatihan. Pengguna: manajemen MSI Institute dan tim konsultasi.

**2. Input → proses → output.** Materi simulasi PT Simulasi Surya Reka (Halaman 1–3 & Transkrip 00:20, 00:45, 01:10) → ekstraksi fakta beserta halaman/timestamp → pemisahan bagian *Interpretasi*, *Dua Hipotesis Layanan*, dan *Tiga Pertanyaan Klarifikasi* → dokumen briefing 1 halaman (`A4-B01-briefing.pdf`).

**3. Tools AI.** Asisten AI membantu penataan struktur tabel rujukan dan perumusan kalimat hipotesis; pemeriksaan rujukan dan aturan kepatuhan anggaran diuji dengan skrip `tools/test-a4.js` (`A4-U01`).

**4. Fitur, keunggulan & pembanding.**
- Seluruh 6 fakta mencantumkan halaman (`Halaman 1`–`3`) atau timestamp (`00:20`, `00:45`, `01:10`).
- Dua hipotesis layanan dinyatakan secara hati-hati: (1) *Asesmen proses kerja & peluang otomasi alur rekap/serah terima*, dan (2) *Pendampingan uji coba & kerangka pengukuran manfaat AI per divisi (pelatihan terarah hanya jika kesenjangan keterampilan terkonfirmasi)*.
- Tiga pertanyaan klarifikasi sebelum menyusun proposal: (1) rekap mana yang paling sering tertunda & durasi pengerjaannya, (2) aplikasi, pemilik proses, dan SOP serah terima saat ini, (3) bukti internal apakah kendala utama pada keterampilan, proses, atau aplikasi.
- Pembanding: ringkasan bebas tanpa rujukan halaman/timestamp yang rawan mencampur fakta dengan asumsi penjualan.

**5. Peran pribadi.** Memastikan pemisahan tegas antara fakta sumber dan interpretasi, serta memverifikasi aturan jawaban saat ditanya anggaran.

**6. Pengujian & kerahasiaan (`A4-U01` & `A4-S01`).**
- Uji pertanyaan anggaran: menghasilkan respons baku *"Informasi anggaran konsultasi belum tersedia pada dokumen dan transkrip simulasi. Anggaran perlu diklarifikasi kepada pihak berwenang"* (tanpa mengarang nominal).
- Tata kelola kerahasiaan (`A4-S01`): hanya memproses dokumen berizin, memverifikasi rujukan ke sumber asli, dan mewajibkan tinjauan manajemen sebelum tim marketing menyiapkan draf komunikasi.

**7. Batasan.** Penyusunan briefing pada tugas ini masih berupa **contoh berbantuan AI yang diperiksa manual**, belum berupa pipeline OCR/transkripsi otomatis penuh.

**8. Pemeliharaan.** Format matriks fakta-interpretasi-hipotesis-klarifikasi di `A4-B01-briefing.html` dapat dipakai ulang sebagai templat standar briefing klien berikutnya.

**9. Biaya & asumsi.** Biaya **Rp0** untuk penyusunan berbasis templat lokal.

---

## A5 — Artikel Jurnalistik dan Tata Letak Majalah

**1. Masalah & pengguna.** Redaksi membutuhkan draf artikel yang akurat berdasarkan bahan terbatas (tanpa melebih-lebihkan klaim penghematan waktu menjadi klaim laba) serta rancangan tata letak 1 halaman yang rapi. Pengguna: editor dan pembaca majalah (*Top Business / It Works*).

**2. Input → proses → output.** Bahan fakta fiktif PT Simulasi Digital Karya (20 staf, 4 minggu, waktu rekap 120 → 90 menit, kutipan Rani koordinator proyek, belum ada audit independen/bukti dampak laba) → penulisan artikel **260 kata** (`A5-N01-artikel.md`, masuk rentang 250–350 kata) → pembuatan grafik batang komparasi (`chart_rekap.png`) → tata letak majalah 1 halaman dua kolom (`A5-L01-layout.pdf` & `.png`).

**3. Tools AI.** Asisten AI membantu penyusunan draf naskah dan skrip grafik `matplotlib`; skrip `tools/test-a5.js` (`A5-U01`) memeriksa akurasi hitungan dan ketiadaan klaim terlarang.

**4. Fitur, keunggulan & pembanding.**
- Perhitungan persentase tepat: $(120 - 90) \div 120 = 25\%$.
- Menggunakan satu-satunya kutipan yang diizinkan: *“Kami masih memeriksa kualitas hasil sebelum memperluas penggunaan.”* (Rani, koordinator proyek simulasi).
- Menegaskan secara eksplisit bahwa temuan belum diaudit independen dan tidak dapat disebut sebagai kenaikan laba atau keberhasilan di seluruh proses kerja.
- Kredit aset jelas: grafik dibuat sendiri dengan `matplotlib` dari data simulasi tes (bukan gambar klaim palsu).

**5. Peran pribadi.** Memeriksa jumlah kata (260 kata), memastikan isi teks pada layout sama persis dengan naskah artikel, dan memeriksa keterbacaan dua kolom beserta pull-quote.

**6. Pengujian (`A5-U01` — 4 pengujian lulus).** Verifikasi rumus 25%, pengecekan kata terlarang (tidak ada klaim kenaikan laba/omzet/jabatan direktur fiktif), kelengkapan fakta (20 staf, 4 minggu, 120→90 menit), serta pencantuman status *memerlukan persetujuan editor*.

**7. Batasan.** Berkas `A5-L01-layout.pdf` adalah **rancangan tata letak contoh dari HTML/PDF, bukan berkas siap cetak produksi** (spesifikasi *bleed*, profil warna CMYK, resolusi gambar cetak offset, dan *proof* produksi belum diuji).

**8. Pemeliharaan.** Naskah dan grafik terpisah sehingga revisi redaksi dari editor dapat langsung diperbarui ke templat layout.

**9. Biaya & asumsi.** Biaya pembuatan rancangan **Rp0**.

---

## A6 — CRM Marketing Berbantuan AI

**1. Masalah & pengguna.** Tim marketing memerlukan database dan pipeline yang melacak prospek, PIC (AE), sektor, kebutuhan awal yang *belum terverifikasi*, jadwal tindak lanjut, dan histori perubahan tanpa duplikasi serta tanpa menganggap minat awal sebagai kebutuhan terkonfirmasi. Pengguna: AE A, AE B, dan Manajer Marketing.

**2. Input → proses → output.**
- *Input:* 10 perusahaan fiktif sesuai soal (`P01` Surya Reka/Manufaktur/AE A/Baru/Pelaporan ESG s.d. `P10` Cipta Sarana/Konstruksi/AE B/Follow-up/Manajemen risiko — seluruh kebutuhan awal berlabel **belum terverifikasi**), input catatan tindak lanjut, serta perubahan status.
- *Proses:* Validasi keunikan ID & nama perusahaan → pemisahan hak akses AE A vs AE B → pencatatan histori perubahan & pembuatan pengingat otomatis saat tanggal tindak lanjut diisi → pembuatan draf pesan oleh asisten AI berstatus *Menunggu persetujuan* → pembatasan bahwa status tidak dapat diubah ke *Penawaran draf* sebelum kebutuhan dikonfirmasi beserta buktinya.
- *Output:* Dashboard ringkasan (10 prospek unik: Baru 3, Kualifikasi 3, Follow-up 3, Penawaran draf 1; AE A: 5, AE B: 5), papan pipeline Kanban, daftar tindak lanjut mendatang, histori perubahan, dan antrean persetujuan draf.

**3. Tools AI.** Asisten berbasis aturan/templat di `A6-crm/js/crm.js` yang merangkum catatan terakhir dan menyusun draf konfirmasi tanpa mengarang nilai penjualan; asisten AI membantu pembuatan UI dan 10 skrip uji otomatis (`A6-U01`).

**4. Fitur, keunggulan & pembanding.**
- Menolak duplikasi prospek baik berdasarkan ID maupun nama perusahaan.
- Menolak perpindahan ke tahap *Penawaran draf* jika kebutuhan masih *Belum terkonfirmasi*.
- Operasi penyimpanan bersifat *idempoten* (menggunakan `opId`), sehingga jika koneksi terputus setelah data tersimpan, tombol *Coba ulang* tidak menggandakan catatan maupun pengingat.
- Pembanding: pencatatan prospek di tabel bebas tanpa penguncian persetujuan draf dan tanpa histori status.

**5. Peran pribadi.** Memastikan ke-10 data perusahaan beserta sektor dan kebutuhan awal dari soal masuk secara lengkap dengan status *belum terverifikasi*, serta menguji skenario P03.

**6. Pengujian & kegagalan (10 uji otomatis lulus — `A6-U01`).**
- Dashboard awal tepat menampilkan 10 prospek unik (Baru 3, Kualifikasi 3, Follow-up 3, Penawaran draf 1) tanpa angka penjualan karangan.
- Memasukkan `P03` kembali → ditolak sebagai duplikat, total prospek tetap **10**.
- Catatan pada `P03` dengan tanggal tindak lanjut simulasi **5 November 2026** (*"Perlu mengonfirmasi apakah perusahaan ingin informasi program awards."*) → otomatis membuat pengingat internal, status kebutuhan tetap *Belum terkonfirmasi*, dan AI menyusun draf *"Apakah Bapak/Ibu berkenan menerima informasi program awards untuk ditinjau?"* dengan status **Menunggu persetujuan**.
- Pengiriman draf ditolak sebelum disetujui oleh peran **Manajer**; AE B ditolak saat mencoba mengubah prospek milik AE A.

**7. Batasan.** Menggunakan penyimpanan `localStorage` dan asisten templat deterministik; pengiriman pesan hanya masuk ke *outbox simulasi* (tidak mengirim email/WhatsApp nyata).

**8. Pemeliharaan.** Struktur data awal dan aturan transisi status terpusat di `A6-crm/js/crm.js` dan diuji otomatis melalui `node --test`.

**9. Biaya & asumsi.** Prototipe **Rp0**.

---

## A7 & A8 — Tautan Laporan, Folder Bukti, dan Demo Utama
- **URL Laporan Lengkap (`AzharZuhro_TesPraktik_MSI.pdf` & `.md`):**
  - PDF: https://azharzuhro12.github.io/tes-praktik-msi/AzharZuhro_TesPraktik_MSI.pdf
  - Markdown (GitHub View): https://github.com/azharzuhro12/tes-praktik-msi/blob/main/AzharZuhro_TesPraktik_MSI.md
- **URL Folder Bukti (`bukti/A1` s.d. `bukti/A6`):**
  - https://github.com/azharzuhro12/tes-praktik-msi/tree/main/bukti
- **URL Demo Utama (Kode: A3 — ID Bukti: `A3-D01`, `A3-U01`, `A3-S01`):**
  - **Rekaman Video Demo Kandidat (`Demo.webm`, 4 menit 15 detik):** https://azharzuhro12.github.io/tes-praktik-msi/bukti/A3/Demo.webm
  - **Aplikasi Web Live A3 (dapat dicoba langsung di browser tanpa login):** https://azharzuhro12.github.io/tes-praktik-msi/A3-penilaian-awards/
- **Petunjuk akses aman:** Seluruh tautan bersifat publik *read-only* (pelihat saja, tanpa hak edit publik), tidak memerlukan kata sandi/kredensial, dan hanya memuat data simulasi fiktif.

---

## Bagian B — Konfirmasi Kesiapan Bekerja dan Gaji
- **B1 (Kesediaan bekerja):** **Bersedia.** Saya bersedia bekerja *full-time*, *on-site* di Jakarta Selatan, dan berkoordinasi langsung dengan CEO.
- **B2 (Ekspektasi gaji bulanan):** **Rp6.000.000 per bulan** (dasar: **THP-net**, masuk rentang Prioritas Kelas A Rp5–6 juta; terbuka untuk diskusi penyesuaian struktur *gross/net* sesuai kebijakan perusahaan).
- **B3 (Batas minimum gaji bulanan):** **Rp5.500.000 per bulan** (dasar: **THP-net**, perlu klarifikasi komponen *gross*/tunjangan jika mendapat penawaran).
- **B4 (Waktu bergabung & komitmen berjalan):** Dapat mulai bekerja **segera (*immediate* / kurang dari 1 minggu setelah penawaran disepakati)**, **tanpa *notice period***, dan saat ini tidak memiliki komitmen pekerjaan/proyek mengikat yang menghalangi kerja *full-time on-site*.
- **B5 (Keunggulan pribadi & kebutuhan dukungan):**
  - *Keunggulan pribadi:* Terbiasa membangun aplikasi web dan workflow otomasi AI dari hulu ke hilir (mulai dari backend FastAPI/Node.js, integrasi LLM/RAG di Dify/Groq/Gemini, workflow n8n, hingga pengujian otomatis dan antarmuka pengguna), selalu menerapkan prinsip *human-in-the-loop* (mode *dry-run* atau persetujuan staf sebelum aksi keluar), serta mendokumentasikan batasan sistem secara jujur. Bukti nyata terlihat pada solusi **A3, A1, A6** serta portofolio **P01–P03** di GitHub.
  - *Tugas MSI yang siap ditangani mandiri:* Pembangunan aplikasi web internal & dashboard penilaian/rekap (**A3**), pembuatan AI agent berbasis Knowledge Base dengan aturan validasi & eskalasi (**A1**), perancangan database/pipeline CRM & otomasi workflow (**A6**), serta produksi konten video/grafis terprogram (**A2**).
  - *Tugas yang memerlukan pendampingan/arahan awal:* Penyelarasan standar penulisan & hipotesis bisnis spesifik MSI Institute pada briefing manajemen (**A4**) serta standar redaksional/pracetak majalah fisik (**A5**) agar selaras dengan pedoman editor dan manajemen MSI.
  - *Kendala kesiapan kerja:* Tidak ada kendala.

---

## Bagian C — Portofolio Proyek AI Terdahulu (`https://github.com/azharzuhro12`)

### C1 — Deskripsi 3 Proyek AI Terdahulu
1. **P01 — BizAssist AI (Asisten FAQ Operasional UMKM Berbasis Sumber)** | Periode: **Oktober 2026** (Proyek portofolio mandiri)
   - *Masalah & pengguna:* Pengetahuan operasional UMKM sering tersebar di catatan dan spreadsheet sehingga staf lama mencari jawaban. Pengguna: staf operasional UMKM.
   - *Fitur:* Antarmuka web chat responsif, indikator status koneksi backend, kontinuitas percakapan (`conversation_id`), validasi input sisi server (batas 2.000 karakter), pesan error ramah dengan tombol **Coba lagi** (*retry*), serta pembatasan ketat agar asisten hanya menjawab dari `faq_umkm.txt` dan menolak mengarang stok/harga.
   - *Teknologi/integrasi:* Python (FastAPI, Pydantic v2, HTTPX async), Dify Chatflow (Knowledge Retrieval), Google Gemini, HTML/CSS/JS murni, `pytest` (`TestClient` & mocking).
   - *Penggunaan AI:* Sebagai fitur utama (RAG + Gemini melalui Dify) dan asisten coding saat pengembangan.
   - *Peran pribadi:* Merancang arsitektur proxy FastAPI–Dify (agar API key tetap aman di server), menyusun basis pengetahuan `faq_umkm.txt`, membuat UI chat, dan menulis pengujian otomatis offline.
   - *Status, pengujian & keterbatasan:* Prototipe lokal fungsional dengan suite pengujian offline (`test_api.py`, `test_frontend.py`, `test_security.py`); belum mencakup autentikasi pengguna dan database produksi.
   - *Relevansi tugas MSI:* Sangat relevan dengan **A1** (agent penjawab berbasis KB yang menolak mengarang jawaban dan memiliki fitur *retry* saat gagal).

2. **P02 — CatatAI (Asisten Pencatatan Keuangan & Piutang UMKM Multimodal)** | Periode: **Oktober 2026** (Proyek portofolio mandiri)
   - *Masalah & pengguna:* Pedagang kecil kesulitan mencatat transaksi harian dan piutang ("bon") ke format akuntansi yang rapi. Pengguna: pelaku UMKM/warung.
   - *Fitur:* Input transaksi via chat bahasa sehari-hari (*"jual bakso 50rb"*, *"bon budi 50rb, udah bayar 20rb"*), input suara (transkripsi Whisper + parsing AI), scan foto struk belanja (AI multimodal), pelacakan & pelunasan piutang, dashboard metrik, laporan periodik, dan *AI insight*.
   - *Teknologi/integrasi:* Next.js 14 (TypeScript, Tailwind CSS, Recharts), FastAPI (Python), Groq (LLM, Whisper, Multimodal), Supabase (PostgreSQL), ter-deploy di Vercel.
   - *Penggunaan AI:* Sebagai fitur inti ekstraksi bahasa alami/suara/gambar menjadi struktur data transaksi & piutang, serta bantuan coding.
   - *Peran pribadi:* Merancang skema database Supabase (`schema.sql`), membangun endpoint REST FastAPI, menyusun prompt ekstraksi transaksi, dan men-deploy frontend serta backend ke Vercel.
   - *Status & keterbatasan:* Aplikasi dan API **live di Vercel**; saat ini masih menggunakan akun demo (`seed-demo.sql`), sedangkan autentikasi multi-user dan pengingat jatuh tempo masih dalam *roadmap*.
   - *Relevansi tugas MSI:* Sangat relevan dengan **A3** (aplikasi web dengan validasi, perhitungan, dan dashboard rekap) serta **A6** (pencatatan status piutang/tindak lanjut dan ringkasan AI).

3. **P03 — Otomasi Workflow n8n: Admin Warehouse & Minori** | Periode: **Oktober 2026** (Proyek portofolio mandiri)
   - *Masalah & pengguna:* Pencatatan barang keluar/masuk gudang dari chat Telegram dan pengiriman pengingat kandidat masih disalin manual. Pengguna: admin gudang dan tim rekrutmen/manajemen.
   - *Fitur:* (a) *Admin Warehouse*: bot Telegram menerima laporan teks bebas → Google Gemini + *Structured Output Parser* mengekstrak `date, type, name, quantity, unit, person` → validasi tanggal → simpan ke Google Sheets & balas konfirmasi Telegram; perintah `laporan` memfilter baris dan mengirimkan file CSV otomatis. (b) *Minori*: jadwal harian pukul 08:00 WIB untuk pencocokan (*matching*) kandidat, pengingat WhatsApp (Fonnte)/email, dan laporan harian manajemen.
   - *Teknologi/integrasi:* n8n (Docker Compose), Telegram Bot API, Google Gemini, Google Sheets OAuth2, Fonnte, SMTP.
   - *Penggunaan AI:* Sebagai fitur ekstraksi pesan bebas menjadi baris tabel terstruktur.
   - *Peran pribadi:* Menyusun alur node n8n, skema parser Gemini, logika validasi tanggal, dan konfigurasi *dry-run*.
   - *Status & keterbatasan:* Workflow fungsional; pada *Minori*, node pengiriman pesan keluar sengaja dinonaktifkan (*dry-run*) hingga kredensial disetujui.
   - *Relevansi tugas MSI:* Sangat relevan dengan **A1 & A6** (ekstraksi berbantuan AI ke tabel, pembuatan pengingat terjadwal, laporan CSV, dan prinsip *dry-run* agar tidak mengirim komunikasi keluar tanpa izin).

### C2 — Keunggulan Proyek dan Bukti Hasil
- **P01 (BizAssist AI):** Keunggulan pada **keamanan kredensial & ketelitian sumber** dibandingkan memanggil API model langsung dari browser. Kunci API Dify tersimpan di backend FastAPI, input divalidasi (maks. 2.000 karakter), dan kegagalan jaringan ditangani dengan tombol *Coba lagi*. *Bukti terukur:* suite uji `pytest` di folder `tests/` dan screenshot sesi live di `docs/screenshots/`. *Belum diukur:* persentase penurunan waktu pencarian informasi pada operasional UMKM nyata.
- **P02 (CatatAI):** Keunggulan pada **kemudahan input multimodal** dibandingkan form akuntansi manual; satu kalimat kasbon otomatis dipisahkan menjadi nilai piutang dan pembayaran sebagian. *Bukti terukur:* aplikasi live Vercel, endpoint `/health`, `supabase/schema.sql`, dan screenshot dashboard/laporan. *Belum diukur:* tingkat akurasi pada ribuan struk tulisan tangan buram di lapangan.
- **P03 (n8n Admin Warehouse & Minori):** Keunggulan pada **ketelitian format tabel & keamanan pengiriman (*dry-run*)** dibandingkan rekap chat manual. *Bukti terukur:* file workflow JSON, visualisasi `graphviz.svg`, dan contoh keluaran `laporan Gudang 2026-09-01 sampai 2026-09-30.csv`. *Belum diukur:* penghematan jam kerja bulanan admin gudang secara kuantitatif.

### C3 — Tautan Demo dan Screenshot Proyek Terdahulu
- **P01 (BizAssist AI):** Repo https://github.com/azharzuhro12/BizAssist-AI · Screenshot berurutan: https://github.com/azharzuhro12/BizAssist-AI/tree/main/docs/screenshots
- **P02 (CatatAI):** Live Demo https://catat-ai-azhars-projects-da34b643.vercel.app · API Health https://catat-ai-api-azhars-projects-da34b643.vercel.app/health · Repo & Screenshot: https://github.com/azharzuhro12/catat-ai/tree/main/docs/screenshots
- **P03 (n8n Workflow):** Repo & CSV hasil https://github.com/azharzuhro12/n8n · Diagram alur: https://github.com/azharzuhro12/n8n/blob/main/minori/graphviz.svg

### C4 — Pernyataan Akhir Kandidat
Saya menyatakan bahwa seluruh informasi, proses pengerjaan, dan kontribusi pribadi saya dalam tes praktik ini dijelaskan secara jujur. Seluruh materi yang dilampirkan boleh dibagikan untuk keperluan evaluasi rekrutmen dan tidak berisi data rahasia pihak mana pun, kredensial, ataupun akses ke sistem produksi. Penggunaan bantuan AI (asisten pemrograman AI Antigravity, `edge-tts`, serta model AI pada proyek portofolio) telah disebutkan secara transparan, dan seluruh tautan bukti telah diperiksa dapat diakses tanpa kata sandi. Saya memahami bahwa pelaksanaan tes praktik ini tidak menjamin penerimaan kerja dan besaran gaji serta ketentuan kerja tetap memerlukan kesepakatan kedua belah pihak.
