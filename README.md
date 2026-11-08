# Tes Praktik AI & Automation Specialist - MSI Group

**Kandidat:** Azhar Zuhro  
**Email:** azharzuhro74@gmail.com  
**GitHub Profil:** [https://github.com/azharzuhro12](https://github.com/azharzuhro12)  
**Batas Pengumpulan:** Senin, 9 November 2026  
**Status Solusi Utama:** **A3 — Aplikasi Web Penilaian Awards (Simulasi)**

---

## 📌 Disclaimer Simulasi
> **PERINGATAN ETIKA & KEBIJAKAN PENGUJIAN:**  
> Seluruh skenario, data peserta, kriteria penjurian, dokumen perusahaan, dan naskah yang ada dalam repositori ini merupakan **SIMULASI UJI KOMPETENSI REKRUTMEN**, bukan data produksi atau kebijakan resmi MSI Group / ajang penghargaan riil. Tidak ada kontak nyata, tidak ada kredensial produksi, dan tidak ada pengiriman data sensitif ke pihak eksternal.

---

## 📂 Struktur Repositori & Bukti Evaluasi

| Kasus | Nama Studi Kasus | Status | Folder / Sumber | Bukti Utama |
| :--- | :--- | :--- | :--- | :--- |
| **A0 / A3** | **Aplikasi Web Penilaian Awards (Solusi Utama)** | **Berjalan Penuh** | [`/A3-penilaian-awards`](./A3-penilaian-awards) | [Video Demo Langsung](./bukti/A3/Demo.webm) & [Laporan Uji](./bukti/A3/A3-U01-unit-test.txt) |
| **A1** | AI Agent Layanan & Prospek Awards | Prototipe Berjalan | [`/A1-agent-layanan`](./A1-agent-layanan) | [Screenshot & Log](./bukti/A1/) |
| **A2** | Video Vertikal AI (9:16 Motion Graphics) | Selesai (Rendered) | [`/tools/make-a2-anim.py`](./tools/make-a2-anim.py) | [Video MP4](./bukti/A2/A2-V01-video-vertikal.mp4) & [SRT](./bukti/A2/A2-S01-subtitle.srt) |
| **A4** | Analisis Dokumen & Video jadi Executive Briefing | Selesai | [`/bukti/A4`](./bukti/A4) | [PDF 1 Halaman](./bukti/A4/A4-B01-briefing.pdf) & [Alur Akses](./bukti/A4/A4-S01-alur-akses-dan-persetujuan.md) |
| **A5** | Jurnalistik Data & Tata Letak 1 Halaman | Selesai | [`/bukti/A5`](./bukti/A5) | [Artikel MD](./bukti/A5/A5-N01-artikel.md) & [Layout PDF](./bukti/A5/A5-L01-layout.pdf) |
| **A6** | Pipeline CRM & Penjadwalan Wawancara | Prototipe Berjalan | [`/A6-crm`](./A6-crm) | [Screenshot](./bukti/A6/) & [Log Uji](./bukti/A6/A6-U01-hasil-uji.txt) |

---

## 🚀 Cara Menjalankan Solusi Utama (A3) Secara Lokal

Aplikasi web A3 dirancang dengan arsitektur web modern tanpa ketergantungan rumit:

```bash
# Clone repositori
git clone https://github.com/azharzuhro12/tes-praktik-msi.git
cd tes-praktik-msi/A3-penilaian-awards

# Jalankan server lokal sederhana (Python atau Node.js)
python3 -m http.server 8080

# Buka peramban di http://localhost:8080
```

### Menjalankan Automated Unit Tests:
```bash
# Dari root repositori
node --test A3-penilaian-awards/tests/scoring.test.js
node --test A1-agent-layanan/tests/agent.test.js
node --test A6-crm/tests/crm.test.js
node tools/test-a4.js
node tools/test-a5.js
```

---

## 📄 Dokumen Laporan Lengkap
- Dokumen Laporan Eksekutif: [`AzharZuhro_TesPraktik_MSI.md`](./AzharZuhro_TesPraktik_MSI.md)
- Dokumen PDF Siap Cetak: [`AzharZuhro_TesPraktik_MSI.pdf`](./AzharZuhro_TesPraktik_MSI.pdf)
- Draf Isian Google Form: [`DRAF_JAWABAN_FORM.md`](./DRAF_JAWABAN_FORM.md)
