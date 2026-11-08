const puppeteer = require('puppeteer-core');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const A1_DIR = path.join(ROOT, 'A1-agent-layanan');
const A6_DIR = path.join(ROOT, 'A6-crm');
const BUKTI_A1 = path.join(ROOT, 'bukti', 'A1');
const BUKTI_A6 = path.join(ROOT, 'bukti', 'A6');
fs.mkdirSync(BUKTI_A1, { recursive: true });
fs.mkdirSync(BUKTI_A6, { recursive: true });

function serveDir(dir) {
  const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };
  return http.createServer((req, res) => {
    const p = path.join(dir, decodeURIComponent(req.url.split('?')[0]) === '/' ? 'index.html' : decodeURIComponent(req.url.split('?')[0]));
    if (!p.startsWith(dir) || !fs.existsSync(p)) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'Content-Type': (MIME[path.extname(p)] || 'application/octet-stream') + '; charset=utf-8' });
    fs.createReadStream(p).pipe(res);
  });
}

(async () => {
  const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox'] });

  // --- A1 Walkthrough ---
  const srv1 = serveDir(A1_DIR);
  await new Promise(r => srv1.listen(0, r));
  const url1 = `http://127.0.0.1:${srv1.address().port}/`;
  const page1 = await browser.newPage();
  await page1.setViewport({ width: 1280, height: 860 });
  await page1.goto(url1, { waitUntil: 'load' });
  await page1.evaluate(() => localStorage.clear());
  await page1.reload({ waitUntil: 'load' });

  // 1. Tanya sponsor (P03 pertama kali -> dicatat)
  await page1.click('.q:nth-of-type(1)');
  await new Promise(r => setTimeout(r, 150));
  // 2. Tanya bintang 5 (P03 kedua kali -> tidak dibuat ganda, eskalasi KB04)
  await page1.click('.q:nth-of-type(2)');
  await new Promise(r => setTimeout(r, 150));
  // 3. Tanya harga paket & jadwal (KB02 + KB04)
  await page1.click('.q:nth-of-type(3)');
  await new Promise(r => setTimeout(r, 150));
  // 4. Tanya di luar KB
  await page1.click('.q:nth-of-type(5)');
  await new Promise(r => setTimeout(r, 150));

  await page1.screenshot({ path: path.join(BUKTI_A1, 'A1-S01-chat-kb-eskalasi.png') });

  // Simulasikan database gagal lalu kirim pertanyaan
  await page1.click('#simFail');
  await page1.click('.q:nth-of-type(4)');
  await new Promise(r => setTimeout(r, 150));
  await page1.screenshot({ path: path.join(BUKTI_A1, 'A1-S01-duplikasi-dan-gagal.png') });

  // Coba ulang pencatatan lalu lihat sebagai staf
  const retry1 = await page1.$('#retryBtn');
  if (retry1) await retry1.click();
  await page1.select('#viewer', 'staf');
  await new Promise(r => setTimeout(r, 150));
  await page1.screenshot({ path: path.join(BUKTI_A1, 'A1-S01-staf-draft-queue.png') });

  await page1.close();
  srv1.close();

  // --- A6 Walkthrough ---
  const srv6 = serveDir(A6_DIR);
  await new Promise(r => srv6.listen(0, r));
  const url6 = `http://127.0.0.1:${srv6.address().port}/`;
  const page6 = await browser.newPage();
  await page6.setViewport({ width: 1360, height: 920 });
  await page6.goto(url6, { waitUntil: 'load' });
  await page6.evaluate(() => localStorage.clear());
  await page6.reload({ waitUntil: 'load' });

  // Pilih P03, tambah catatan & tindak lanjut 2026-11-05, buat draf AI
  await page6.click('.pc[data-id="P03"]');
  await new Promise(r => setTimeout(r, 150));
  await page6.click('#addNote');
  await new Promise(r => setTimeout(r, 150));
  await page6.click('#mkDraft');
  await new Promise(r => setTimeout(r, 150));
  await page6.screenshot({ path: path.join(BUKTI_A6, 'A6-S01-pipeline-detail-p03.png') });

  // Uji masukkan P03 lagi -> duplikasi ditandai, total tetap 10
  await page6.click('#tryDup');
  await new Promise(r => setTimeout(r, 150));
  await page6.screenshot({ path: path.join(BUKTI_A6, 'A6-S01-duplikasi-p03.png') });

  // Ganti ke Manajer untuk menyetujui draf
  await page6.select('#role', 'M');
  await new Promise(r => setTimeout(r, 150));
  const approveBtn = await page6.$('[data-approve]');
  if (approveBtn) await approveBtn.click();
  await new Promise(r => setTimeout(r, 150));
  await page6.screenshot({ path: path.join(BUKTI_A6, 'A6-S01-manager-approved-draft.png') });

  await page6.close();
  srv6.close();
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
