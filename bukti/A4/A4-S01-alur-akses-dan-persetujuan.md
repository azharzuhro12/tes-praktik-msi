# ALUR AKSES DOKUMEN & PERSETUJUAN KEPATUHAN A4
**Kode Dokumen**: A4-S01 | **Sifat**: SIMULASI TES PRAKTIK MSI GROUP

```mermaid
flowchart TD
    subgraph Input ["1. Sumber Masukan (Hanya Dokumen Berizin)"]
        D1["Dokumen Simulasi Awards (Hal 1-3)"]
        D2["Transkrip Wawancara Simulasi (00:20 - 01:10)"]
    end

    subgraph AI ["2. Pemrosesan AI Terkendali"]
        E1["Ekstraksi Fakta Literal & Rujukan"]
        E2["Pemisahan Ketat: Fakta vs Opini/Interpretasi"]
        E3["Penyusunan Pertanyaan Klarifikasi & Hipotesis"]
    end

    subgraph Guard ["3. Pagar Kepatuhan & Validasi"]
        G1{"Pertanyaan Anggaran / Klaim Diluar Dokumen?"}
        G2["Blokir: Berikan Jawaban Standar Kepatuhan<br><i>'Anggaran belum tersedia di acuan; klarifikasi ke pihak berwenang'</i>"]
        G3["Lolos Validasi Fakta"]
    end

    subgraph HumanReview ["4. Tinjauan Manusia (Human-in-the-Loop)"]
        H1["Review Konsultan / Analis Utama"]
        H2["Persetujuan Manajemen MSI Institute"]
    end

    subgraph Action ["5. Tindak Lanjut"]
        M1["Briefing Internal Manajemen (A4-B01)"]
        M2["Diskusi Klarifikasi dengan Klien (Tanpa Penawaran Liar)"]
    end

    D1 --> E1
    D2 --> E1
    E1 --> E2 --> E3 --> G1
    G1 -- "Ada Pertanyaan Anggaran" --> G2 --> H1
    G1 -- "Sesuai Fakta" --> G3 --> H1
    H1 --> H2 --> M1
    H2 --> M2
```

### Keterangan Kebijakan Akses:
1. **Prinsip Least-Privilege & Data Berizin**: Agen AI tidak diberi akses ke data rahasia perusahaan atau sistem ERP klien, melainkan hanya transkrip dan lembar data simulasi resmi.
2. **Ketiadaan Penawaran Otomatis**: Hasil analisis AI tidak pernah dikirimkan langsung ke calon klien sebagai proposal. Seluruh keluaran berstatus draf internal bagi manajemen.

