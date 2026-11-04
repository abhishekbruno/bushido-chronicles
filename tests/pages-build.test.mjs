import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const files = root => fs.readdirSync(root, { recursive: true }).map(p => p.replaceAll('\\', '/'))
  .filter(p => fs.statSync(path.join(root, p)).isFile());
const publicFiles = files('public');
const sourceFiles = files('src');

test('production entry references existing subdirectory JS, CSS and favicon', () => {
  const html = fs.readFileSync('dist/index.html', 'utf8');
  const urls = [...html.matchAll(/(?:src|href)="(\/[^\"]+)"/g)].map(m => m[1]);
  assert.ok(urls.some(p => p.endsWith('.js')));
  assert.ok(urls.some(p => p.endsWith('.css')));
  for (const url of urls) {
    assert.ok(url.startsWith('/bushido-chronicles/'), url);
    assert.ok(files('dist').includes(url.slice('/bushido-chronicles/'.length)), url);
  }
});

test('all public artwork is copied byte-for-byte', () => {
  for (const file of publicFiles) {
    assert.deepEqual(fs.readFileSync(`dist/${file}`), fs.readFileSync(`public/${file}`), file);
  }
});

test('public image references exist with exact case, including every warrior layer', () => {
  for (const file of sourceFiles.filter(p => /\.(jsx?|css)$/.test(p))) {
    const source = fs.readFileSync(`src/${file}`, 'utf8');
    for (const match of source.matchAll(/\/images\/[^'"`\s)]+\.(?:png|jpe?g|webp|svg)/g)) {
      const variants = match[0].includes('${id}')
        ? ['musashi', 'nobunaga', 'masamune', 'yukimura'].map(id => match[0].replace('${id}', id))
        : [match[0]];
      for (const url of variants) assert.ok(publicFiles.includes(url.slice(1)), `${file}: ${url}`);
    }
    for (const match of source.matchAll(/(?:from\s*|import\s*)['"](\.[^'"]+)['"]/g)) {
      const target = path.posix.normalize(path.posix.join(path.posix.dirname(file), match[1]));
      assert.ok(['', '.js', '.jsx', '/index.js', '/index.jsx'].some(ext => sourceFiles.includes(target + ext)), `${file}: ${target}`);
    }
  }
});
