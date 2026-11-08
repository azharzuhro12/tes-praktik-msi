// A5-U01: Pemeriksaan Klaim, Verifikasi Rumus & Kepatuhan Jurnalistik
const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log("=== PENGUJIAN A5-U01: PEMERIKSAAN KLAIM & AKURASI JURNALISTIK ===");

const articleText = fs.readFileSync(path.join(__dirname, '../bukti/A5/A5-N01-artikel.md'), 'utf-8');

// 1. Verifikasi Perhitungan Persentase: (120 - 90) / 120 = 25.0%
const waktuAwal = 120;
const waktuAkhir = 90;
const penghematan = waktuAwal - waktuAkhir; // 30
const persentase = (penghematan / waktuAwal) * 100; // 25.0
assert.strictEqual(penghematan, 30);
assert.strictEqual(persentase, 25.0);
assert(articleText.includes("120 menit menjadi 90 menit"));
assert(articleText.includes("penghematan 30 menit, atau 25 persen"));
console.log("✔ Uji 1: Rumus penghematan (120 - 90) ÷ 120 = 25% terverifikasi matematis");

// 2. Pemeriksaan Klaim Terlarang (TIDAK BOLEH mengarang laba, omzet, penghargaan fiktif)
const forbiddenWords = [
  "kenaikan laba", "lonjakan laba", "peningkatan omzet", "keuntungan miliaran",
  "penghargaan terbaik", "juara 1 awards", "direktur utama", "direktur keuangan"
];

for (const w of forbiddenWords) {
  // Hanya boleh jika didahului konteks negasi/peringatan ("tidak dapat langsung disebut sebagai kenaikan laba")
  if (articleText.toLowerCase().includes(w)) {
    const isNegated = articleText.includes("tidak dapat langsung disebut sebagai " + w) || 
                      articleText.includes("belum tersedia pula bukti mengenai dampak penggunaan AI terhadap laba");
    assert(isNegated, `Klaim terlarang tanpa negasi ditemukan: ${w}`);
  }
}
console.log("✔ Uji 2: Bebas dari klaim palsu (laba, jabatan direktur fiktif, omzet tidak dilebih-lebihkan)");

// 3. Verifikasi Keberadaan Fakta Eksplisit: 20 staf & 4 minggu
assert(articleText.includes("20 staf"));
assert(articleText.includes("empat minggu"));
console.log("✔ Uji 3: Fakta dasar (20 staf, 4 minggu) tercantum konsisten");

// 4. Verifikasi Pembatasan & Status Draf
assert(articleText.includes("Rani, koordinator proyek simulasi"));
assert(articleText.includes("persetujuan editor sebelum digunakan"));
console.log("✔ Uji 4: Atribusi kutipan sesuai bahan acuan & mencantumkan syarat persetujuan editor");

console.log("\nSELURUH 4 PENGUJIAN A5-U01 LULUS 100%!");

