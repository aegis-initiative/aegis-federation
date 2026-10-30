// Uses the package's exported `lexiconDoc` zod schema directly, NOT
// `Lexicons.prototype.add()`. `.add()` only registers a doc into an
// in-memory map and resolves $ref URIs -- it performs no schema validation
// at all (confirmed by reading @atproto/lexicon's compiled source: it would
// silently accept a doc with an invalid `lexicon` version, a missing `id`,
// an unknown def `type`, or an unknown field-level primitive type). The
// `lexiconDoc` schema is what actually enforces the Lexicon spec's shape
// and the primitive-type enum.
import { lexiconDoc } from '@atproto/lexicon';
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const dir = join(here, 'com', 'aegisfederation', 'governance');
const files = readdirSync(dir)
  .filter((f) => f.endsWith('.json'))
  .sort();

if (files.length === 0) {
  console.error(`No lexicon JSON files found in ${dir}`);
  process.exit(1);
}

let failed = false;

for (const file of files) {
  const path = join(dir, file);
  const doc = JSON.parse(readFileSync(path, 'utf8'));
  const result = lexiconDoc.safeParse(doc);
  if (result.success) {
    console.log(`OK   ${file} (${doc.id})`);
  } else {
    failed = true;
    const messages = result.error.issues
      .map((issue) => `${issue.path.join('.') || '(root)'}: ${issue.message}`)
      .join('; ');
    console.error(`FAIL ${file}: ${messages}`);
  }
}

if (failed) {
  console.error(`\nLexicon validation failed.`);
  process.exit(1);
}

console.log(`\nAll ${files.length} lexicon schemas valid.`);
