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
  if (typeof pkg.main === 'string') pkg.main = pkg.main.replace(/^dist\//, '');
  if (typeof pkg.module === 'string') pkg.module = pkg.module.replace(/^dist\//, '');
  if (typeof pkg.typings === 'string') pkg.typings = pkg.typings.replace(/^dist\//, '');

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