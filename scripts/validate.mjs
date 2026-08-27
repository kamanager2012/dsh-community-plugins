import { readFileSync } from 'node:fs';

const raw = readFileSync('catalog.json', 'utf8');
const catalog = JSON.parse(raw);

if (catalog.version !== 1) {
  console.error("Invalid catalog version");
  process.exit(1);
}

if (!Array.isArray(catalog.plugins) || catalog.plugins.length === 0) {
  console.error("Catalog must contain non-empty plugins array");
  process.exit(1);
}

for (const p of catalog.plugins) {
  if (!p.name || !p.description || !p.author || !p.repo || !p.category || !Array.isArray(p.versions)) {
    console.error(`Invalid plugin entry structure: ${p.name}`);
    process.exit(1);
  }
}

console.log(`✓ Catalog validation passed! Total verified plugins: ${catalog.plugins.length}`);
