// Uji otomatis A6 — bukti A6-U01. Jalankan: node --test tests/*.test.js
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const C = require('../js/crm.js');

const AE_A = { role: 'ae', ae: 'A' };
const AE_B = { role: 'ae', ae: 'B' };
const MGR = { role: 'manajer' };

test('U01 Dashboard awal: 10 prospek unik; Baru 3, Kualifikasi 3, Follow-up 3, Penawaran draf 1', () => {
  const crm = C.createCRM();
  const d = crm.dashboard();
  assert.equal(d.total, 10);
  assert.deepEqual(d.byStatus, { Baru: 3, Kualifikasi: 3, 'Follow-up': 3, 'Penawaran draf': 1 });
  assert.deepEqual(d.byAE, { A: 5, B: 5 });
  assert.ok(!('nilaiPenjualan' in d), 'tidak mengarang nilai penjualan');
});

test('U02 Masukkan P03 lagi: total tetap 10, duplikasi ditandai (ID maupun nama)', () => {
  const crm = C.createCRM();
  const r1 = crm.addProspect(AE_A, { id: 'P03', company: 'PT Simulasi Tani Makmur', ae: 'A' });
  assert.equal(r1.ok, false); assert.equal(r1.duplicate, true);
  const r2 = crm.addProspect(AE_A, { id: 'P11', company: 'pt simulasi tani makmur', ae: 'A' });
  assert.equal(r2.duplicate, true); assert.equal(r2.existingId, 'P03');
  assert.equal(crm.dashboard().total, 10);
});

test('U03 P03 dari agent A1 dirujuk ke prospek yang ada (aktivitas, bukan prospek baru)', () => {
  const crm = C.createCRM();
  const r = crm.importFromAgent({ id: 'P03', company: 'PT Simulasi Tani Makmur', question: 'Apakah harus menjadi sponsor?' });
  assert.equal(r.ok, true); assert.equal(r.linkedTo, 'P03');
  assert.equal(crm.dashboard().total, 10);
  assert.match(crm.getDb().prospects.find((p) => p.id === 'P03').notes[0].text, /sponsor/);
});

test('U04 Contoh catatan P03: tindak lanjut 2026-11-05, pengingat dibuat, kebutuhan tetap Belum terkonfirmasi', () => {
  const crm = C.createCRM();
  const r = crm.addNote(AE_A, 'P03', 'Perlu mengonfirmasi apakah perusahaan ingin informasi program awards.', '2026-11-05');
  assert.equal(r.ok, true);
  const db = crm.getDb();
  const p = db.prospects.find((x) => x.id === 'P03');
  assert.equal(p.status, 'Follow-up');
  assert.equal(p.need, 'Belum terkonfirmasi');
  assert.equal(p.nextFollowUp, '2026-11-05');
  assert.ok(p.notes[0].at && p.notes[0].source, 'sumber dan waktu pencatatan tersimpan');
  assert.equal(db.reminders.length, 1);
  assert.match(db.reminders[0].note, /bukan izin mengirim/);
  assert.equal(crm.dashboard().upcoming[0].id, 'P03');
});

test('U05 Draf AI: Menunggu persetujuan, tidak terkirim tanpa persetujuan manajer', () => {
  const crm = C.createCRM();
  crm.addNote(AE_A, 'P03', 'Perlu mengonfirmasi apakah perusahaan ingin informasi program awards.', '2026-11-05');
  const r = crm.createAiDraft(AE_A, 'P03');
  const dr = crm.getDb().drafts.find((x) => x.id === r.draftId);
  assert.equal(dr.text, 'Apakah Bapak/Ibu berkenan menerima informasi program awards untuk ditinjau?');
  assert.equal(dr.status, 'Menunggu persetujuan');
  assert.equal(crm.sendDraft(AE_A, r.draftId).ok, false);
  assert.equal(crm.approveDraft(AE_A, r.draftId).ok, false, 'AE tidak bisa menyetujui sendiri');
  assert.equal(crm.getDb().outbox.length, 0);
  assert.equal(crm.approveDraft(MGR, r.draftId).ok, true);
  assert.equal(crm.sendDraft(AE_A, r.draftId).ok, true);
  assert.match(crm.getDb().outbox[0].note, /SIMULASI/);
});

test('U06 Minat awal tidak dianggap kebutuhan terkonfirmasi: Penawaran draf ditolak sampai dikonfirmasi dengan bukti', () => {
  const crm = C.createCRM();
  const r = crm.updateStatus(AE_A, 'P03', 'Penawaran draf');
  assert.equal(r.ok, false); assert.match(r.error, /belum terkonfirmasi/);
  assert.equal(crm.confirmNeed(AE_A, 'P03', 'Informasi program awards', '').ok, false, 'bukti wajib');
  assert.equal(crm.confirmNeed(AE_A, 'P03', 'Informasi program awards', 'Balasan tertulis klien (simulasi)').ok, true);
  assert.equal(crm.updateStatus(AE_A, 'P03', 'Penawaran draf').ok, true);
});

test('U07 Perubahan status tercatat pada histori', () => {
  const crm = C.createCRM();
  crm.updateStatus(AE_A, 'P01', 'Kualifikasi');
  const h = crm.getDb().history.filter((x) => x.prospectId === 'P01');
  assert.equal(h.length, 1);
  assert.equal(h[0].action, 'Status: Baru → Kualifikasi');
  assert.equal(h[0].by, 'AE A');
  assert.deepEqual(crm.dashboard().byStatus, { Baru: 2, Kualifikasi: 4, 'Follow-up': 3, 'Penawaran draf': 1 });
});

test('U08 Pemisahan hak akses: AE B tidak bisa mengubah prospek AE A', () => {
  const crm = C.createCRM();
  const r = crm.updateStatus(AE_B, 'P03', 'Kualifikasi');
  assert.equal(r.ok, false); assert.match(r.error, /Akses ditolak/);
  assert.equal(crm.addNote(AE_B, 'P03', 'x').ok, false);
  assert.equal(crm.updateStatus(MGR, 'P03', 'Kualifikasi').ok, true);
});

test('U09 Gagal sebelum tersimpan: pesan tampil, data tidak hilang, coba ulang menyimpan sekali', () => {
  const storage = C.memoryStorage();
  const crm = C.createCRM({ storage });
  crm.simulateFailure('before');
  const r = crm.addProspect(MGR, { id: 'P11', company: 'PT Simulasi Baru Sekali', ae: 'B' });
  assert.equal(r.ok, false); assert.equal(r.retryable, true);
  assert.equal(crm.dashboard().total, 10);
  const again = crm.retry();
  assert.equal(again.ok, true);
  assert.equal(crm.dashboard().total, 11);
  assert.equal(C.createCRM({ storage }).dashboard().total, 11, 'tersimpan permanen');
});

test('U10 Gagal SETELAH tersimpan (respons hilang): coba ulang tidak membuat duplikasi', () => {
  const crm = C.createCRM();
  crm.simulateFailure('after');
  const r = crm.addNote(AE_A, 'P07', 'Catatan simulasi', '2026-11-10');
  assert.equal(r.ok, false); assert.equal(r.retryable, true);
  const again = crm.retry();
  assert.equal(again.ok, true); assert.equal(again.alreadyApplied, true);
  const db = crm.getDb();
  assert.equal(db.prospects.find((p) => p.id === 'P07').notes.length, 1, 'catatan tidak ganda');
  assert.equal(db.reminders.length, 1, 'pengingat tidak ganda');
});

