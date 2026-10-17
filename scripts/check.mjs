#!/usr/bin/env node
// Verificación del sitio sin dependencias: node scripts/check.mjs
// Sale con código 1 si algún chequeo falla.
import { readFileSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = f => readFileSync(join(root, f), 'utf8');
const html = read('index.html');
const css = read('styles.css');
const js = read('script.js');

const errors = [];
const check = (name, problems) => {
  console.log(`${problems.length ? '✗' : '✓'} ${name}`);
  for (const p of problems) console.log(`    ${p}`);
  errors.push(...problems);
};
const all = (re, s) => Array.from(s.matchAll(re), m => m[1]);
const isExternal = u => /^([a-z]+:|\/\/|#)/i.test(u);

// 1. Sintaxis JS
const syntax = spawnSync(process.execPath, ['--check', join(root, 'script.js')], { encoding: 'utf8' });
const syntaxLines = syntax.stderr.trim().split('\n');
check('script.js: sintaxis', syntax.status === 0 ? [] :
  [`${syntaxLines[0].split('/').pop()} ${syntaxLines.find(l => /Error/.test(l)) || ''}`]);

// 2. Archivos locales referenciados
const htmlRefs = [
  ...all(/\b(?:src|href)="([^"]+)"/g, html),
  ...all(/\bsrcset="([^"]+)"/g, html).flatMap(s => s.split(',').map(p => p.trim().split(/\s+/)[0])),
];
// Primero las url() entre comillas: las data: URI pueden llevar url() anidadas
const cssQuoted = Array.from(css.matchAll(/url\((['"])(.*?)\1\)/g), m => m[2]);
const cssBare = all(/url\(([^'")]+)\)/g, css.replace(/url\((['"])(.*?)\1\)/g, ''));
const missing = [...new Set([...htmlRefs, ...cssQuoted, ...cssBare])]
  .filter(u => u && !isExternal(u))
  .map(u => u.split(/[?#]/)[0])
  .filter(u => u && !existsSync(join(root, decodeURI(u))))
  .map(u => `no existe: ${u}`);
check('referencias locales', missing);

// 3. Imágenes con alt
check('<img> con alt', (html.match(/<img\b[^>]*>/g) || [])
  .filter(t => !/\balt=/.test(t))
  .map(t => `sin alt: ${t.slice(0, 80)}`));

// 4. IDs únicos y referencias a IDs
const ids = all(/\sid="([^"]+)"/g, html);
const seen = new Set();
check('IDs únicos', ids.filter(id => seen.has(id) || !seen.add(id)).map(id => `duplicado: #${id}`));
const idRefs = [
  ...all(/\shref="#([^"]+)"/g, html),
  ...all(/\s(?:aria-controls|aria-labelledby|aria-describedby|for)="([^"]+)"/g, html).flatMap(v => v.split(/\s+/)),
];
check('anclas e IDs referenciados', [...new Set(idRefs)].filter(id => !seen.has(id)).map(id => `no existe: #${id}`));

// 5. Variables CSS usadas sin definir (las que llevan valor por defecto no cuentan)
const defined = new Set([
  ...all(/(--[\w-]+)\s*:/g, css),
  ...all(/\sstyle="([^"]*)"/g, html).flatMap(s => all(/(--[\w-]+)\s*:/g, s)),
  ...all(/setProperty\(\s*['"](--[\w-]+)/g, js),
]);
const used = all(/var\(\s*(--[\w-]+)\s*\)/g, css + html);
check('variables CSS definidas', [...new Set(used)].filter(v => !defined.has(v)).map(v => `sin definir: ${v}`));

console.log(errors.length ? `\n${errors.length} problema(s)` : '\nTodo correcto');
process.exit(errors.length ? 1 : 0);
