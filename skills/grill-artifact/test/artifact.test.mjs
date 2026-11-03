// Tests for artifact.mjs ingest: the read-back of the Artifact's `sends` collection becomes events.jsonl lines.
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const ARTIFACT = join(here, "..", "artifact.mjs");
const ingest = (session, sends) => spawnSync(process.execPath, [ARTIFACT, "ingest", "--session", session, "--sends", sends], { encoding: "utf8" });
const lines = (session) => readFileSync(join(session, "events.jsonl"), "utf8").trim().split("\n").map((l) => JSON.parse(l));
const send = (seq) => ({ type: "send", seq, at: `2026-11-03T00:00:0${seq}Z`, actions: [{ q: "q1", type: "accept" }] });

test("ingest: reads the folder ArtifactData list writes with out_dir, one document per file", () => {
  const session = mkdtempSync(join(tmpdir(), "grill-a-"));
  const out = mkdtempSync(join(tmpdir(), "grill-dl-"));
  mkdirSync(join(out, "sends"));
  writeFileSync(join(out, "sends", "2.json"), JSON.stringify(send(2)));
  writeFileSync(join(out, "sends", "1.json"), JSON.stringify(send(1)));

  for (const target of [out, join(out, "sends")]) {
    const r = ingest(session, target);
    assert.equal(r.status, 0, r.stderr);
  }
  assert.deepEqual(lines(session).map((e) => e.seq), [1, 2], "both sends, in order, once each across two runs");
});

test("ingest: still reads one file holding a JSON array, and one file holding a single document", () => {
  const session = mkdtempSync(join(tmpdir(), "grill-a-"));
  const dir = mkdtempSync(join(tmpdir(), "grill-f-"));
  writeFileSync(join(dir, "all.json"), JSON.stringify([{ id: "sends/1", data: send(1) }]));
  writeFileSync(join(dir, "3.json"), JSON.stringify(send(3)));
  assert.equal(ingest(session, join(dir, "all.json")).status, 0);
  assert.equal(ingest(session, join(dir, "3.json")).status, 0);
  assert.deepEqual(lines(session).map((e) => e.seq), [1, 3]);
});

test("ingest: a document with no seq field takes its number from its file name", () => {
  const session = mkdtempSync(join(tmpdir(), "grill-a-"));
  const out = mkdtempSync(join(tmpdir(), "grill-dl-"));
  mkdirSync(join(out, "sends"));
  writeFileSync(join(out, "sends", "4.json"), JSON.stringify({ actions: [{ q: "q2", type: "defer" }] }));
  assert.equal(ingest(session, out).status, 0);
  assert.deepEqual(lines(session).map((e) => e.seq), [4]);
});
