// Remove Windows-specific rollup optional binary on non-Windows platforms to avoid EBADPLATFORM
import fs from 'fs';
import path from 'path';

if (process.platform === 'win32') {
  console.log('[strip-win-rollup] Running on Windows; nothing to do.');
  process.exit(0);
}

const lockFile = path.join(process.cwd(), 'package-lock.json');
if (!fs.existsSync(lockFile)) {
  console.log('[strip-win-rollup] No package-lock.json found.');
  process.exit(0);
}

try {
  const raw = fs.readFileSync(lockFile, 'utf8');
  const json = JSON.parse(raw);
  const before = JSON.stringify(json).length;

  function prune(obj) {
    if (!obj || typeof obj !== 'object') return;
    for (const key of Object.keys(obj)) {
      if (key.includes('rollup-win32-x64-msvc')) {
        delete obj[key];
      } else {
        prune(obj[key]);
      }
    }
  }

  prune(json.packages);
  prune(json.dependencies);

  const after = JSON.stringify(json).length;
  if (after !== before) {
    fs.writeFileSync(lockFile, JSON.stringify(json, null, 2));
    console.log('[strip-win-rollup] Removed Windows rollup entries.');
  } else {
    console.log('[strip-win-rollup] No Windows rollup entries found.');
  }
} catch (e) {
  console.warn('[strip-win-rollup] Failed to process lock file:', e.message);
}
