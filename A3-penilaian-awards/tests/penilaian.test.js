// Uji otomatis A3 (Node.js >= 18): node --test tests/
// SIMULASI TES PRAKTIK MSI Group — bukti A3-U01.
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const S = require('../js/scoring.js');
const { createStore, memoryStorage } = require('../js/store.js');

const admin = { role: 'admin' };
const J1 = { role: 'juri', juryId: 'J1' };
const J2 = { role: 'juri', juryId: 'J2' };

function recapMap(recap) {
  const m = {};
  for (const r of recap) {
    m[r.participantId] = { final: r.final, status: r.status };
    for (const pj of r.perJury) m[`${r.participantId}-${pj.juryId}`] = pj.value;
  }
  return m;
}

test('U01 Nilai per juri sesuai tabel naskah acuan', () => {
  const m = recapMap(S.buildRecap(S.sampleState()));
  assert.equal(m['S01-J1'], 73.0);
  assert.equal(m['S01-J2'], 75.0);
  assert.equal(m['S02-J1'], 72.0);
  assert.equal(m['S02-J2'], 73.0);
  assert.equal(m['S03-J1'], 83.0);
  assert.equal(m['S03-J2'], 80.0);
});

test('U02 Nilai perusahaan: S01 = 74,0; S02 = 72,5; S03 = 81,5', () => {
  const recap = S.buildRecap(S.sampleState());
  const f = Object.fromEntries(recap.map((r) => [r.participantId, S.formatScore(r.finalRaw)]));
  assert.deepEqual(f, { S01: '74,0', S02: '72,5', S03: '81,5' });
  recap.forEach((r) => assert.equal(r.status, 'Lengkap'));
});

test('U03 Skor 6 ditolak dengan pesan rentang 0–5 (juga -1, teks)', () => {
  const r = S.validateScore(6);
  assert.equal(r.ok, false);
  assert.match(r.error, /rentang 0–5/);
  assert.equal(S.validateScore(-1).ok, false);
  assert.equal(S.validateScore('abc').ok, false);
  assert.equal(S.validateScore(5).ok, true);
  assert.equal(S.validateScore(0).ok, true);
  assert.equal(S.validateScore('4,5').value, 4.5);

  const store = createStore();
  const before = store.getState().scores.S01.J1;
  const res = store.saveScore(J1, 'S01', 'J1', { strategi: 6, implementasi: 3, hasil: 4 });
  assert.equal(res.ok, false);
  assert.match(res.fieldErrors.strategi, /rentang 0–5/);
  assert.deepEqual(store.getState().scores.S01.J1, before, 'data lama tidak berubah');
});

test('U04 Isian J2 kosong -> Belum lengkap, bukan nol dan bukan nilai final', () => {
  const store = createStore();
  const res = store.saveScore(J2, 'S01', 'J2', { strategi: '', implementasi: '', hasil: '' });
  assert.equal(res.ok, true);
  const r = store.recap().find((x) => x.participantId === 'S01');
  assert.equal(r.status, 'Belum lengkap');
  assert.equal(r.final, null);
  assert.equal(r.completeCount, 1);
  const j2 = r.perJury.find((x) => x.juryId === 'J2');
  assert.equal(j2.value, null, 'tidak dihitung sebagai 0');
  // sebagian terisi juga belum lengkap
  store.saveScore(J2, 'S01', 'J2', { strategi: 4, implementasi: 4, hasil: '' });
  assert.equal(store.recap()[0].status, 'Belum lengkap');
  assert.match(store.exportCSV(), /S01;PT Simulasi Peserta Satu;1\/2;Belum lengkap;Belum lengkap/);
});

test('U05 Bobot 50/30/20 -> dihitung ulang, S01 J1 = 74,0', () => {
  const store = createStore();
  const res = store.setWeights(admin, { strategi: 50, implementasi: 30, hasil: 20 });
  assert.equal(res.ok, true);
  const m = recapMap(store.recap());
  assert.equal(m['S01-J1'], 74.0);
  // S01 J2 = 4/5*50 + 4/5*30 + 3/5*20 = 40 + 24 + 12 = 76 ; rata-rata 75,0
  assert.equal(m['S01-J2'], 76.0);
  assert.equal(m.S01.final, 75.0);
});

test('U06 Total bobot != 100% ditolak dan bobot lama tetap', () => {
  const store = createStore();
  for (const w of [{ strategi: 50, implementasi: 30, hasil: 30 }, { strategi: 40, implementasi: 35, hasil: 20 }, { strategi: -10, implementasi: 60, hasil: 50 }]) {
    const res = store.setWeights(admin, w);
    assert.equal(res.ok, false);
  }
  assert.match(store.setWeights(admin, { strategi: 50, implementasi: 30, hasil: 30 }).error, /110%.*tepat 100%/);
  assert.deepEqual(store.getState().criteria.map((c) => c.weight), [40, 35, 25]);
});

test('U07 Ekspor CSV sama dengan dashboard (sumber angka tunggal)', () => {
  const store = createStore();
  const csv = store.exportCSV();
  for (const r of store.recap()) {
    assert.ok(csv.includes(`${r.participantId};${r.participantName};2/2;Lengkap;${S.formatScore(r.finalRaw)}`));
    for (const pj of r.perJury) {
      assert.ok(csv.includes(`;${pj.juryId};`) && csv.includes(S.formatScore(pj.raw)));
    }
  }
  assert.match(csv, /S01;PT Simulasi Peserta Satu;2\/2;Lengkap;74,0/);
  assert.match(csv, /S02;PT Simulasi Peserta Dua;2\/2;Lengkap;72,5/);
  assert.match(csv, /S03;PT Simulasi Peserta Tiga;2\/2;Lengkap;81,5/);
});

test('U08 Penyimpanan gagal: tidak ada keberhasilan palsu, data tidak berubah, coba ulang berhasil', () => {
  const storage = memoryStorage();
  const store = createStore({ storage });
  store.simulateFailure(1);
  const res = store.saveScore(J1, 'S01', 'J1', { strategi: 5, implementasi: 5, hasil: 5 });
  assert.equal(res.ok, false);
  assert.equal(res.retryable, true);
  assert.match(res.error, /BELUM tersimpan/);
  assert.equal(store.getState().scores.S01.J1.strategi, 4, 'memori tidak berubah');
  assert.equal(storage.getItem('msi-a3-penilaian-v1'), null, 'tidak ada yang tertulis');
  assert.equal(store.recap()[0].final, 74.0);

  const retry = store.retry();
  assert.equal(retry.ok, true);
  assert.equal(store.getState().scores.S01.J1.strategi, 5);
  const persisted = JSON.parse(storage.getItem('msi-a3-penilaian-v1'));
  assert.equal(persisted.scores.S01.J1.strategi, 5);
  // data tersimpan dapat dimuat ulang (refresh halaman)
  const reloaded = createStore({ storage });
  assert.equal(reloaded.getState().scores.S01.J1.strategi, 5);
});

test('U09 Hak akses simulasi: juri hanya mengubah penilaiannya sendiri; bobot hanya admin', () => {
  const store = createStore();
  const r1 = store.saveScore(J1, 'S01', 'J2', { strategi: 1, implementasi: 1, hasil: 1 });
  assert.equal(r1.ok, false);
  assert.match(r1.error, /Akses ditolak/);
  assert.equal(store.saveScore(admin, 'S01', 'J1', { strategi: 1, implementasi: 1, hasil: 1 }).ok, false);
  assert.equal(store.setWeights(J1, { strategi: 50, implementasi: 30, hasil: 20 }).ok, false);
  assert.equal(store.getState().scores.S01.J2.strategi, 4);
});

test('U10 Peserta duplikat ditolak; jejak audit tercatat', () => {
  const store = createStore();
  assert.equal(store.addParticipant(admin, 'S01', 'Duplikat').ok, false);
  assert.equal(store.addParticipant(admin, 'S04', 'PT Simulasi Peserta Empat').ok, true);
  const r = store.recap().find((x) => x.participantId === 'S04');
  assert.equal(r.status, 'Belum lengkap');
  assert.equal(r.final, null);
  const audit = store.getState().audit.map((a) => a.action);
  assert.ok(audit.some((a) => a.includes('Menambah peserta S04')));
});

test('U11 Pembulatan 1 desimal tidak terpengaruh galat floating point', () => {
  assert.equal(S.round1(72.45), 72.5);
  assert.equal(S.round1(72.44), 72.4);
  assert.equal(S.formatScore(80), '80,0');
});

test('U12 Juri dapat ditambah dan dikurang; perhitungan menyesuaikan jumlah juri', () => {
  const store = createStore();
  // Tambah juri J3
  const addRes = store.addJury(admin, 'J3', 'Juri 3 (simulasi)');
  assert.equal(addRes.ok, true);
  assert.equal(store.getState().juries.length, 3);
  
  // Karena J3 belum mengisi, status seluruh peserta jadi Belum lengkap
  const recap3 = store.recap();
  assert.equal(recap3[0].status, 'Belum lengkap');
  assert.equal(recap3[0].juryCount, 3);
  assert.equal(recap3[0].completeCount, 2);

  // Duplikat juri ditolak
  assert.equal(store.addJury(admin, 'J3', 'Duplikat').ok, false);

  // Juri J3 mengisi skor untuk S01: 5, 5, 5 -> nilai 100
  const J3 = { role: 'juri', juryId: 'J3' };
  const sRes = store.saveScore(J3, 'S01', 'J3', { strategi: 5, implementasi: 5, hasil: 5 });
  assert.equal(sRes.ok, true);

  // Rata-rata 3 juri: (73 + 75 + 100) / 3 = 248 / 3 = 82.666... -> 82,7
  const rS01 = store.recap().find((x) => x.participantId === 'S01');
  assert.equal(rS01.completeCount, 3);
  assert.equal(rS01.status, 'Lengkap');
  assert.equal(rS01.final, 82.7);

  // Hapus juri J3
  const remRes = store.removeJury(admin, 'J3');
  assert.equal(remRes.ok, true);
  assert.equal(store.getState().juries.length, 2);
  // S01 kembali ke rata-rata 2 juri: 74,0
  assert.equal(store.recap().find((x) => x.participantId === 'S01').final, 74.0);

  // Hapus juri hingga tersisa 1 diperbolehkan, tapi tidak boleh 0
  assert.equal(store.removeJury(admin, 'J2').ok, true);
  assert.equal(store.removeJury(admin, 'J1').ok, false, 'minimal 1 juri');
});

