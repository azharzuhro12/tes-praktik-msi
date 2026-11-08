const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const mdPath = path.join(ROOT, 'AzharZuhro_TesPraktik_MSI.md');
const outPdf = path.join(ROOT, 'AzharZuhro_TesPraktik_MSI.pdf');

function formatText(t) {
  let s = t
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
    .replace(/\*([^*]+)\*/g, '<i>$1</i>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  return s;
}

const md = fs.readFileSync(mdPath, 'utf-8');
const lines = md.split(/\r?\n/);

let html = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="utf-8">
<title>AzharZuhro_TesPraktik_MSI</title>
<style>
@page { size: A4; margin: 15mm 15mm 18mm 15mm; }
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: #1e293b;
  font-size: 9.5pt;
  line-height: 1.45;
  margin: 0;
}
h1 { font-size: 14pt; color: #0f172a; border-bottom: 2px solid #0284c7; padding-bottom: 4px; margin: 0 0 10px; }
h2 { font-size: 11pt; color: #0369a1; border-bottom: 1px solid #e2e8f0; padding-bottom: 3px; margin: 14px 0 6px; page-break-after: avoid; }
h3 { font-size: 10pt; color: #334155; margin: 10px 0 4px; page-break-after: avoid; }
p, li { margin: 3px 0; }
ul, ol { margin: 3px 0 6px; padding-left: 18px; }
blockquote {
  background: #f8fafc;
  border-left: 3px solid #0284c7;
  margin: 6px 0;
  padding: 6px 12px;
  font-size: 8.5pt;
  color: #475569;
}
table { width: 100%; border-collapse: collapse; font-size: 8.5pt; margin: 8px 0; page-break-inside: avoid; }
th, td { border: 1px solid #cbd5e1; padding: 4px 6px; text-align: left; vertical-align: top; }
th { background: #f1f5f9; font-weight: 600; color: #334155; }
code { background: #f1f5f9; padding: 1px 4px; border-radius: 3px; font-family: monospace; font-size: 8.5pt; color: #0f766e; }
hr { border: 0; border-top: 1px solid #e2e8f0; margin: 10px 0; }
a { color: #0284c7; text-decoration: none; }
</style>
</head>
<body>
`;

let inUl = false;
let inTbl = false;

for (let ln of lines) {
  let trimmed = ln.trim();
  if (trimmed.startsWith('|')) {
    if (inUl) { html += '</ul>\n'; inUl = false; }
    let cells = trimmed.slice(1, -1).split('|').map(c => c.trim());
    if (cells.every(c => /^[-:]+$/.test(c))) continue;
    if (!inTbl) {
      html += '<table><thead><tr>' + cells.map(c => `<th>${formatText(c)}</th>`).join('') + '</tr></thead><tbody>\n';
      inTbl = true;
    } else {
      html += '<tr>' + cells.map(c => `<td>${formatText(c)}</td>`).join('') + '</tr>\n';
    }
    continue;
  } else if (inTbl) {
    html += '</tbody></table>\n';
    inTbl = false;
  }

  if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
    if (!inUl) { html += '<ul>\n'; inUl = true; }
    html += `<li>${formatText(trimmed.slice(2))}</li>\n`;
    continue;
  } else if (inUl) {
    html += '</ul>\n';
    inUl = false;
  }

  if (trimmed.startsWith('# ')) {
    html += `<h1>${formatText(trimmed.slice(2))}</h1>\n`;
  } else if (trimmed.startsWith('## ')) {
    html += `<h2>${formatText(trimmed.slice(3))}</h2>\n`;
  } else if (trimmed.startsWith('### ')) {
    html += `<h3>${formatText(trimmed.slice(4))}</h3>\n`;
  } else if (trimmed.startsWith('> ')) {
    html += `<blockquote>${formatText(trimmed.slice(2))}</blockquote>\n`;
  } else if (trimmed.startsWith('---')) {
    html += `<hr>\n`;
  } else if (trimmed === '') {
    // blank line
  } else {
    html += `<p>${formatText(trimmed)}</p>\n`;
  }
}

if (inUl) html += '</ul>\n';
if (inTbl) html += '</tbody></table>\n';
html += '</body></html>';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'load' });
  await page.pdf({
    path: outPdf,
    format: 'A4',
    margin: { top: '15mm', right: '15mm', bottom: '18mm', left: '15mm' },
    printBackground: true
  });
  await browser.close();
  console.log('PDF rendered successfully:', outPdf);
})();
