/* app.js — Lapisan UI aplikasi penilaian A3 (SIMULASI). Semua angka berasal dari Scoring/Store. */
(function () {
  'use strict';
  const S = window.Scoring;

  let storage;
  let storageNote = 'Data disimpan di localStorage peramban ini.';
  try {
    window.localStorage.setItem('__t', '1'); window.localStorage.removeItem('__t');
    storage = window.localStorage;
  } catch (e) {
    storage = window.Store.memoryStorage();
    storageNote = 'localStorage tidak tersedia — data hanya di memori (hilang saat refresh).';
  }
  const store = window.Store.createStore({ storage });

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));
  const esc = (s) => String(s === null || s === undefined ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  let actor = { role: 'admin' };
  let activeTab = 'dash';
  const juryDrafts = {}; // isian juri yang belum tersimpan, agar tidak hilang saat render ulang

  // ---------- notifikasi ----------
  let toastTimer;
  function toast(text, kind, opts) {
    const el = $('#toast');
    el.className = 'toast ' + (kind || 'ok');
    el.innerHTML = `<span>${esc(text)}</span>`;
    if (opts && opts.retry) {
      const b = document.createElement('button');
      b.className = 'btn small'; b.id = 'retryBtn'; b.textContent = 'Coba ulang';
      b.onclick = () => handle(store.retry(), opts.successText || 'Berhasil disimpan setelah coba ulang.');
      el.appendChild(b);
    }
    el.hidden = false;
    clearTimeout(toastTimer);
    if (!opts || !opts.sticky) toastTimer = setTimeout(() => { el.hidden = true; }, 4000);
  }

  /** Tampilkan hasil aksi store. Tidak pernah menampilkan "berhasil" jika res.ok false. */
  function handle(res, successText) {
    syncFailToggle();
    if (res.ok) { toast(successText, 'ok'); render(); return true; }
    if (res.retryable) toast(res.error, 'err', { retry: true, sticky: true, successText });
    else toast(res.error, 'warn');
    render();
    return false;
  }

  function syncFailToggle() { $('#simFail').checked = store.pendingFailures() > 0; }

  function syncRoleSelect(st) {
    const sel = $('#role');
    const juryIds = st.juries.map((j) => j.id);
    if (actor.role === 'juri' && !juryIds.includes(actor.juryId)) {
      actor = { role: 'admin' };
    }
    const currentOptions = Array.from(sel.options).map((o) => o.value).join(',');
    const expectedOptions = ['admin', ...juryIds].join(',');
    if (currentOptions !== expectedOptions) {
      sel.innerHTML = '<option value="admin">Admin</option>' +
        st.juries.map((j) => `<option value="${esc(j.id)}">Juri ${esc(j.id)} (${esc(j.name)})</option>`).join('');
    }
    sel.value = actor.role === 'admin' ? 'admin' : actor.juryId;
  }

  // ---------- render ----------
  function render() {
    const st = store.getState();
    syncRoleSelect(st);
    $('#adminView').hidden = actor.role !== 'admin';
    $('#juryView').hidden = actor.role !== 'juri';
    $('#storageInfo').textContent = storageNote;
    if (actor.role === 'admin') renderAdmin(st); else renderJury(st);
  }

  function renderAdmin(st) {
    $$('.tab').forEach((t) => t.classList.toggle('active', t.dataset.tab === activeTab));
    $$('.panel').forEach((p) => { p.hidden = p.id !== 'tab-' + activeTab; });
    const recap = S.buildRecap(st);
    const wcheck = S.validateWeights(st.criteria);

    // kartu ringkasan
    const total = st.participants.length * st.juries.length;
    const filled = recap.reduce((a, r) => a + r.completeCount, 0);
    const done = recap.filter((r) => r.status === 'Lengkap').length;
    $('#summaryCards').innerHTML = `
      <div class="card"><div class="k">Peserta</div><div class="v">${st.participants.length}</div></div>
      <div class="card"><div class="k">Juri</div><div class="v">${st.juries.length}</div></div>
      <div class="card"><div class="k">Lembar terisi lengkap</div><div class="v">${filled}/${total}</div>
        <div class="bar"><span style="width:${total ? (filled / total) * 100 : 0}%"></span></div></div>
      <div class="card ${done === st.participants.length ? 'good' : 'pending'}"><div class="k">Peserta lengkap</div>
        <div class="v">${done}/${st.participants.length}</div></div>`;

    $('#formulaText').textContent = 'Nilai per juri = ' + st.criteria
      .map((c) => `(${c.label} ÷ 5 × ${S.formatNumber(c.weight)})`).join(' + ') + (wcheck.ok ? '' : ' — BOBOT TIDAK VALID');

    $('#recapTable').innerHTML = `<thead><tr><th>Peserta</th><th>Nama</th>${st.juries.map((j) => `<th class="num">${esc(j.id)}</th>`).join('')}
      <th>Kelengkapan</th><th>Status</th><th class="num">Nilai perusahaan</th></tr></thead><tbody>` +
      recap.map((r) => `<tr data-pid="${esc(r.participantId)}"><td><b>${esc(r.participantId)}</b></td><td>${esc(r.participantName)}</td>
        ${r.perJury.map((pj) => `<td class="num">${pj.complete ? S.formatScore(pj.raw) : '<span class="pill pending">belum</span>'}</td>`).join('')}
        <td>${r.completeCount}/${r.juryCount}</td>
        <td><span class="pill ${r.status === 'Lengkap' ? 'good' : 'pending'}">${r.status}</span></td>
        <td class="num final">${r.final === null ? '—' : S.formatScore(r.finalRaw)}</td></tr>`).join('') + '</tbody>';

    $('#detailTable').innerHTML = `<thead><tr><th>Peserta</th><th>Juri</th>${st.criteria.map((c) => `<th class="num">${esc(c.label)} (${S.formatNumber(c.weight)}%)</th>`).join('')}
      <th class="num">Nilai juri</th><th>Catatan</th></tr></thead><tbody>` +
      recap.map((r) => r.perJury.map((pj) => {
        const s = pj.scores || {};
        return `<tr><td>${esc(r.participantId)}</td><td>${esc(pj.juryId)}</td>
          ${st.criteria.map((c) => `<td class="num">${s[c.id] === null || s[c.id] === undefined ? '<span class="muted">kosong</span>' : esc(String(s[c.id]).replace('.', ','))}</td>`).join('')}
          <td class="num">${pj.complete ? S.formatScore(pj.raw) : '<span class="pill pending">Belum lengkap</span>'}</td>
          <td>${esc(s.note || '')}</td></tr>`;
      }).join('')).join('') + '</tbody>';

    // bobot (jangan menimpa isian yang sedang diketik)
    const form = $('#weightsForm');
    if (!form.dataset.dirty) {
      form.innerHTML = st.criteria.map((c) => `<label>${esc(c.label)}
        <span class="w-in"><input type="text" inputmode="decimal" name="${esc(c.id)}" id="w-${esc(c.id)}" value="${esc(c.weight)}" />%</span></label>`).join('') +
        '<div class="w-total">Total: <b id="wTotal"></b></div>';
    }
    updateWeightTotal();

    $('#participantTable').innerHTML = '<thead><tr><th>ID</th><th>Nama</th><th>Status</th><th></th></tr></thead><tbody>' +
      recap.map((r) => `<tr><td>${esc(r.participantId)}</td><td>${esc(r.participantName)}</td><td>${r.status}</td>
        <td><button class="btn small danger" data-remove="${esc(r.participantId)}">Hapus</button></td></tr>`).join('') + '</tbody>';

    $('#juryTable').innerHTML = '<thead><tr><th>ID</th><th>Nama</th><th></th></tr></thead><tbody>' +
      st.juries.map((j) => `<tr><td><b>${esc(j.id)}</b></td><td>${esc(j.name)}</td>
        <td><button class="btn small danger" data-remove-jury="${esc(j.id)}" ${st.juries.length <= 1 ? 'disabled title="Minimal 1 juri"' : ''}>Hapus</button></td></tr>`).join('') + '</tbody>';

    $('#csvPreview').textContent = S.recapToCSV(st, recap);

    $('#auditTable').innerHTML = '<thead><tr><th>Waktu</th><th>Pelaku</th><th>Aksi</th></tr></thead><tbody>' +
      (st.audit || []).slice().reverse().map((a) => `<tr><td>${esc(new Date(a.at).toLocaleString('id-ID'))}</td><td>${esc(a.actor)}</td><td>${esc(a.action)}</td></tr>`).join('') + '</tbody>';
  }

  function readWeights() {
    const out = {};
    $$('#weightsForm input').forEach((i) => { out[i.name] = i.value; });
    return out;
  }

  function updateWeightTotal() {
    const el = $('#wTotal'); if (!el) return;
    const st = store.getState();
    const w = readWeights();
    const crit = st.criteria.map((c) => ({ ...c, weight: Number(String(w[c.id]).replace(',', '.')) }));
    const chk = S.validateWeights(crit);
    const sum = crit.reduce((a, c) => a + (Number.isFinite(c.weight) ? c.weight : 0), 0);
    el.textContent = S.formatNumber(sum) + '%';
    el.className = chk.ok ? 'ok' : 'bad';
  }

  function renderJury(st) {
    const jid = actor.juryId;
    $('#juryTitle').textContent = `Lembar Penilaian — Juri ${jid}`;
    const recap = S.buildRecap(st);
    $('#juryCards').innerHTML = recap.map((r) => {
      const mine = r.perJury.find((x) => x.juryId === jid) || {};
      const saved = mine.scores || {};
      const draft = juryDrafts[`${jid}:${r.participantId}`] || {};
      const val = (k) => (draft[k] !== undefined ? draft[k] : (saved[k] === null || saved[k] === undefined ? '' : saved[k]));
      return `<div class="jcard" data-pid="${esc(r.participantId)}">
        <div class="jhead"><div><b>${esc(r.participantId)}</b> · ${esc(r.participantName)}</div>
          <span class="pill ${mine.complete ? 'good' : 'pending'}">${mine.complete ? 'Lengkap · ' + S.formatScore(mine.raw) : 'Belum lengkap'}</span></div>
        <div class="jgrid">
          ${st.criteria.map((c) => `<label>${esc(c.label)} <small>(${S.formatNumber(c.weight)}%)</small>
            <input type="text" inputmode="decimal" data-k="${esc(c.id)}" id="in-${esc(r.participantId)}-${esc(c.id)}" value="${esc(val(c.id))}" placeholder="0–5" />
            <span class="ferr" data-err="${esc(c.id)}"></span></label>`).join('')}
          <label class="wide">Catatan <textarea data-k="note" id="in-${esc(r.participantId)}-note" rows="2" placeholder="Catatan penilaian (opsional)">${esc(val('note'))}</textarea></label>
        </div>
        <div class="actions"><button class="btn primary" data-save="${esc(r.participantId)}" id="save-${esc(r.participantId)}">Simpan penilaian ${esc(r.participantId)}</button>
          <span class="muted">Penilaian juri lain tidak ditampilkan.</span></div>
      </div>`;
    }).join('');
  }

  // ---------- event ----------
  $('#role').addEventListener('change', (e) => {
    const v = e.target.value;
    actor = v === 'admin' ? { role: 'admin' } : { role: 'juri', juryId: v };
    render();
  });

  $('#simFail').addEventListener('change', (e) => {
    store.simulateFailure(e.target.checked ? 1 : 0);
    toast(e.target.checked ? 'Mode uji: penyimpanan berikutnya akan gagal.' : 'Mode uji gagal simpan dimatikan.', 'warn');
  });

  $$('.tab').forEach((t) => t.addEventListener('click', () => { activeTab = t.dataset.tab; render(); }));

  $('#weightsForm').addEventListener('input', () => { $('#weightsForm').dataset.dirty = '1'; updateWeightTotal(); $('#weightsMsg').textContent = ''; });
  $('#weightsForm').addEventListener('submit', (e) => e.preventDefault());
  function setPreset(a, b, c) {
    const f = $('#weightsForm'); f.dataset.dirty = '1';
    const ids = store.getState().criteria.map((x) => x.id);
    [a, b, c].forEach((v, i) => { const el = $('#w-' + ids[i]); if (el) el.value = v; });
    updateWeightTotal();
  }
  $('#preset503020').addEventListener('click', () => setPreset(50, 30, 20));
  $('#preset403525').addEventListener('click', () => setPreset(40, 35, 25));
  $('#saveWeights').addEventListener('click', (e) => {
    e.preventDefault();
    const res = store.setWeights(actor, readWeights());
    const msg = $('#weightsMsg');
    if (res.ok) delete $('#weightsForm').dataset.dirty;
    msg.textContent = res.ok ? 'Bobot tersimpan; rekap dihitung ulang.' : res.error;
    msg.className = 'msg ' + (res.ok ? 'ok' : 'bad');
    handle(res, 'Bobot tersimpan dan rekap dihitung ulang.');
  });

  $('#addParticipantForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const res = store.addParticipant(actor, $('#newPid').value, $('#newPname').value);
    $('#participantMsg').textContent = res.ok ? '' : res.error;
    $('#participantMsg').className = 'msg bad';
    if (handle(res, 'Peserta ditambahkan.')) { $('#newPid').value = ''; $('#newPname').value = ''; }
  });

  $('#addJuryForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const res = store.addJury(actor, $('#newJid').value, $('#newJname').value);
    $('#juryMsg').textContent = res.ok ? '' : res.error;
    $('#juryMsg').className = 'msg bad';
    if (handle(res, 'Juri ditambahkan.')) { $('#newJid').value = ''; $('#newJname').value = ''; }
  });

  document.addEventListener('click', (e) => {
    const rm = e.target.closest('[data-remove]');
    if (rm) {
      const id = rm.dataset.remove;
      if (confirm(`Hapus peserta ${id} beserta seluruh skornya?`)) handle(store.removeParticipant(actor, id), `Peserta ${id} dihapus.`);
      return;
    }
    const rmj = e.target.closest('[data-remove-jury]');
    if (rmj) {
      const id = rmj.dataset.removeJury;
      if (confirm(`Hapus juri ${id} beserta seluruh penilaiannya?`)) handle(store.removeJury(actor, id), `Juri ${id} dihapus.`);
      return;
    }
    const sv = e.target.closest('[data-save]');
    if (sv) {
      const pid = sv.dataset.save;
      const card = sv.closest('.jcard');
      const input = {};
      card.querySelectorAll('[data-k]').forEach((i) => { input[i.dataset.k] = i.value; });
      card.querySelectorAll('.ferr').forEach((x) => { x.textContent = ''; });
      card.querySelectorAll('input').forEach((x) => x.classList.remove('invalid'));
      const res = store.saveScore(actor, pid, actor.juryId, input);
      if (res.fieldErrors) {
        Object.entries(res.fieldErrors).forEach(([k, m]) => {
          card.querySelector(`[data-err="${k}"]`).textContent = m;
          card.querySelector(`[data-k="${k}"]`).classList.add('invalid');
        });
        toast(res.error, 'warn');
        return; // tidak render ulang agar isian & pesan tetap terlihat
      }
      const key = `${actor.juryId}:${pid}`;
      juryDrafts[key] = input;
      if (res.ok) delete juryDrafts[key];
      handle(res, `Penilaian ${pid} oleh Juri ${actor.juryId} tersimpan.`);
    }
  });

  $('#resetSample').addEventListener('click', () => {
    if (confirm('Muat ulang data contoh naskah (S01–S03, bobot 40/35/25)? Isian saat ini akan diganti.')) {
      delete $('#weightsForm').dataset.dirty;
      handle(store.resetSample(actor), 'Data contoh dimuat ulang.');
    }
  });

  $('#downloadCsv').addEventListener('click', () => {
    const csv = store.exportCSV();
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'rekap-penilaian-SIMULASI.csv';
    document.body.appendChild(a); a.click(); a.remove();
    toast('CSV diunduh: rekap-penilaian-SIMULASI.csv', 'ok');
  });

  $('#verifyExport').addEventListener('click', () => {
    // Bandingkan angka di tabel dashboard (DOM) dengan baris ringkasan pada CSV.
    const csvRows = store.exportCSV().trim().split('\n').map((l) => l.split(';'));
    const summary = {};
    csvRows.forEach((r) => { if (/^\d+\/\d+$/.test(r[2] || '')) summary[r[0]] = { status: r[3], value: r[4] }; });
    const results = [];
    let ok = true;
    $$('#recapTable tbody tr').forEach((tr) => {
      const pid = tr.dataset.pid;
      const dashVal = tr.querySelector('.final').textContent.trim();
      const expVal = summary[pid] ? summary[pid].value : '(tidak ada)';
      const same = (dashVal === '—' && expVal === 'Belum lengkap') || dashVal === expVal;
      if (!same) ok = false;
      results.push(`${pid}: dashboard ${dashVal} | ekspor ${expVal} ${same ? '✔' : '✘'}`);
    });
    const el = $('#verifyMsg');
    el.textContent = (ok ? 'COCOK — ' : 'TIDAK COCOK — ') + results.join(' · ');
    el.className = 'msg ' + (ok ? 'ok' : 'bad');
  });

  $('#printReport').addEventListener('click', () => { activeTab = 'dash'; render(); window.print(); });

  render();
})();

