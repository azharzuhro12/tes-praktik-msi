// Walkthrough otomatis A3: menjalankan aplikasi di Chrome headless, melakukan skenario uji
// dari naskah, memeriksa angka di layar (E2E), dan menyimpan screenshot berurutan.
// Pemakaian: node tools/a3-walkthrough.js   (hasil di bukti/A3/)
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const ROOT = path.resolve(__dirname, '..');
const APP = path.join(ROOT, 'A3-penilaian-awards');
const OUT = path.join(ROOT, 'bukti', 'A3');
fs.mkdirSync(OUT, { recursive: true });
for (const f of fs.readdirSync(OUT)) if (/^step-\d+.*\.png$/.test(f)) fs.unlinkSync(path.join(OUT, f));

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };
const server = http.createServer((req, res) => {
  const p = path.join(APP, decodeURIComponent(req.url.split('?')[0]) === '/' ? 'index.html' : decodeURIComponent(req.url.split('?')[0]));
  if (!p.startsWith(APP) || !fs.existsSync(p)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': (MIME[path.extname(p)] || 'application/octet-stream') + '; charset=utf-8' });
  fs.createReadStream(p).pipe(res);
});

const log = [];
const checks = [];
function check(name, cond, detail) {
  checks.push({ name, ok: !!cond, detail });
  log.push(`${cond ? 'LULUS' : 'GAGAL'} | ${name}${detail ? ' | ' + detail : ''}`);
}

(async () => {
  await new Promise((r) => server.listen(0, r));
  const url = `http://127.0.0.1:${server.address().port}/`;
  const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  page.on('dialog', (d) => d.accept());
  const consoleErrors = [];
  page.on('pageerror', (e) => consoleErrors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  const cdp = await page.createCDPSession();
  await cdp.send('Browser.setDownloadBehavior', { behavior: 'allow', downloadPath: OUT }).catch(() => {});

  await page.goto(url, { waitUntil: 'load' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'load' });

  let n = 0;
  async function shot(caption, scrollSel) {
    n += 1;
    await page.evaluate((sel) => {
      if (sel) { const el = document.querySelector(sel); if (el) el.scrollIntoView({ block: 'center' }); }
      else window.scrollTo(0, 0);
    }, scrollSel || null);
    await page.evaluate((cap, num) => {
      let c = document.getElementById('__cap');
      if (!c) {
        c = document.createElement('div'); c.id = '__cap';
        c.style.cssText = 'position:fixed;left:0;right:0;bottom:0;z-index:99;background:rgba(18,48,90,.94);color:#fff;font:600 17px/1.35 "Segoe UI",sans-serif;padding:12px 22px;border-top:4px solid #c9a227';
        document.body.appendChild(c);
      }
      c.textContent = `A3-D01 · Langkah ${num}: ${cap}`;
    }, caption, n);
    await new Promise((r) => setTimeout(r, 150));
    const file = `step-${String(n).padStart(2, '0')}.png`;
    await page.screenshot({ path: path.join(OUT, file) });
    log.push(`[${file}] ${caption}`);
  }
  const text = (sel) => page.$eval(sel, (e) => e.textContent.trim());
  const finals = () => page.$$eval('#recapTable tbody tr', (trs) => Object.fromEntries(trs.map((t) => [t.dataset.pid, t.querySelector('.final').textContent.trim()])));
  async function setRole(v) { await page.select('#role', v); await new Promise((r) => setTimeout(r, 100)); }
  async function tab(t) { await page.click(`.tab[data-tab="${t}"]`); }
  async function typeInto(sel, val) { await page.click(sel, { clickCount: 3 }); await page.$eval(sel, (e) => { e.value = ''; }); if (val !== '') await page.type(sel, String(val)); }

  // 1. Dashboard awal
  const f1 = await finals();
  check('Rekap awal S01=74,0 S02=72,5 S03=81,5', f1.S01 === '74,0' && f1.S02 === '72,5' && f1.S03 === '81,5', JSON.stringify(f1));
  await shot('Admin membuka dashboard — data contoh naskah, rekap S01 74,0 · S02 72,5 · S03 81,5');
  await shot('Rincian per juri sesuai tabel naskah: 73,0 / 75,0 / 72,0 / 73,0 / 83,0 / 80,0', '#detailTable');
  const detail = await page.$$eval('#detailTable tbody tr', (trs) => trs.map((t) => t.children[5].textContent.trim()));
  check('Nilai per juri tampil 73,0 75,0 72,0 73,0 83,0 80,0', detail.join(' ') === '73,0 75,0 72,0 73,0 83,0 80,0', detail.join(' '));

  // 2. Bobot 50/30/20
  await tab('weights');
  await page.click('#preset503020');
  await shot('Admin mengubah bobot menjadi 50% / 30% / 20% (total 100%)');
  await page.click('#saveWeights');
  await tab('dash');
  const s01j1 = await page.$$eval('#recapTable tbody tr', (trs) => trs[0].children[2].textContent.trim());
  check('Bobot 50/30/20 -> S01 J1 = 74,0', s01j1 === '74,0', s01j1);
  await shot(`Rekap dihitung ulang otomatis — S01 J1 menjadi ${s01j1}`);

  // 3. Bobot tidak valid
  await tab('weights');
  await typeInto('#w-hasil', '30');
  await page.click('#saveWeights');
  const wmsg = await text('#weightsMsg');
  check('Total bobot 110% ditolak', /ditolak/.test(wmsg), wmsg);
  await shot('Total bobot 110% ditolak — bobot lama tetap berlaku');

  // 4. Kembalikan 40/35/25
  await page.click('#preset403525');
  await page.click('#saveWeights');
  await tab('dash');
  const f4 = await finals();
  check('Bobot kembali 40/35/25 -> rekap kembali 74,0/72,5/81,5', f4.S01 === '74,0' && f4.S02 === '72,5' && f4.S03 === '81,5', JSON.stringify(f4));

  // 5. Juri J1 — skor 6
  await setRole('J1');
  await shot('Masuk sebagai Juri J1 (pemilih peran simulasi) — hanya lembar milik J1 yang tampil');
  await typeInto('#in-S01-strategi', '6');
  await page.click('#save-S01');
  const ferr = await page.$eval('#in-S01-strategi + .ferr', (e) => e.textContent.trim());
  check('Skor 6 ditolak dengan pesan rentang 0–5', /rentang 0–5/.test(ferr), ferr);
  await shot('Skor 6 ditolak: "skor harus pada rentang 0–5" — data tidak disimpan', '#in-S01-strategi');

  // 6. Juri J2 mengosongkan S01
  await setRole('J2');
  for (const k of ['strategi', 'implementasi', 'hasil']) await typeInto(`#in-S01-${k}`, '');
  await page.click('#save-S01');
  await shot('Juri J2 mengosongkan isian S01 lalu menyimpan → status Belum lengkap');
  await setRole('admin');
  await tab('dash');
  const f6 = await finals();
  const st6 = await page.$$eval('#recapTable tbody tr', (trs) => trs[0].querySelector('.pill').textContent.trim() + ' / ' + trs[0].children[5].textContent.trim());
  check('J2 kosong -> S01 Belum lengkap, nilai "—" (bukan nol)', f6.S01 === '—' && /Belum lengkap/.test(await text('#recapTable tbody tr:first-child')), `final=${f6.S01}; ${st6}`);
  await shot('Dashboard admin: S01 Belum lengkap (1/2), nilai tidak dihitung sebagai nol');

  // 7. Penyimpanan gagal + coba ulang
  await setRole('J2');
  await typeInto('#in-S01-strategi', '4');
  await typeInto('#in-S01-implementasi', '4');
  await typeInto('#in-S01-hasil', '3');
  await typeInto('#in-S01-note', 'Bukti implementasi cukup jelas (catatan simulasi).');
  await page.click('#simFail');
  await page.click('#save-S01');
  await new Promise((r) => setTimeout(r, 150));
  const toastTxt = await text('#toast');
  check('Gagal simpan -> pesan gagal + tombol Coba ulang, bukan "berhasil"', /gagal/i.test(toastTxt) && !/tersimpan\./.test(toastTxt) && !!(await page.$('#retryBtn')), toastTxt);
  const statusAfterFail = await page.$eval('.jcard[data-pid="S01"] .pill', (e) => e.textContent.trim());
  check('Setelah gagal simpan, status S01 tetap Belum lengkap', statusAfterFail === 'Belum lengkap', statusAfterFail);
  await shot('Simulasi penyimpanan gagal: muncul pesan "Data BELUM tersimpan" + tombol Coba ulang; isian tidak hilang');
  await page.click('#retryBtn');
  await new Promise((r) => setTimeout(r, 150));
  await shot('Coba ulang berhasil — penilaian S01 Juri J2 tersimpan (Lengkap · 75,0)');

  // 8. Muat ulang halaman: data persisten
  await page.reload({ waitUntil: 'load' });
  await setRole('admin');
  const f8 = await finals();
  check('Setelah refresh data tetap tersimpan, S01 kembali 74,0', f8.S01 === '74,0', JSON.stringify(f8));
  await shot('Halaman dimuat ulang — data tersimpan; S01 kembali Lengkap 74,0');

  // 9. Ekspor
  await tab('export');
  await page.click('#verifyExport');
  const vmsg = await text('#verifyMsg');
  check('Ekspor CSV = dashboard', /^COCOK/.test(vmsg), vmsg);
  await page.click('#downloadCsv');
  await shot('Ekspor: pemeriksaan otomatis "ekspor = dashboard" → COCOK; pratinjau CSV');
  await new Promise((r) => setTimeout(r, 800));

  // 10. Audit
  await tab('audit');
  await shot('Jejak perubahan: siapa mengubah apa (bobot, skor, gagal tidak tercatat sebagai sukses)');

  // halaman penuh untuk A3-S01
  await setRole('admin'); await tab('dash');
  await page.evaluate(() => { const c = document.getElementById('__cap'); if (c) c.remove(); });
  await page.screenshot({ path: path.join(OUT, 'A3-S01-admin-dashboard.png'), fullPage: true });
  await setRole('J1');
  await page.screenshot({ path: path.join(OUT, 'A3-S01-juri-J1.png'), fullPage: true });
  await setRole('admin'); await tab('weights');
  await page.screenshot({ path: path.join(OUT, 'A3-S01-admin-bobot.png') });

  check('Tidak ada error JavaScript di konsol', consoleErrors.length === 0, consoleErrors.join(' | '));
  await browser.close();
  server.close();

  const passed = checks.filter((c) => c.ok).length;
  const header = `A3 — Hasil uji end-to-end di peramban (Chrome headless)\nWaktu: ${new Date().toISOString()}\nLulus ${passed}/${checks.length}\n\n`;
  fs.writeFileSync(path.join(OUT, 'A3-U01-e2e.txt'), header + log.join('\n') + '\n');
  console.log(header + log.join('\n'));
  process.exit(passed === checks.length ? 0 : 1);
})().catch((e) => { console.error(e); server.close(); process.exit(1); });

