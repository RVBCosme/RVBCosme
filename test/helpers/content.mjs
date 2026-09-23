import { readFileSync } from 'node:fs';

const FIXTURE = new URL('../fixtures/approved-content.json', import.meta.url);

/** A fresh copy of the approved content, safe to mutate in a test. */
export const fixture = () => JSON.parse(readFileSync(FIXTURE, 'utf8'));
