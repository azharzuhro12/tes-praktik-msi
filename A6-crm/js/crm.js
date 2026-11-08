/*
 * crm.js — Logika A6: CRM marketing berbantuan AI (SIMULASI MSI Group).
 * Fokus: database & pipeline — prospek, kebutuhan, penanggung jawab (AE), aktivitas,
 * tindak lanjut, histori perubahan, hak akses, dan penyimpanan aman saat gagal.
 *
 * "AI" di prototipe ini = asisten berbasis aturan/templat yang merangkum catatan dan
 * menyusun draf dari data yang ADA (tidak mengarang nilai penjualan/kebutuhan).
 * Titik ganti LLM: fungsi aiSuggest(). Status & kebutuhan tetap diputuskan AE.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.CRM = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const STATUSES = ['Baru', 'Kualifikasi', 'Follow-up', 'Penawaran draf'];
  const NEED_UNCONFIRMED = 'Belum terkonfirmasi';

  const SEED = [
    ['P01', 'PT Simulasi Surya Reka', 'A', 'Baru', 'Manufaktur', 'Pelaporan ESG'],
    ['P02', 'PT Simulasi Laut Biru', 'B', 'Kualifikasi', 'Logistik', 'Efisiensi energi'],
    ['P03', 'PT Simulasi Tani Makmur', 'A', 'Follow-up', 'Agribisnis', 'Pemetaan emisi'],
    ['P04', 'PT Simulasi Bina Dana', 'B', 'Penawaran draf', 'Keuangan', 'Pelatihan internal'],
    ['P05', 'PT Simulasi Mitra Sehat', 'A', 'Baru', 'Kesehatan', 'Tata kelola'],
    ['P06', 'PT Simulasi Digital Karya', 'B', 'Kualifikasi', 'Teknologi', 'Literasi ESG'],
    ['P07', 'PT Simulasi Tirta Lestari', 'A', 'Follow-up', 'Air bersih', 'Indikator kinerja'],
    ['P08', 'PT Simulasi Daya Hijau', 'B', 'Baru', 'Energi', 'Pelaporan dampak'],
    ['P09', 'PT Simulasi Niaga Sentosa', 'A', 'Kualifikasi', 'Perdagangan', 'Database prospek'],
    ['P10', 'PT Simulasi Cipta Sarana', 'B', 'Follow-up', 'Konstruksi', 'Manajemen risiko'],
  ];

  const norm = (s) => String(s || '').toLowerCase().replace(/\b(pt|cv|tbk)\b/g, '').replace(/[^a-z0-9]/g, '');
  const clone = (o) => JSON.parse(JSON.stringify(o));

  function memoryStorage() {
    const m = new Map();
    return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k) };
  }

  function seedDb(at) {
    return {
      prospects: SEED.map(([id, company, ae, status, sector, claimedNeed]) => ({
        id, company, ae, status, sector, claimedNeed: claimedNeed + ' (belum terverifikasi)', need: NEED_UNCONFIRMED, needEvidence: '', source: 'Data awal simulasi', createdAt: at,
        nextFollowUp: null, notes: [],
      })),
      history: [{ at, by: 'sistem', prospectId: '*', action: 'Data awal 10 prospek simulasi dimuat' }],
      reminders: [],
      drafts: [],
      outbox: [],
      appliedOps: [],
      seq: 0,
    };
  }

  /** Asisten AI (aturan/templat): ringkas catatan + usulan tindak lanjut + draf. */
  function aiSuggest(prospect) {
    const lastNote = prospect.notes.length ? prospect.notes[prospect.notes.length - 1].text : '';
    const summary = lastNote
      ? `Catatan terakhir: "${lastNote}" Kebutuhan: ${prospect.need}.`
      : `Belum ada catatan. Kebutuhan: ${prospect.need}.`;
    let next;
    if (prospect.need === NEED_UNCONFIRMED) next = 'Konfirmasi minat/kebutuhan sebelum menyiapkan penawaran.';
    else if (prospect.status === 'Penawaran draf') next = 'Tinjau draf penawaran dengan atasan sebelum dikirim.';
    else next = 'Jadwalkan tindak lanjut sesuai kebutuhan yang sudah dikonfirmasi.';
    const draft = /awards/i.test(lastNote) && prospect.need === NEED_UNCONFIRMED
      ? 'Apakah Bapak/Ibu berkenan menerima informasi program awards untuk ditinjau?'
      : prospect.need === NEED_UNCONFIRMED
        ? 'Apakah Bapak/Ibu berkenan berbagi kebutuhan perusahaan agar kami dapat menyiapkan informasi yang sesuai?'
        : 'Terima kasih atas konfirmasinya. Kami akan menyiapkan informasi lanjutan untuk ditinjau.';
    return { summary, next, draft };
  }

  function createCRM(opts) {
    opts = opts || {};
    const storage = opts.storage || memoryStorage();
    const key = opts.key || 'msi-a6-crm-v1';
    const now = opts.now || (() => new Date().toISOString());
    let failMode = null; // null | 'before' | 'after'
    let lastFailed = null;
    let db;
    try { db = JSON.parse(storage.getItem(key)); } catch (e) { db = null; }
    if (!db) { db = seedDb(now()); storage.setItem(key, JSON.stringify(db)); }

    /**
     * Commit idempoten: setiap operasi membawa opId. Jika opId sudah pernah diterapkan
     * (mis. respons hilang setelah data tersimpan), coba ulang tidak menerapkan dua kali.
     */
    function commit(opId, mutator) {
      if (db.appliedOps.includes(opId)) return { ok: true, alreadyApplied: true };
      const next = clone(db);
      const out = mutator(next) || {};
      if (out.ok === false) return out;
      next.appliedOps.push(opId);
      if (next.appliedOps.length > 500) next.appliedOps = next.appliedOps.slice(-500);
      if (failMode === 'before') { failMode = null; throw Object.assign(new Error('SIMULASI: database tidak merespons; data tidak tersimpan.'), { opId }); }
      storage.setItem(key, JSON.stringify(next));
      db = next;
      if (failMode === 'after') { failMode = null; throw Object.assign(new Error('SIMULASI: koneksi terputus setelah menyimpan; status tidak pasti.'), { opId }); }
      return Object.assign({ ok: true }, out);
    }

    function run(name, args, opId, mutator) {
      try {
        const r = commit(opId, mutator);
        if (r.ok) lastFailed = null;
        return r;
      } catch (e) {
        lastFailed = { name, args, opId };
        return { ok: false, retryable: true, opId, error: 'Penyimpanan gagal: ' + e.message + ' Gunakan "Coba ulang" — sistem mencegah data ganda.' };
      }
    }

    const newOp = () => 'op-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
    const label = (a) => (a.role === 'manajer' ? 'Manajer' : 'AE ' + a.ae);
    function canEdit(actor, p) {
      if (!actor) return false;
      if (actor.role === 'manajer') return true;
      return actor.role === 'ae' && actor.ae === p.ae;
    }
    const deny = (actor, p) => ({ ok: false, error: `Akses ditolak: ${label(actor)} tidak dapat mengubah prospek ${p.id} milik AE ${p.ae}.` });

    const api = {
      STATUSES,
      getDb: () => clone(db),
      simulateFailure(mode) { failMode = mode === undefined ? 'before' : (mode || null); },
      failMode: () => failMode,
      hasFailed: () => !!lastFailed,

      retry() {
        if (!lastFailed) return { ok: false, error: 'Tidak ada operasi yang perlu dicoba ulang.' };
        const { name, args, opId } = lastFailed;
        if (db.appliedOps.includes(opId)) {
          lastFailed = null;
          return { ok: true, alreadyApplied: true, message: 'Data ternyata sudah tersimpan pada percobaan sebelumnya — tidak disimpan dua kali.' };
        }
        return api[name].apply(null, args.concat([opId]));
      },

      addProspect(actor, p, opId) {
        opId = opId || newOp();
        const input = { id: String(p.id || '').trim().toUpperCase(), company: String(p.company || '').trim(), ae: String(p.ae || '').trim().toUpperCase(), status: p.status || 'Baru' };
        if (!input.id || !input.company) return { ok: false, error: 'ID dan nama perusahaan wajib diisi.' };
        if (!['A', 'B'].includes(input.ae)) return { ok: false, error: 'AE harus A atau B.' };
        if (!STATUSES.includes(input.status)) return { ok: false, error: 'Status tidak dikenal.' };
        if (actor.role === 'ae' && actor.ae !== input.ae) return { ok: false, error: `AE ${actor.ae} hanya dapat menambah prospek untuk dirinya sendiri.` };
        const dup = db.prospects.find((x) => x.id === input.id || norm(x.company) === norm(input.company));
        if (dup) {
          return { ok: false, duplicate: true, existingId: dup.id, error: `Duplikasi terdeteksi: ${input.id} / ${input.company} sudah tercatat sebagai ${dup.id} (${dup.company}). Total prospek tetap ${db.prospects.length}.` };
        }
        return run('addProspect', [actor, p], opId, (d) => {
          d.prospects.push({ ...input, need: NEED_UNCONFIRMED, needEvidence: '', source: p.source || 'Input manual', createdAt: now(), nextFollowUp: null, notes: [] });
          d.history.push({ at: now(), by: label(actor), prospectId: input.id, action: `Prospek ditambahkan (AE ${input.ae}, status ${input.status})` });
        });
      },

      /** Rujuk prospek dari A1 (agent). Jika sudah ada, catat aktivitas — bukan prospek baru. */
      importFromAgent(record, opId) {
        opId = opId || newOp();
        const existing = db.prospects.find((x) => x.id === String(record.id).toUpperCase() || norm(x.company) === norm(record.company));
        if (!existing) return api.addProspect({ role: 'manajer' }, { ...record, ae: record.ae || 'A', status: 'Baru', source: 'Agent A1 (simulasi)' }, opId);
        return run('importFromAgent', [record], opId, (d) => {
          const p = d.prospects.find((x) => x.id === existing.id);
          p.notes.push({ at: now(), by: 'Agent A1', text: `Pertanyaan via agent: ${record.question || '-'}`, source: 'Agent A1 (simulasi)' });
          d.history.push({ at: now(), by: 'Agent A1', prospectId: p.id, action: 'Aktivitas dari agent dirujuk ke prospek yang sudah ada (tanpa duplikasi)' });
          return { linkedTo: p.id };
        });
      },

      updateStatus(actor, id, status, opId) {
        opId = opId || newOp();
        const p = db.prospects.find((x) => x.id === id);
        if (!p) return { ok: false, error: `Prospek ${id} tidak ditemukan.` };
        if (!canEdit(actor, p)) return deny(actor, p);
        if (!STATUSES.includes(status)) return { ok: false, error: 'Status tidak dikenal.' };
        if (p.status === status) return { ok: false, error: `Status ${id} sudah ${status}.` };
        if (status === 'Penawaran draf' && p.need === NEED_UNCONFIRMED) {
          return { ok: false, error: `Kebutuhan ${id} belum terkonfirmasi — minat awal tidak cukup untuk membuat penawaran.` };
        }
        return run('updateStatus', [actor, id, status], opId, (d) => {
          const q = d.prospects.find((x) => x.id === id);
          const from = q.status; q.status = status;
          d.history.push({ at: now(), by: label(actor), prospectId: id, action: `Status: ${from} → ${status}` });
        });
      },

      /** Tambah catatan + tanggal tindak lanjut -> sistem membuat pengingat. Kebutuhan TIDAK otomatis terkonfirmasi. */
      addNote(actor, id, text, followUpDate, opId) {
        opId = opId || newOp();
        const p = db.prospects.find((x) => x.id === id);
        if (!p) return { ok: false, error: `Prospek ${id} tidak ditemukan.` };
        if (!canEdit(actor, p)) return deny(actor, p);
        text = String(text || '').trim();
        if (!text) return { ok: false, error: 'Catatan wajib diisi.' };
        if (followUpDate && !/^\d{4}-\d{2}-\d{2}$/.test(followUpDate)) return { ok: false, error: 'Format tanggal tindak lanjut YYYY-MM-DD.' };
        return run('addNote', [actor, id, text, followUpDate], opId, (d) => {
          const q = d.prospects.find((x) => x.id === id);
          q.notes.push({ at: now(), by: label(actor), text, source: 'Catatan AE (simulasi)' });
          d.history.push({ at: now(), by: label(actor), prospectId: id, action: 'Menambahkan catatan' });
          if (followUpDate) {
            q.nextFollowUp = followUpDate;
            d.seq += 1;
            d.reminders.push({ id: 'R' + String(d.seq).padStart(3, '0'), prospectId: id, ae: q.ae, date: followUpDate, text: 'Tindak lanjut ' + id, createdAt: now(),
              note: 'Pengingat internal — bukan izin mengirim penawaran.' });
            d.history.push({ at: now(), by: 'sistem', prospectId: id, action: `Pengingat tindak lanjut dibuat untuk ${followUpDate}` });
          }
        });
      },

      /** AE mengonfirmasi kebutuhan dengan bukti (mis. jawaban tertulis klien). */
      confirmNeed(actor, id, need, evidence, opId) {
        opId = opId || newOp();
        const p = db.prospects.find((x) => x.id === id);
        if (!p) return { ok: false, error: `Prospek ${id} tidak ditemukan.` };
        if (!canEdit(actor, p)) return deny(actor, p);
        if (!String(need || '').trim() || !String(evidence || '').trim()) return { ok: false, error: 'Kebutuhan dan bukti konfirmasi wajib diisi.' };
        return run('confirmNeed', [actor, id, need, evidence], opId, (d) => {
          const q = d.prospects.find((x) => x.id === id);
          q.need = String(need).trim(); q.needEvidence = String(evidence).trim();
          d.history.push({ at: now(), by: label(actor), prospectId: id, action: `Kebutuhan dikonfirmasi: ${q.need} (bukti: ${q.needEvidence})` });
        });
      },

      /** AI menyiapkan draf dari data yang ada -> Menunggu persetujuan. */
      createAiDraft(actor, id, opId) {
        opId = opId || newOp();
        const p = db.prospects.find((x) => x.id === id);
        if (!p) return { ok: false, error: `Prospek ${id} tidak ditemukan.` };
        if (!canEdit(actor, p)) return deny(actor, p);
        const s = aiSuggest(p);
        return run('createAiDraft', [actor, id], opId, (d) => {
          d.seq += 1;
          const draftId = 'DR' + String(d.seq).padStart(3, '0');
          d.drafts.push({ id: draftId, prospectId: id, text: s.draft, summary: s.summary, next: s.next, status: 'Menunggu persetujuan', createdAt: now(), createdBy: 'AI (templat) atas permintaan ' + label(actor) });
          d.history.push({ at: now(), by: 'AI', prospectId: id, action: `Draf ${draftId} disusun — Menunggu persetujuan` });
          return { draftId };
        });
      },

      approveDraft(actor, draftId, opId) {
        opId = opId || newOp();
        if (!actor || actor.role !== 'manajer') return { ok: false, error: 'Hanya manajer yang dapat menyetujui draf.' };
        const dr = db.drafts.find((x) => x.id === draftId);
        if (!dr) return { ok: false, error: 'Draf tidak ditemukan.' };
        if (dr.status !== 'Menunggu persetujuan') return { ok: false, error: `Draf berstatus ${dr.status}.` };
        return run('approveDraft', [actor, draftId], opId, (d) => {
          const x = d.drafts.find((y) => y.id === draftId); x.status = 'Disetujui'; x.approvedAt = now();
          d.history.push({ at: now(), by: label(actor), prospectId: x.prospectId, action: `Draf ${draftId} disetujui` });
        });
      },

      sendDraft(actor, draftId, opId) {
        opId = opId || newOp();
        const dr = db.drafts.find((x) => x.id === draftId);
        if (!dr) return { ok: false, error: 'Draf tidak ditemukan.' };
        if (dr.status !== 'Disetujui') return { ok: false, error: `Draf ${draftId} belum disetujui — tidak dapat dikirim. Pengingat bukan izin mengirim.` };
        return run('sendDraft', [actor, draftId], opId, (d) => {
          const x = d.drafts.find((y) => y.id === draftId); x.status = 'Terkirim (simulasi)';
          d.outbox.push({ draftId, at: now(), note: 'SIMULASI — tidak ada komunikasi keluar sungguhan' });
          d.history.push({ at: now(), by: label(actor), prospectId: x.prospectId, action: `Draf ${draftId} dicatat ke outbox simulasi` });
        });
      },

      dashboard() {
        const byStatus = Object.fromEntries(STATUSES.map((s) => [s, 0]));
        const byAE = {};
        db.prospects.forEach((p) => { byStatus[p.status] += 1; byAE[p.ae] = (byAE[p.ae] || 0) + 1; });
        const upcoming = db.prospects.filter((p) => p.nextFollowUp).map((p) => ({ id: p.id, company: p.company, ae: p.ae, date: p.nextFollowUp }))
          .sort((a, b) => a.date.localeCompare(b.date));
        return { total: db.prospects.length, byStatus, byAE, upcoming, pendingDrafts: db.drafts.filter((d) => d.status === 'Menunggu persetujuan').length };
      },

      aiSuggest: (id) => { const p = db.prospects.find((x) => x.id === id); return p ? aiSuggest(p) : null; },
      reset() { db = seedDb(now()); storage.setItem(key, JSON.stringify(db)); lastFailed = null; failMode = null; },
    };
    return api;
  }

  return { STATUSES, NEED_UNCONFIRMED, SEED, createCRM, memoryStorage, aiSuggest };
});
