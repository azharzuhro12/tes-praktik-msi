/*
 * store.js — Penyimpanan & aturan akses untuk aplikasi penilaian A3.
 * SIMULASI TES PRAKTIK MSI Group.
 *
 * Prinsip:
 *  - Transaksional: perubahan baru dianggap berhasil SETELAH tersimpan. Jika
 *    penyimpanan gagal, state di memori tidak berubah dan tidak ada pesan
 *    "berhasil" palsu. Aksi yang gagal dapat dicoba ulang (retry).
 *  - Pembagian peran (SIMULASI, bukan autentikasi produksi):
 *      admin  : kelola peserta, bobot/kriteria, rekap, ekspor; tidak mengubah skor juri.
 *      juri   : hanya dapat mengisi/mengubah penilaiannya sendiri.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./scoring.js'));
  else root.Store = factory(root.Scoring);
})(typeof self !== 'undefined' ? self : this, function (Scoring) {
  'use strict';

  const STORAGE_KEY = 'msi-a3-penilaian-v1';
  const clone = (o) => JSON.parse(JSON.stringify(o));

  function memoryStorage() {
    const m = new Map();
    return {
      getItem: (k) => (m.has(k) ? m.get(k) : null),
      setItem: (k, v) => m.set(k, String(v)),
      removeItem: (k) => m.delete(k),
    };
  }

  function createStore(opts) {
    opts = opts || {};
    const storage = opts.storage || memoryStorage();
    const key = opts.key || STORAGE_KEY;
    const now = opts.now || (() => new Date().toISOString());
    let failuresToSimulate = 0;
    let lastFailed = null; // { name, args }
    const listeners = new Set();

    let state = load();

    function initial() {
      const s = Scoring.sampleState();
      s.audit = [{ at: now(), actor: 'sistem', action: 'Data contoh simulasi dimuat' }];
      return s;
    }

    function load() {
      try {
        const raw = storage.getItem(key);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && Array.isArray(parsed.criteria)) return parsed;
        }
      } catch (e) { /* data rusak -> pakai data contoh */ }
      return initial();
    }

    function persist(next) {
      if (failuresToSimulate > 0) {
        failuresToSimulate -= 1;
        throw new Error('SIMULASI: penyimpanan gagal (koneksi/disk tidak tersedia).');
      }
      storage.setItem(key, JSON.stringify(next));
    }

    function emit() { listeners.forEach((fn) => fn(state)); }

    /** Jalankan mutasi pada salinan; commit hanya jika persist berhasil. */
    function commit(name, args, mutate, auditText, actorLabel) {
      const next = clone(state);
      const res = mutate(next);
      if (res && res.ok === false) return res; // gagal validasi: tidak menyentuh penyimpanan
      next.audit = next.audit || [];
      next.audit.push({ at: now(), actor: actorLabel, action: auditText });
      try {
        persist(next);
      } catch (e) {
        lastFailed = { name, args };
        return {
          ok: false, retryable: true,
          error: 'Penyimpanan gagal. Data BELUM tersimpan; silakan coba ulang. (' + e.message + ')',
        };
      }
      state = next;
      lastFailed = null;
      emit();
      return { ok: true };
    }

    function actorLabel(actor) {
      return actor.role === 'admin' ? 'Admin' : 'Juri ' + actor.juryId;
    }

    function requireAdmin(actor) {
      return actor && actor.role === 'admin'
        ? null
        : { ok: false, error: 'Akses ditolak: hanya admin yang dapat melakukan aksi ini.' };
    }

    const api = {
      getState: () => clone(state),
      subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
      simulateFailure(n) { failuresToSimulate = n === undefined ? 1 : n; },
      pendingFailures: () => failuresToSimulate,
      hasFailedAction: () => !!lastFailed,

      retry() {
        if (!lastFailed) return { ok: false, error: 'Tidak ada aksi yang perlu dicoba ulang.' };
        const { name, args } = lastFailed;
        return api[name].apply(null, args);
      },

      saveScore(actor, participantId, juryId, input) {
        if (!actor || actor.role !== 'juri') {
          return { ok: false, error: 'Akses ditolak: hanya juri yang dapat mengisi skor.' };
        }
        if (actor.juryId !== juryId) {
          return { ok: false, error: `Akses ditolak: Juri ${actor.juryId} tidak dapat mengubah penilaian Juri ${juryId}.` };
        }
        if (!state.participants.some((p) => p.id === participantId)) {
          return { ok: false, error: `Peserta ${participantId} tidak ditemukan.` };
        }
        const fieldErrors = {};
        const clean = {};
        for (const c of state.criteria) {
          const v = Scoring.validateScore(input[c.id]);
          if (!v.ok) fieldErrors[c.id] = v.error;
          else clean[c.id] = v.value;
        }
        if (Object.keys(fieldErrors).length) {
          return { ok: false, fieldErrors, error: Object.values(fieldErrors)[0] };
        }
        clean.note = String(input.note || '').slice(0, 500);
        const filled = state.criteria.filter((c) => clean[c.id] !== null).length;
        return commit('saveScore', [actor, participantId, juryId, input], (s) => {
          s.scores[participantId] = s.scores[participantId] || {};
          s.scores[participantId][juryId] = clean;
        }, `Menyimpan skor ${participantId} (${filled}/${state.criteria.length} kriteria terisi)`, actorLabel(actor));
      },

      setWeights(actor, weights) {
        const denied = requireAdmin(actor); if (denied) return denied;
        const proposed = state.criteria.map((c) => ({ ...c, weight: Number(String(weights[c.id]).replace(',', '.')) }));
        const check = Scoring.validateWeights(proposed);
        if (!check.ok) return { ok: false, error: check.error };
        const txt = proposed.map((c) => `${c.label} ${c.weight}%`).join(', ');
        return commit('setWeights', [actor, weights], (s) => { s.criteria = proposed; },
          'Mengubah bobot menjadi ' + txt, actorLabel(actor));
      },

      addParticipant(actor, id, name) {
        const denied = requireAdmin(actor); if (denied) return denied;
        id = String(id || '').trim().toUpperCase();
        name = String(name || '').trim();
        if (!/^[A-Z0-9-]{1,10}$/.test(id)) return { ok: false, error: 'ID peserta wajib diisi (huruf/angka, maks. 10).' };
        if (!name) return { ok: false, error: 'Nama peserta wajib diisi.' };
        if (state.participants.some((p) => p.id === id)) return { ok: false, error: `ID ${id} sudah ada (duplikat ditolak).` };
        return commit('addParticipant', [actor, id, name], (s) => { s.participants.push({ id, name }); },
          `Menambah peserta ${id}`, actorLabel(actor));
      },

      removeParticipant(actor, id) {
        const denied = requireAdmin(actor); if (denied) return denied;
        if (!state.participants.some((p) => p.id === id)) return { ok: false, error: `Peserta ${id} tidak ditemukan.` };
        return commit('removeParticipant', [actor, id], (s) => {
          s.participants = s.participants.filter((p) => p.id !== id);
          delete s.scores[id];
        }, `Menghapus peserta ${id}`, actorLabel(actor));
      },

      addJury(actor, id, name) {
        const denied = requireAdmin(actor); if (denied) return denied;
        id = String(id || '').trim().toUpperCase();
        name = String(name || '').trim();
        if (!/^[A-Z0-9-]{1,10}$/.test(id)) return { ok: false, error: 'ID juri wajib diisi (huruf/angka, maks. 10).' };
        if (!name) return { ok: false, error: 'Nama juri wajib diisi.' };
        if (state.juries.some((j) => j.id === id)) return { ok: false, error: `ID ${id} sudah ada (duplikat juri ditolak).` };
        return commit('addJury', [actor, id, name], (s) => { s.juries.push({ id, name }); },
          `Menambah juri ${id}`, actorLabel(actor));
      },

      removeJury(actor, id) {
        const denied = requireAdmin(actor); if (denied) return denied;
        if (state.juries.length <= 1) return { ok: false, error: 'Minimal harus ada 1 juri dalam sistem.' };
        if (!state.juries.some((j) => j.id === id)) return { ok: false, error: `Juri ${id} tidak ditemukan.` };
        return commit('removeJury', [actor, id], (s) => {
          s.juries = s.juries.filter((j) => j.id !== id);
          for (const pid of Object.keys(s.scores || {})) {
            if (s.scores[pid]) delete s.scores[pid][id];
          }
        }, `Menghapus juri ${id}`, actorLabel(actor));
      },

      resetSample(actor) {
        const denied = requireAdmin(actor); if (denied) return denied;
        return commit('resetSample', [actor], (s) => {
          const fresh = Scoring.sampleState();
          Object.keys(s).forEach((k) => { if (k !== 'audit') delete s[k]; });
          Object.assign(s, fresh);
        }, 'Memuat ulang data contoh naskah acuan', actorLabel(actor));
      },

      recap: () => Scoring.buildRecap(state),
      exportCSV: () => Scoring.recapToCSV(state),
    };
    return api;
  }

  return { createStore, memoryStorage, STORAGE_KEY };
});

