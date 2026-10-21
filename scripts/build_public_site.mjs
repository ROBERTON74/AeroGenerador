import { execFileSync } from 'node:child_process';
import { cp, mkdir, readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const run = (script, args, cwd = root) => execFileSync(process.execPath, [path.join(root, script), ...args], { cwd, stdio: 'inherit' });
run('node_modules/vite/bin/vite.js', ['build']);
run('portal/node_modules/@angular/cli/bin/ng.js', ['build', '--base-href=/portal/', '--output-path=../.portal-build'], path.join(root, 'portal'));
const destination = path.join(root, 'dist/portal');
await mkdir(destination, { recursive: true });
await cp(path.join(root, '.portal-build/browser'), destination, { recursive: true });
const html = await readFile(path.join(destination, 'index.html'), 'utf8');
if (!html.includes('<base href="/portal/">')) throw new Error('Portal base URL is incorrect');
const files = await readdir(destination);
if (!files.some(name => name.startsWith('main-'))) throw new Error('Portal JavaScript missing');
console.log('Public build ready: React at / and Angular at /portal/');
