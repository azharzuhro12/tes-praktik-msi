/*
 * scoring.js — Logika perhitungan nilai (murni, tanpa UI) untuk A3.
 * SIMULASI TES PRAKTIK MSI Group. Data fiktif.
 *
 * Rumus (naskah acuan):
 *   Nilai per juri = Σ (skor_kriteria ÷ 5 × bobot_kriteria)
 *   Nilai perusahaan = rata-rata nilai seluruh juri, ditampilkan 1 angka desimal.
 *
 * Modul ini dipakai oleh browser (window.Scoring) dan Node.js (require) sehingga
 * angka yang diuji otomatis sama persis dengan angka yang tampil di aplikasi.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Scoring = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const SCORE_MIN = 0;
  const SCORE_MAX = 5;

  const DEFAULT_CRITERIA = Object.freeze([
    Object.freeze({ id: 'strategi', label: 'Strategi', weight: 40 }),
    Object.freeze({ id: 'implementasi', label: 'Implementasi', weight: 35 }),
    Object.freeze({ id: 'hasil', label: 'Hasil', weight: 25 }),
  ]);

  /** Validasi satu skor. Kosong dianggap "belum diisi" (bukan nol). */
  function validateScore(raw) {
    if (raw === null || raw === undefined || String(raw).trim() === '') {
      return { ok: true, empty: true, value: null };
    }
    const text = String(raw).trim().replace(',', '.');
    if (!/^-?\d+(\.\d+)?$/.test(text)) {
      return { ok: false, error: 'Skor harus berupa angka pada rentang 0–5.' };
    }
    const value = Number(text);
    if (value < SCORE_MIN || value > SCORE_MAX) {
      return { ok: false, error: `Skor ${String(raw).trim()} ditolak: skor harus pada rentang 0–5.` };
    }
    return { ok: true, empty: false, value };
  }

  /** Validasi bobot: tiap bobot angka 0–100 dan total harus tepat 100%. */
  function validateWeights(criteria) {
    if (!Array.isArray(criteria) || criteria.length === 0) {
      return { ok: false, total: 0, error: 'Minimal harus ada satu kriteria.' };
    }
    let total = 0;
    for (const c of criteria) {
      const w = Number(c.weight);
      if (!Number.isFinite(w) || w < 0 || w > 100) {
        return { ok: false, total: NaN, error: `Bobot "${c.label}" harus angka 0–100.` };
      }
      total += w;
    }
    total = Math.round(total * 1e6) / 1e6;
    if (total !== 100) {
      return { ok: false, total, error: `Total bobot ${formatNumber(total)}% ditolak: total harus tepat 100%.` };
    }
    return { ok: true, total };
  }

  /**
   * Nilai satu juri untuk satu peserta. Mengembalikan null bila ada skor kosong
   * (status Belum lengkap — tidak pernah dihitung sebagai nol).
   */
  function juryScore(scores, criteria) {
    if (!scores) return null;
    let total = 0;
    for (const c of criteria) {
      const v = scores[c.id];
      if (v === null || v === undefined || v === '') return null;
      total += (Number(v) / SCORE_MAX) * Number(c.weight);
    }
    return total;
  }

  /** Pembulatan 1 desimal, setengah ke atas, aman dari galat floating point. */
  function round1(x) {
    if (x === null || x === undefined || !Number.isFinite(x)) return null;
    // +1e-9 mencegah kasus seperti 72.45 yang tersimpan 72.4499999… ikut turun.
    return Math.round(x * 10 + 1e-9) / 10;
  }

  /** Format Indonesia: 73 -> "73,0" ; 72.5 -> "72,5". */
  function formatScore(x) {
    const r = round1(x);
    return r === null ? '—' : r.toFixed(1).replace('.', ',');
  }

  function formatNumber(x) {
    return String(Math.round(x * 100) / 100).replace('.', ',');
  }

  /**
   * Rekap seluruh peserta. Satu-satunya sumber angka untuk dashboard DAN ekspor.
   * state = { criteria, participants:[{id,name}], juries:[{id,name}], scores:{ [pid]: { [jid]: {strategi,...,note} } } }
   */
  function buildRecap(state) {
    const { criteria, participants, juries } = state;
    const scores = state.scores || {};
    const weightCheck = validateWeights(criteria);
    return participants.map((p) => {
      const perJury = juries.map((j) => {
        const s = (scores[p.id] || {})[j.id] || null;
        const raw = weightCheck.ok ? juryScore(s, criteria) : null;
        return {
          juryId: j.id,
          juryName: j.name,
          scores: s,
          complete: raw !== null,
          raw,
          value: round1(raw),
        };
      });
      const completeCount = perJury.filter((x) => x.complete).length;
      const complete = juries.length > 0 && completeCount === juries.length;
      // Rata-rata dari nilai mentah, baru dibulatkan sekali di akhir.
      const finalRaw = complete ? perJury.reduce((a, x) => a + x.raw, 0) / juries.length : null;
      return {
        participantId: p.id,
        participantName: p.name,
        perJury,
        completeCount,
        juryCount: juries.length,
        status: complete ? 'Lengkap' : 'Belum lengkap',
        finalRaw,
        final: round1(finalRaw),
      };
    });
  }

  function csvCell(v) {
    const s = v === null || v === undefined ? '' : String(v);
    return /[";\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }

  /** Ekspor CSV (pemisah titik koma agar ramah Excel Indonesia). */
  function recapToCSV(state, recap) {
    recap = recap || buildRecap(state);
    const lines = [];
    lines.push(['SIMULASI TES PRAKTIK MSI Group — Rekap Penilaian Awards (data fiktif)'].map(csvCell).join(';'));
    lines.push(['Bobot', ...state.criteria.map((c) => `${c.label} ${formatNumber(c.weight)}%`)].map(csvCell).join(';'));
    lines.push('');
    const header = ['Peserta', 'Nama', 'Juri', ...state.criteria.map((c) => c.label), 'Nilai juri', 'Catatan'];
    lines.push(header.map(csvCell).join(';'));
    for (const r of recap) {
      for (const pj of r.perJury) {
        const s = pj.scores || {};
        lines.push([
          r.participantId, r.participantName, pj.juryId,
          ...state.criteria.map((c) => (s[c.id] === null || s[c.id] === undefined ? '' : String(s[c.id]).replace('.', ','))),
          pj.complete ? formatScore(pj.raw) : 'Belum lengkap',
          s.note || '',
        ].map(csvCell).join(';'));
      }
    }
    lines.push('');
    lines.push(['Peserta', 'Nama', 'Kelengkapan', 'Status', 'Nilai perusahaan'].map(csvCell).join(';'));
    for (const r of recap) {
      lines.push([
        r.participantId, r.participantName, `${r.completeCount}/${r.juryCount}`, r.status,
        r.final === null ? 'Belum lengkap' : formatScore(r.finalRaw),
      ].map(csvCell).join(';'));
    }
    return lines.join('\n') + '\n';
  }

  /** Data contoh dari naskah acuan (S01–S03, J1–J2). */
  function sampleState() {
    const sc = (a, b, c, note) => ({ strategi: a, implementasi: b, hasil: c, note: note || '' });
    return {
      criteria: DEFAULT_CRITERIA.map((c) => ({ ...c })),
      participants: [
        { id: 'S01', name: 'PT Simulasi Peserta Satu' },
        { id: 'S02', name: 'PT Simulasi Peserta Dua' },
        { id: 'S03', name: 'PT Simulasi Peserta Tiga' },
      ],
      juries: [
        { id: 'J1', name: 'Juri 1 (simulasi)' },
        { id: 'J2', name: 'Juri 2 (simulasi)' },
      ],
      scores: {
        S01: { J1: sc(4, 3, 4), J2: sc(4, 4, 3) },
        S02: { J1: sc(3, 4, 4), J2: sc(4, 3, 4) },
        S03: { J1: sc(5, 4, 3), J2: sc(4, 4, 4) },
      },
    };
  }

  return {
    SCORE_MIN, SCORE_MAX, DEFAULT_CRITERIA,
    validateScore, validateWeights, juryScore, round1, formatScore, formatNumber,
    buildRecap, recapToCSV, sampleState,
  };
});
