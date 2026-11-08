// Uji otomatis A1 — bukti A1-U01. Jalankan: node --test tests/*.test.js
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const A = require('../js/agent.js');

const P03 = { id: 'P03', company: 'PT Simulasi Tani Makmur', contact: 'Kontak dummy' };

test('U01 Sponsor: jawaban dari KB03, tanpa eskalasi', () => {
  const r = A.answer('Apakah harus menjadi sponsor?');
  assert.equal(r.text, 'Sponsorship bersifat opsional dan tidak menentukan hasil penilaian.');
  assert.deepEqual(r.refs, ['KB03']);
  assert.equal(r.escalate, false);
});

test('U02 Jaminan bintang 5: tidak menjanjikan, rujukan KB04, diteruskan ke staf', () => {
  const r = A.answer('Bisakah dijamin mendapat bintang 5?');
  assert.equal(r.text, 'Saya tidak dapat menjanjikan penghargaan atau level bintang tertentu. Saya akan meneruskan pertanyaan Anda kepada staf.');
  assert.deepEqual(r.refs, ['KB04']);
  assert.equal(r.escalate, true);
  const r2 = A.answer('Kalau kami jadi sponsor, apakah dijamin bintang 5?');
  assert.deepEqual(r2.refs, ['KB03', 'KB04'], 'KB03 ikut bila dikaitkan dengan sponsorship');
});

test('U03 Harga paket + tanggal wawancara: KB02 dan KB04, perlu staf', () => {
  const r = A.answer('Berapa harga paket serta tanggal wawancara saya?');
  assert.equal(r.text, 'Informasi tarif dan jadwal spesifik belum tersedia dalam acuan saya. Jadwal wawancara dikoordinasikan setelah verifikasi. Pertanyaan Anda perlu ditindaklanjuti staf.');
  assert.deepEqual(r.refs, ['KB02', 'KB04']);
  assert.equal(r.escalate, true);
  assert.ok(!/Rp|\d{2}\s?(nov|des)/i.test(r.text), 'tidak mengarang angka/tanggal');
});

test('U04 Biaya pendaftaran: KB01', () => {
  const r = A.answer('Apakah pendaftaran dipungut biaya?');
  assert.deepEqual(r.refs, ['KB01']);
  assert.equal(r.escalate, false);
});

test('U05 Di luar KB: tidak menebak, tanpa rujukan palsu, masuk antrean staf', () => {
  const sys = A.createAgentSystem();
  const res = sys.handleInquiry(P03, 'Di mana lokasi malam penganugerahan?');
  assert.equal(res.ok, true);
  assert.deepEqual(res.answer.refs, []);
  assert.equal(res.answer.outOfKb, true);
  assert.ok(res.ticket && res.ticket.reason === 'Di luar KB');
  assert.equal(sys.getDb().staffQueue.length, 1);
});

test('U06 P03 dimasukkan dua kali: hanya satu prospek tersimpan', () => {
  const sys = A.createAgentSystem();
  const a = sys.handleInquiry(P03, 'Apakah harus menjadi sponsor?');
  const b = sys.handleInquiry({ id: 'p03', company: 'PT  Simulasi Tani Makmur ', contact: '' }, 'Berapa harga paket serta tanggal wawancara saya?');
  assert.equal(a.duplicate, false);
  assert.equal(b.duplicate, true);
  const db = sys.getDb();
  assert.equal(db.prospects.length, 1);
  assert.equal(db.prospects[0].inquiries, 2);
  assert.equal(db.conversations.length, 2, 'percakapan tetap tercatat dua');
  // nama sama tanpa ID sama -> tetap dianggap duplikat
  const c = sys.handleInquiry({ id: 'P03', company: 'Simulasi Tani Makmur' }, 'Apakah harus menjadi sponsor?');
  assert.equal(c.duplicate, true);
  assert.equal(sys.getDb().prospects.length, 1);
  // ID sama tapi perusahaan berbeda -> ditolak, bukan ditimpa
  const d = sys.handleInquiry({ id: 'P03', company: 'PT Simulasi Lain' }, 'Apakah harus menjadi sponsor?');
  assert.equal(d.ok, false);
  assert.match(d.error, /sudah dipakai/);
});

test('U07 Database gagal: tampil gagal + coba ulang, tanpa keberhasilan palsu', () => {
  const storage = A.memoryStorage();
  const sys = A.createAgentSystem({ storage });
  sys.simulateFailure(1);
  const res = sys.handleInquiry(P03, 'Apakah harus menjadi sponsor?');
  assert.equal(res.ok, false);
  assert.equal(res.retryable, true);
  assert.match(res.error, /BELUM tersimpan/);
  assert.equal(res.answer.refs[0], 'KB03', 'jawaban KB tetap bisa ditampilkan');
  assert.equal(sys.getDb().prospects.length, 0);
  assert.equal(sys.getDb().drafts.length, 0);
  assert.equal(storage.getItem('msi-a1-agent-v1'), null);
  const again = sys.retry();
  assert.equal(again.ok, true);
  assert.equal(sys.getDb().prospects.length, 1);
  assert.equal(sys.retry().ok, false, 'retry kedua tidak menggandakan data');
  assert.equal(sys.getDb().prospects.length, 1);
});

test('U08 Draf follow-up: Menunggu persetujuan, tidak bisa dikirim sebelum disetujui staf', () => {
  const sys = A.createAgentSystem();
  const res = sys.handleInquiry(P03, 'Apakah harus menjadi sponsor? Berapa harga paket serta tanggal wawancara saya?');
  assert.equal(res.draft.status, 'Menunggu persetujuan');
  assert.equal(res.draft.text, 'Terima kasih atas pertanyaannya. Sponsorship bersifat opsional dan tidak menentukan hasil penilaian. Staf akan menindaklanjuti pertanyaan tarif dan jadwal setelah verifikasi.');
  const send1 = sys.sendDraft({ role: 'staf' }, res.draft.id);
  assert.equal(send1.ok, false);
  assert.match(send1.error, /tidak dapat dikirim sebelum disetujui/);
  assert.equal(sys.getDb().outbox.length, 0);
  assert.equal(sys.approveDraft({ role: 'agent' }, res.draft.id).ok, false, 'AI/agent tidak boleh menyetujui');
  assert.equal(sys.approveDraft({ role: 'staf', name: 'Staf Simulasi' }, res.draft.id).ok, true);
  assert.equal(sys.sendDraft({ role: 'staf' }, res.draft.id).ok, true);
  const db = sys.getDb();
  assert.equal(db.outbox.length, 1);
  assert.match(db.outbox[0].note, /SIMULASI/);
});

test('U09 Prospek baru disimpan dengan kebutuhan "Belum terkonfirmasi" dan sumber', () => {
  const sys = A.createAgentSystem();
  sys.handleInquiry(P03, 'Apakah harus menjadi sponsor?');
  const p = sys.getDb().prospects[0];
  assert.equal(p.need, 'Belum terkonfirmasi');
  assert.match(p.source, /A1/);
  assert.ok(p.createdAt);
});

