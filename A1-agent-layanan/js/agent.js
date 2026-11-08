/*
 * agent.js — Logika A1: AI agent layanan & prospek awards (SIMULASI MSI Group).
 *
 * Alur: pertanyaan → cari KB → jawaban + rujukan → catat prospek (tanpa duplikasi)
 *       → draf follow-up (Menunggu persetujuan) → eskalasi ke staf bila di luar KB.
 *
 * Catatan jujur tentang "AI": pada prototipe ini klasifikasi pertanyaan memakai aturan
 * kata kunci yang deterministik agar dapat diuji offline tanpa API berbayar. Fungsi
 * `classify()` adalah titik ganti untuk LLM (lihat PROMPT_LLM). Apa pun pengklasifikasinya,
 * jawaban HANYA disusun dari teks KB dan pencatatan database memakai aturan validasi tetap.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Agent = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const KB = Object.freeze({
    KB01: 'Pendaftaran tes tidak berbiaya.',
    KB02: 'Jadwal wawancara dikoordinasikan setelah verifikasi.',
    KB03: 'Sponsorship opsional dan tidak menentukan hasil penilaian.',
    KB04: 'Tarif paket, kepastian penghargaan, dan jadwal spesifik belum tersedia; pertanyaan dialihkan ke staf.',
  });

  // Prompt yang disiapkan bila classify() diganti LLM (tidak dipanggil di prototipe offline).
  const PROMPT_LLM = [
    'Anda asisten layanan awards SIMULASI MSI Group. Klasifikasikan pertanyaan ke label:',
    'pendaftaran, sponsorship, jaminan_penghargaan, tarif, jadwal_umum, jadwal_spesifik, lainnya.',
    'Keluarkan JSON {"labels":[...]} saja. Jangan menjawab pertanyaan, jangan menambah fakta.',
  ].join('\n');

  const norm = (s) => String(s || '').toLowerCase().normalize('NFKD').replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  const has = (q, words) => words.some((w) => new RegExp('\\b' + w + '\\b').test(q));

  /** Klasifikasi berbasis aturan (pengganti LLM yang dapat diuji). */
  function classify(question) {
    const q = norm(question);
    const labels = new Set();
    const priceWords = ['harga', 'tarif', 'paket', 'investasi', 'bayar berapa', 'berapa biaya', 'biaya paket'];
    const feeWords = ['biaya', 'berbiaya', 'biayanya', 'gratis', 'bayar', 'berbayar', 'dipungut', 'free'];
    if (has(q, ['sponsor', 'sponsorship', 'sponsori'])) labels.add('sponsorship');
    if (has(q, ['dijamin', 'jaminan', 'menjamin', 'garansi', 'pasti menang', 'pasti dapat', 'bintang', 'juara', 'menang'])) labels.add('jaminan_penghargaan');
    if (has(q, priceWords)) labels.add('tarif');
    if (has(q, ['daftar', 'pendaftaran', 'mendaftar', 'registrasi']) && has(q, feeWords)) labels.add('pendaftaran');
    if (has(q, ['jadwal', 'wawancara', 'interview', 'tanggal', 'kapan'])) {
      // "tanggal wawancara saya", "kapan saya" -> permintaan jadwal spesifik
      if (has(q, ['saya', 'kami', 'tanggal', 'kapan', 'jam'])) labels.add('jadwal_spesifik');
      else labels.add('jadwal_umum');
    }
    if (labels.size === 0) labels.add('lainnya');
    return Array.from(labels);
  }

  /** Susun jawaban HANYA dari KB. Mengembalikan rujukan dan kebutuhan eskalasi. */
  function answer(question) {
    const labels = classify(question);
    const parts = [];
    const refs = new Set();
    let escalate = false;
    const topics = [];

    if (labels.includes('pendaftaran')) { parts.push('Pendaftaran tidak dipungut biaya.'); refs.add('KB01'); }
    if (labels.includes('sponsorship')) { parts.push('Sponsorship bersifat opsional dan tidak menentukan hasil penilaian.'); refs.add('KB03'); }
    if (labels.includes('jaminan_penghargaan')) {
      parts.push('Saya tidak dapat menjanjikan penghargaan atau level bintang tertentu.');
      refs.add('KB04'); escalate = true; topics.push('penghargaan');
    }
    if (labels.includes('tarif') || labels.includes('jadwal_spesifik')) {
      const what = [labels.includes('tarif') ? 'tarif' : null, labels.includes('jadwal_spesifik') ? 'jadwal spesifik' : null].filter(Boolean).join(' dan ');
      parts.push(`Informasi ${what} belum tersedia dalam acuan saya.`);
      refs.add('KB04'); escalate = true;
      if (labels.includes('tarif')) topics.push('tarif');
      if (labels.includes('jadwal_spesifik')) topics.push('jadwal');
    }
    if (labels.includes('jadwal_umum') || labels.includes('jadwal_spesifik')) {
      parts.push('Jadwal wawancara dikoordinasikan setelah verifikasi.'); refs.add('KB02');
    }
    let outOfKb = false;
    if (labels.includes('lainnya')) {
      outOfKb = true; escalate = true;
      parts.push('Maaf, informasi tersebut belum ada dalam acuan saya, sehingga saya tidak akan menebak jawabannya.');
    }
    if (escalate) {
      parts.push(outOfKb || topics.length > 1 ? 'Pertanyaan Anda perlu ditindaklanjuti staf.' : 'Saya akan meneruskan pertanyaan Anda kepada staf.');
    }
    return {
      question, labels, text: parts.join(' '),
      refs: Array.from(refs).sort(), escalate, outOfKb, topics,
    };
  }

  /** Draf follow-up dari jawaban. Tidak pernah dikirim otomatis. */
  function composeDraft(prospect, ans) {
    const lines = ['Terima kasih atas pertanyaannya.'];
    const kbSentences = {
      KB01: 'Pendaftaran tidak dipungut biaya.',
      KB03: 'Sponsorship bersifat opsional dan tidak menentukan hasil penilaian.',
      KB02: 'Jadwal wawancara dikoordinasikan setelah verifikasi.',
    };
    ans.refs.forEach((r) => {
      if (r === 'KB02' && ans.topics.includes('jadwal')) return; // sudah tercakup kalimat tindak lanjut
      if (kbSentences[r]) lines.push(kbSentences[r]);
    });
    if (ans.topics.length) lines.push(`Staf akan menindaklanjuti pertanyaan ${ans.topics.join(' dan ')} setelah verifikasi.`);
    else if (ans.outOfKb) lines.push('Staf akan menindaklanjuti pertanyaan Anda.');
    return {
      prospectId: prospect.id,
      text: lines.join(' '),
      refs: ans.refs.slice(),
      status: 'Menunggu persetujuan',
    };
  }

  function normalizeCompany(name) {
    return norm(name).replace(/\b(pt|cv|tbk|persero)\b/g, '').replace(/\s+/g, ' ').trim();
  }

  function memoryStorage() {
    const m = new Map();
    return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k) };
  }

  /** Database & antrean dengan penyimpanan transaksional dan simulasi kegagalan. */
  function createAgentSystem(opts) {
    opts = opts || {};
    const storage = opts.storage || memoryStorage();
    const key = opts.key || 'msi-a1-agent-v1';
    const now = opts.now || (() => new Date().toISOString());
    let failNext = 0;
    let lastFailed = null;
    let db;
    try { db = JSON.parse(storage.getItem(key)) || null; } catch (e) { db = null; }
    if (!db) db = { prospects: [], conversations: [], staffQueue: [], drafts: [], outbox: [], log: [], seq: 0 };
    const clone = (o) => JSON.parse(JSON.stringify(o));

    function commit(mutator) {
      const next = clone(db);
      const out = mutator(next);
      if (failNext > 0) { failNext -= 1; throw new Error('SIMULASI: database tidak dapat dihubungi.'); }
      storage.setItem(key, JSON.stringify(next));
      db = next;
      return out;
    }

    const sys = {
      getDb: () => clone(db),
      simulateFailure(n) { failNext = n === undefined ? 1 : n; },
      pendingFailures: () => failNext,

      /** Proses satu pertanyaan masuk dari prospek. */
      handleInquiry(prospect, question) {
        const ans = answer(question);
        const p = { id: String(prospect.id || '').trim().toUpperCase(), company: String(prospect.company || '').trim(), contact: String(prospect.contact || '').trim() };
        if (!p.id || !p.company) {
          return { ok: false, answer: ans, error: 'ID dan nama perusahaan prospek wajib diisi sebelum dicatat.' };
        }
        try {
          const result = commit((d) => {
            const byId = d.prospects.find((x) => x.id === p.id);
            const byName = d.prospects.find((x) => normalizeCompany(x.company) === normalizeCompany(p.company));
            let duplicate = false;
            if (byId || byName) {
              if (byId && byName && byId !== byName) {
                const e = new Error('KONFLIK'); e.validation = `ID ${p.id} dan nama "${p.company}" merujuk ke dua prospek berbeda; periksa data sebelum mencatat.`; throw e;
              }
              const existing = byId || byName;
              if (byId && normalizeCompany(byId.company) !== normalizeCompany(p.company)) {
                const e = new Error('KONFLIK_ID'); e.validation = `ID ${p.id} sudah dipakai ${byId.company}; periksa data sebelum mencatat.`; throw e;
              }
              duplicate = true;
              existing.lastContactAt = now();
              existing.inquiries += 1;
              p.id = existing.id;
            } else {
              d.prospects.push({ ...p, source: 'Chat agent A1 (simulasi)', createdAt: now(), lastContactAt: now(), inquiries: 1, need: 'Belum terkonfirmasi' });
            }
            d.seq += 1;
            const convId = 'C' + String(d.seq).padStart(3, '0');
            d.conversations.push({ id: convId, prospectId: p.id, at: now(), question, answer: ans.text, refs: ans.refs, labels: ans.labels });
            let ticket = null;
            if (ans.escalate) {
              ticket = { id: 'T' + String(d.seq).padStart(3, '0'), prospectId: p.id, at: now(), question, reason: ans.outOfKb ? 'Di luar KB' : 'KB04: perlu staf (' + ans.topics.join(', ') + ')', status: 'Menunggu staf' };
              d.staffQueue.push(ticket);
            }
            const draft = { id: 'D' + String(d.seq).padStart(3, '0'), at: now(), ...composeDraft(p, ans) };
            d.drafts.push(draft);
            d.log.push({ at: now(), event: duplicate ? `Prospek ${p.id} sudah ada — tidak dibuat ulang (duplikat dicegah)` : `Prospek ${p.id} dicatat` });
            return { duplicate, convId, ticket, draft, prospectId: p.id };
          });
          lastFailed = null;
          return { ok: true, answer: ans, ...result };
        } catch (e) {
          if (e.validation) return { ok: false, answer: ans, error: e.validation };
          lastFailed = { prospect, question };
          return {
            ok: false, retryable: true, answer: ans,
            error: 'Pencatatan gagal: database tidak tersedia. Prospek, percakapan, dan draf BELUM tersimpan. Silakan coba ulang. (' + e.message + ')',
          };
        }
      },

      retry() {
        if (!lastFailed) return { ok: false, error: 'Tidak ada pencatatan yang perlu diulang.' };
        return sys.handleInquiry(lastFailed.prospect, lastFailed.question);
      },

      /** Hanya staf yang dapat menyetujui draf. */
      approveDraft(actor, draftId) {
        if (!actor || actor.role !== 'staf') return { ok: false, error: 'Hanya staf yang dapat menyetujui draf.' };
        if (!db.drafts.some((x) => x.id === draftId)) return { ok: false, error: 'Draf tidak ditemukan.' };
        try {
          commit((d) => {
            const dr = d.drafts.find((x) => x.id === draftId);
            dr.status = 'Disetujui'; dr.approvedBy = actor.name || 'Staf'; dr.approvedAt = now();
            d.log.push({ at: now(), event: `Draf ${draftId} disetujui oleh ${dr.approvedBy}` });
          });
          return { ok: true };
        } catch (e) { return { ok: false, retryable: true, error: 'Persetujuan gagal disimpan. Coba ulang. (' + e.message + ')' }; }
      },

      /** "Kirim" disimulasikan ke outbox lokal; ditolak bila belum disetujui. */
      sendDraft(actor, draftId) {
        const dr = db.drafts.find((x) => x.id === draftId);
        if (!dr) return { ok: false, error: 'Draf tidak ditemukan.' };
        if (dr.status !== 'Disetujui') return { ok: false, error: `Draf ${draftId} berstatus "${dr.status}" — tidak dapat dikirim sebelum disetujui staf.` };
        try {
          commit((d) => {
            const x = d.drafts.find((y) => y.id === draftId);
            x.status = 'Terkirim (simulasi)';
            d.outbox.push({ draftId, at: now(), note: 'SIMULASI — tidak ada email/pesan nyata yang dikirim' });
            d.log.push({ at: now(), event: `Draf ${draftId} masuk outbox simulasi` });
          });
          return { ok: true };
        } catch (e) { return { ok: false, retryable: true, error: 'Pengiriman (simulasi) gagal dicatat. (' + e.message + ')' }; }
      },

      reset() { db = { prospects: [], conversations: [], staffQueue: [], drafts: [], outbox: [], log: [], seq: 0 }; storage.setItem(key, JSON.stringify(db)); },
    };
    return sys;
  }

  return { KB, PROMPT_LLM, classify, answer, composeDraft, normalizeCompany, createAgentSystem, memoryStorage };
});
