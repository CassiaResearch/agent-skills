#!/usr/bin/env node
// grill-with-ui artifact. Plain Node, no dependencies, no build step.
//
// Why this file exists: the same grill page can be published as a claude.ai Artifact, so it works
// without a local server. In that form the state is the db doc grill/state, which the agent writes
// (ArtifactData); each Send is the db doc sends/<seq>; and a comment sent to Claude wakes the session
// that is watching the artifact, so the agent learns of the send without a Monitor. server.mjs stays
// the local form and this file never changes it.
//
//   build   --session DIR --out DIR     write DIR/index.html (page.html transformed for an Artifact),
//                                       copy DIR/figures/* and DIR/visual.html beside it
//   ingest  --session DIR --sends PATH  append sends read back from the artifact db (ArtifactData's out_dir
//                                       folder, or a file of docs or {id, data} wrappers) to DIR/events.jsonl in
//                                       server.mjs's format; then `server.mjs pending` works unchanged
//
// page.html is read, never written. Every transformation is an exact, counted replacement, so an
// upstream edit to page.html makes `build` fail loudly instead of shipping a silent gap.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
// The same plain-name rule server.mjs applies to /figure/<name>: one file name, never a path.
const FIGURE_NAME = /^[A-Za-z0-9][A-Za-z0-9._-]{0,80}\.(html|svg)$/;

function parseArgs(argv) {
  const o = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) { o._.push(a); continue; }
    const k = a.slice(2), v = argv[i + 1];
    if (v === undefined || v.startsWith("--")) o[k] = true; else { o[k] = v; i++; }
  }
  return o;
}
const print = (obj) => process.stdout.write(JSON.stringify(obj) + "\n");
const die = (msg, code = 2) => { process.stderr.write(`grill: ${msg}\n`); process.exit(code); };
const oneLine = (s) => String(s).replace(/\s+/g, " ").trim();
function mustSession(o) {
  if (!o.session || o.session === true) die("--session <dir> is required");
  const dir = path.resolve(o.session);
  if (!fs.existsSync(dir)) die(`no such session folder: ${dir}`);
  return dir;
}
function esc(s) { return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }

// Exactly one occurrence, or throw. A function replacer, so "$" in the new text is literal.
function replaceOnce(text, from, to, label) {
  const n = text.split(from).length - 1;
  if (n !== 1) throw new Error(`${label}: expected the target text once in page.html, found ${n}`);
  return text.replace(from, () => to);
}

// The highest seq in an events.jsonl, skipping partial or corrupt lines the way server.mjs does.
function lastSeq(file) {
  if (!fs.existsSync(file)) return 0;
  let max = 0;
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    if (!line.trim()) continue;
    try { max = Math.max(max, Number(JSON.parse(line).seq) || 0); } catch { /* partial or corrupt line: skip */ }
  }
  return max;
}

// ---- the page transformations ----

// (b) poll: one db subscription to grill/state, fed through the same logic as the fetch version.
const OLD_POLL = `async function poll() {
  try {
    const r = await fetch("/state", { cache: "no-store" });
    if (!r.ok) throw new Error(String(r.status));
    const text = await r.text();
    lastOk = Date.now();
    if (gone) { gone = false; render(); }
    if (text !== raw) { raw = text; S = JSON.parse(text); onState(); } else tick();
  } catch {
    if (!gone && Date.now() - lastOk > GONE_AFTER_MS) { gone = true; render(); } else tick();
  }
  setTimeout(poll, 1000);
}`;
const NEW_POLL = `// Artifact form: the state is the db doc grill/state, written by the agent. One subscription, never re-subscribed;
// the 1 s tick keeps the timers on the page moving between snapshots.
let sendNote = ""; // a send-line note that renderSend keeps showing until the next send (see renderSend)
async function poll() {
  setInterval(tick, 1000);
  let db = null;
  try { db = (await window.claude?.use("db")) || null; } catch { db = null; }
  if (!db) { if (!gone) { gone = true; render(); } return; } // db not granted to this view: the not-connected state
  db.doc("grill/state").onSnapshot((snap) => {
    try {
      if (!snap.exists) throw new Error("not yet connected");
      const text = JSON.stringify(snap.data());
      lastOk = Date.now();
      if (gone) { gone = false; render(); }
      if (text !== raw) { raw = text; S = JSON.parse(text); onState(); } else tick();
    } catch {
      if (!gone && Date.now() - lastOk > GONE_AFTER_MS) { gone = true; render(); } else tick();
    }
  }, () => { if (!gone) { gone = true; render(); } });
}`;

// (c) post: the send is a db write to sends/<seq>, then the watching session is woken through comments.
const OLD_POST = `async function post(actions) {
  let r, j = {};
  try { r = await fetch("/send", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ actions }) }); j = await r.json().catch(() => ({})); } catch { r = null; }
  if (!j.ok) $("send-why").textContent = "Send failed: " + (j.error || (r && r.status) || "no server");
  return j.ok ? j : null;
}`;
const NEW_POST = `// The send counts once sends/<seq> is written. Waking Claude is a second step that runs behind it: sendToClaude
// needs the viewer's recent gesture, so it is not awaited, and when it cannot happen the page says so.
async function post(actions) {
  sendNote = "";
  let seq;
  try {
    const db = (await window.claude?.use("db")) || null;
    if (!db) throw Object.assign(new Error("no database"), { code: "no database" });
    const seen = [Number(((S && S.agent) || {}).handled) || 0];
    for (const d of (await db.collection("sends").get()).docs) seen.push(Number((d.data() || {}).seq) || Number(d.id) || 0);
    seq = Math.max(...seen) + 1;
    await db.doc("sends/" + seq).set({ type: "send", seq, at: new Date().toISOString(), actions });
  } catch (e) {
    sendNote = "Send failed: " + ((e && e.code) || "no database");
    $("send-why").textContent = sendNote;
    return null;
  }
  wake(seq, actions).then((woke) => {
    if (!woke) { sendNote = "Saved; Claude was not notified, tell it in the terminal."; $("send-why").textContent = sendNote; }
  });
  return { ok: true, seq };
}
// Wakes the session watching this artifact. False when the view cannot do it (no comments capability, not an
// editor, no session, or the gesture has gone stale); the send itself is already saved.
async function wake(seq, actions) {
  try {
    const c = await window.claude?.use("comments");
    if (!c || (await c.canSendToClaude()) !== "available") return false;
    const anchor = await c.anchorFor(document.getElementById("send") || document.body);
    await c.sendToClaude({ anchor, text: "grill send #" + seq + ": " + actions.map((a) => (a.q ? a.q + " " : "") + a.type).join(", ") });
    return true;
  } catch { return false; }
}`;

// renderSend rewrites send-why on every one-second tick, so a note set in post would vanish at once.
// Keeping the note in sendNote lets renderSend show it until the next send. One line changes.
const OLD_SEND_WHY = `$("send-why").textContent = why;`;
const NEW_SEND_WHY = `$("send-why").textContent = why || sendNote;`;

function buildIndex(page, topic) {
  let t = page;
  const cut = (from, label) => { t = replaceOnce(t, from, "", label); };
  // (a) an Artifact is wrapped in its own skeleton, so the page's document tags go.
  cut("<!doctype html>\n", "doctype");
  cut('<html lang="en">\n', "html open");
  cut("<head>\n", "head open");
  cut('<meta charset="utf-8" />\n', "meta charset");
  cut('<meta name="viewport" content="width=device-width, initial-scale=1" />\n', "meta viewport");
  t = replaceOnce(t, "<title>grill</title>", `<title>${esc(topic ? "Grill: " + topic : "Grill")}</title>`, "title");
  cut("</head>\n", "head close");
  cut("<body>\n", "body open");
  cut("</body>\n", "body close");
  cut("</html>\n", "html close");
  // (b), (c)
  t = replaceOnce(t, OLD_POLL, NEW_POLL, "poll");
  t = replaceOnce(t, OLD_POST, NEW_POST, "post");
  t = replaceOnce(t, OLD_SEND_WHY, NEW_SEND_WHY, "send-why");
  // (d) figure and visual URLs become relative to the Artifact's published files.
  t = replaceOnce(t, "`/figure/${m[1]}?v=", "`figures/${m[1]}?v=", "figure url");
  t = replaceOnce(t, "`/visual?v=${encodeURIComponent(v.version)}`", "`visual.html?v=${encodeURIComponent(v.version)}`", "visual url");
  return t;
}

// ---- build ----
function cmdBuild(o) {
  const session = mustSession(o);
  if (!o.out || o.out === true) die("--out <dir> is required");
  const out = path.resolve(o.out);
  const statePath = path.join(session, "state.json");
  let state;
  try { state = JSON.parse(fs.readFileSync(statePath, "utf8")); } catch (e) { die(`cannot read ${statePath}: ${oneLine(e.message)}`); }
  let index;
  try {
    index = buildIndex(fs.readFileSync(path.join(HERE, "page.html"), "utf8"), typeof state.topic === "string" ? state.topic : "");
  } catch (e) { die(`page.html did not transform: ${oneLine(e.message)}`, 1); }
  fs.mkdirSync(out, { recursive: true });
  fs.writeFileSync(path.join(out, "index.html"), index);
  let figures = 0;
  const figDir = path.join(session, "figures");
  if (fs.existsSync(figDir)) {
    for (const name of fs.readdirSync(figDir)) {
      const src = path.join(figDir, name);
      if (!FIGURE_NAME.test(name) || !fs.statSync(src).isFile()) continue;
      fs.mkdirSync(path.join(out, "figures"), { recursive: true });
      fs.copyFileSync(src, path.join(out, "figures", name));
      figures++;
    }
  }
  const visual = path.join(session, "visual.html");
  const hasVisual = fs.existsSync(visual);
  if (hasVisual) fs.copyFileSync(visual, path.join(out, "visual.html"));
  print({ ok: true, out, figures, visual: hasVisual });
}

// ---- ingest ----
// **`--sends` takes what `ArtifactData list` writes with `out_dir`: a folder of one file per
// document (`<out_dir>/sends/<id>.json`)**, either that folder or its parent. A single file holding
// a JSON array of documents, or one document, works too. A document without its own id is named
// by its file, so `sends/4.json` is send 4 even when the document carries no `seq`.
function readSends(target) {
  const parse = (file) => {
    try { return JSON.parse(fs.readFileSync(file, "utf8")); } catch (e) { die(`cannot read the sends file ${file}: ${oneLine(e.message)}`); }
  };
  const named = (file, doc) => (doc && typeof doc === "object" && !Array.isArray(doc) && doc.id === undefined ? { id: path.basename(file, ".json"), data: doc } : doc);
  let stat;
  try { stat = fs.statSync(target); } catch { die(`no such sends file or folder: ${target}`); }
  if (stat.isFile()) { const v = parse(target); return Array.isArray(v) ? v : [named(target, v)]; }
  const dir = fs.existsSync(path.join(target, "sends")) && fs.statSync(path.join(target, "sends")).isDirectory() ? path.join(target, "sends") : target;
  return fs.readdirSync(dir).filter((f) => f.endsWith(".json")).flatMap((f) => {
    const file = path.join(dir, f); const v = parse(file);
    return Array.isArray(v) ? v : [named(file, v)];
  });
}
// Each send doc becomes one events.jsonl line in server.mjs's exact shape. Only seqs past the highest
// one already on disk are appended, so running ingest twice on the same read-back appends nothing.
function cmdIngest(o) {
  const session = mustSession(o);
  if (!o.sends || o.sends === true) die("--sends <file or folder> is required");
  const docs = readSends(path.resolve(o.sends));
  const events = path.join(session, "events.jsonl");
  const have = lastSeq(events);
  const bySeq = new Map();
  for (const item of docs) {
    const d = item && typeof item === "object" && item.data && typeof item.data === "object" ? item.data : item;
    if (!d || typeof d !== "object") continue;
    const seq = Number(d.seq) || Number(String((item && item.id) ?? "").split("/").pop()) || 0;
    if (!(seq > have)) continue;
    if (!Array.isArray(d.actions) || d.actions.length === 0) { process.stderr.write(`grill: skipped send ${seq}: no actions\n`); continue; }
    if (!bySeq.has(seq)) bySeq.set(seq, { seq, at: typeof d.at === "string" ? d.at : new Date().toISOString(), actions: d.actions });
  }
  const rows = [...bySeq.values()].sort((a, b) => a.seq - b.seq);
  if (rows.length) {
    // A last line cut short by a crash has no newline; start a fresh line rather than fuse two events.
    const text = fs.existsSync(events) ? fs.readFileSync(events, "utf8") : "";
    const lead = text.length && !text.endsWith("\n") ? "\n" : "";
    fs.appendFileSync(events, lead + rows.map((r) => JSON.stringify({ type: "send", seq: r.seq, at: r.at, session, actions: r.actions }) + "\n").join(""));
  }
  print({ ok: true, appended: rows.length, last: Math.max(have, ...rows.map((r) => r.seq)) });
}

const o = parseArgs(process.argv.slice(2));
const cmds = { build: cmdBuild, ingest: cmdIngest };
// own keys only: `toString` and friends are inherited, not subcommands
(Object.hasOwn(cmds, o._[0] ?? "") ? cmds[o._[0]]
  : () => die("usage: artifact.mjs build --session DIR --out DIR | ingest --session DIR --sends FILE|DIR"))(o);
