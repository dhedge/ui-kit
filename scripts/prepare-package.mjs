import fs from 'fs/promises';
import path from 'path';

const ROOT = process.cwd();
const DIST = path.join(ROOT, 'dist');

async function run() {
  const raw = await fs.readFile(path.join(ROOT, 'package.json'), 'utf8');
  const pkg = JSON.parse(raw);

  // Remove fields that should not be published in consumer-facing manifest
  delete pkg.devDependencies;
  delete pkg.scripts;
  delete pkg.husky;
  delete pkg['lint-staged'];
  delete pkg.publishConfig; // will be redundant inside dist
  delete pkg.files; // not needed in dist manifest

  // Adjust paths so they are relative to dist root
  const trimDist = (p) => {
    if (typeof p !== 'string') return p
    // remove optional leading './' followed by 'dist/'
    let withoutDist = p.replace(/^(?:\.\/)?dist\//, '')
    // ensure the path is relative and starts with './'
    if (!withoutDist.startsWith('./')) {
      withoutDist = `./${withoutDist}`
    }
    return withoutDist
  }
  if (typeof pkg.main === 'string') pkg.main = trimDist(pkg.main)
  if (typeof pkg.module === 'string') pkg.module = trimDist(pkg.module)
  if (typeof pkg.typings === 'string') pkg.typings = trimDist(pkg.typings)

  if (pkg.exports) {
    for (const [key, value] of Object.entries(pkg.exports)) {
      if (typeof value === 'string') {
        pkg.exports[key] = trimDist(value)
      } else if (typeof value === 'object' && value !== null) {
        if (typeof value.import === 'string') value.import = trimDist(value.import)
        if (typeof value.require === 'string') value.require = trimDist(value.require)
        if (typeof value.types === 'string') value.types = trimDist(value.types)
      }
    }
  }

  // Trim paths in sideEffects array (if present)
  if (Array.isArray(pkg.sideEffects)) {
    pkg.sideEffects = pkg.sideEffects.map((p) => trimDist(p))
  }

  await fs.mkdir(DIST, { recursive: true });
  await fs.writeFile(path.join(DIST, 'package.json'), JSON.stringify(pkg, null, 2));

  // copy README and LICENSE if present
  const copyIfExists = async (file) => {
    const src = path.join(ROOT, file);
    try {
      await fs.access(src);
      await fs.copyFile(src, path.join(DIST, path.basename(file)));
    } catch (_) {}
  };
  await Promise.all(['README.md', 'LICENSE'].map(copyIfExists));

}

run(); 