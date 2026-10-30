// Validates every test vector against the matching lexicon's "main" record
// def, using assertValidRecord (real per-record validation, including the
// #payload ref). Filename prefix declares the expectation: a file under
// valid-*.json must pass; invalid-*.json must fail.
import { Lexicons } from '@atproto/lexicon';
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const lexiconsDir = join(here, '..', 'lexicons', 'com', 'aegisfederation', 'governance');

// test-vectors/<dir> -> lexicons/.../<file>.json
const EVENT_TYPES = {
  'circumvention-report': 'circumventionReport',
  'risk-signal': 'riskSignal',
  'policy-update': 'policyUpdate',
  attestation: 'attestation',
  'incident-notice': 'incidentNotice',
};

let failed = false;

for (const [dirName, lexName] of Object.entries(EVENT_TYPES)) {
  const lexDoc = JSON.parse(readFileSync(join(lexiconsDir, `${lexName}.json`), 'utf8'));
  const lex = new Lexicons([lexDoc]);
  const nsid = lexDoc.id;

  const vectorDir = join(here, dirName);
  const files = readdirSync(vectorDir)
    .filter((f) => f.endsWith('.json'))
    .sort();

  for (const file of files) {
    const record = JSON.parse(readFileSync(join(vectorDir, file), 'utf8'));
    const expectValid = file.startsWith('valid-');
    const expectInvalid = file.startsWith('invalid-');
    if (!expectValid && !expectInvalid) {
      failed = true;
      console.error(`SKIP ${dirName}/${file}: filename must start with "valid-" or "invalid-"`);
      continue;
    }

    let threw = false;
    let message = '';
    try {
      lex.assertValidRecord(nsid, record);
    } catch (err) {
      threw = true;
      message = err.message;
    }

    if (expectValid && threw) {
      failed = true;
      console.error(`FAIL ${dirName}/${file}: expected valid, got error: ${message}`);
    } else if (expectInvalid && !threw) {
      failed = true;
      console.error(`FAIL ${dirName}/${file}: expected invalid, but record passed validation`);
    } else {
      console.log(`OK   ${dirName}/${file}`);
    }
  }
}

if (failed) {
  console.error('\nTest vector validation failed.');
  process.exit(1);
}

console.log('\nAll test vectors validated as expected.');
