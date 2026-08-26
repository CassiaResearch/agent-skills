---
name: skill-genius
description: >
  Creates, updates, and fixes Agent Skills end-to-end: drafts new skills
  from a short interview, improves existing ones against Anthropic
  best-practices, refactors skills that drift, reformats long step lists
  into workflow-checklist form, and retires skills that are no longer
  needed. Use for any skill-authoring verb — create / draft / write /
  add / update / improve / fix / refactor / rename / split / retire —
  on any skill in the project. Trigger with "create a skill for [task]",
  "write a new skill for [scenario]", "improve [skill-name]",
  "fix [skill-name]", "refactor [skill-name]", "retire [skill-name]".
license: MIT
metadata:
  author: azogheb
  version: "1.0.0"
---

# Skill Genius

This is the default tool for every verb in the skill-authoring
lifecycle: create, update, fix, refactor, split, rename, retire. If
the user wants anything done to a skill, start here.

After every authoring action, run the self-review loop against the
result and apply fixes per the proactivity rule — see "Self-review and
fix loop" below.

The Anthropic best-practices guide is the golden source —
https://docs.claude.com/en/docs/agents-and-tools/agent-skills/best-practices.
It's been organized into `resources/` in this skill, section by section,
so you read only the file relevant to the decision you're making. Do not
invent rules that aren't in that guide.

Existing skills were authored at different times and should not be
treated as exemplars. They are targets to audit and improve, not
templates to copy.

## Skill layout

A skill is a self-contained directory:

```
<name>/SKILL.md
<name>/references/   # optional, loaded on demand
<name>/scripts/      # optional, executable helpers
```

Where skill directories live depends on the host project: a repo-root
`skills/` folder, `.agents/skills/`, `.claude/skills/`, a plugin's
skills directory, or elsewhere. Don't assume — locate skills before
reading them:

```bash
find . -name SKILL.md -not -path '*/node_modules/*' | head -20
```

Related skills sharing one integration surface may sit inside a group
directory one level down (`<group>/<name>/`). The group layer is
organizational; naming, discovery, and review rules apply identically.
Keep nesting to one level — many skill loaders only expand one
directory level.

A skill lives in exactly one directory. When creating a new one, put it
in the same location as the project's existing skills (or ask, if it's
the first).

## Communicating with the user

Contributors range widely in technical background. Some are engineers;
many are domain experts who want to teach an agent to do their job
better.

Match your language to theirs:

- Words like "skill", "description", "trigger", "workflow" are safe.
- Words like "frontmatter", "YAML", "MCP", "progressive disclosure",
  "eval" need context cues before you use them plain — if the user
  hasn't said them first, briefly explain or rephrase.
- Do not dump the Anthropic best-practices doc at the user. Apply it.
  Only name a pattern when explaining *why* you're making a change.

Use **AskUserQuestion** for any real decision point, not text bullet
lists. One prompt, 2-4 concrete options, one of which is labeled
recommended when you have a view. Don't interrogate — if you can answer
a question by reading a file, read the file.

## Proactivity — when to just do it, when to ask

Fix anything the author implicitly asked for, without asking, **except**
the actions below. For those, always use `AskUserQuestion`.

Just do it (silent):

- Frontmatter format fixes: wrong person, missing trigger clause, tense,
  character-limit trims, YAML indent.
- Reformatting a step-by-step list into the "Use workflows for complex
  tasks" structure (see `resources/workflows-and-feedback-loops.md`).
  This is a presentation change; content stays the same.
- Adding a row to the repo README's skills table after creating a
  skill (if the repo keeps one).
- Adding fenced-code templates when the skill produces structured output
  and the shape was described only in prose.
- Typo, grammar, imperative-voice fixes in the body.
- Moving long content (>500 line SKILL.md) into `references/*.md`.

Ask first (AskUserQuestion):

- Splitting a skill into multiple skills.
- Renaming a skill (directory + `name` frontmatter).
- Changing trigger phrases in the description (discovery impact).
- Substantive content changes — adding or removing rules, scenarios, or
  workflow steps the author didn't mention.
- Deleting or retiring a skill.

The principle: mechanical and structural reformatting is safe to do
silently because runtime behavior doesn't change. Discovery and content
changes do change runtime behavior and deserve an explicit "yes".

## Lifecycle verbs

The agent invokes one of these when the user's request is clear. If the
verb is ambiguous ask which verb with AskUserQuestion.

### Create

For a net-new skill.

1. **Ground yourself in the format.** Read
   `resources/skill-format-spec.md` — the authoritative spec for what a
   valid skill *is* (directory layout, frontmatter fields, file
   references). Everything else in this lifecycle sits on top of it.
2. **Interview briefly** (AskUserQuestion, not chat-in-text):
   - What task should the skill do? (one sentence)
   - When should the agent trigger it? (what phrases / scenarios)
   - Does it produce structured output? (Y/N — drives template pattern)
   - Any scripts/code involved? (Y/N — drives code-bearing-skills guide)
3. **Pick a name**. Read `resources/naming.md`. Prefer gerund form.
   The skill's directory will be `<name>/` (or `<group>/<name>/` inside
   an existing group), placed with the project's other skills.
4. **Draft the description**. Read `resources/writing-descriptions.md`.
   Third person, present tense, specific nouns, `Trigger with "…", "…",
   "…"` clause.
5. **Pick the skill shape**. Read `resources/progressive-disclosure.md`.
   Flat SKILL.md if short; SKILL.md + `references/` if long.
6. **Pick the degree of freedom** for the workflow body. Read
   `resources/degrees-of-freedom.md`. High for judgment, medium for
   shaped output, low for fragile operations.
7. **Write the body**. Imperative directives to the agent. Use fenced
   templates for structured output (`resources/common-patterns.md`).
   If 6+ sequential steps, open with a copyable progress checklist
   (`resources/workflows-and-feedback-loops.md`). If the skill touches a
   connectable tool category (calendar, chat, email, docs, CRM, …),
   read `resources/connectors.md` before naming products.
8. **Update the repo README** — add a skills-table row (name, purpose,
   triggers) if the repo keeps one.
9. **Run the self-review-and-fix loop** (see below), then report
   results to the user.

### Update / Improve

The user wants an existing skill to work better.

1. **Locate the skill** — search for `<name>/SKILL.md` (see Skill
   layout). Read its SKILL.md + any `references/`. Understand what's
   there before changing it.
2. **Ask** (AskUserQuestion) what specifically is wrong, unless the
   user already told you.
3. **Apply the proactivity rule** — fix mechanical issues silently;
   ask before discovery / content changes.
4. **For each issue, read the relevant resource file** before applying
   the fix. Examples:
   - Description underperforming → `resources/writing-descriptions.md`
   - Long procedural body → `resources/workflows-and-feedback-loops.md`
   - Inconsistent terminology → `resources/content-guidelines.md`
   - Hard-coded product name where a connector category fits →
     `resources/connectors.md`
   - Drift from best-practices → `resources/core-principles.md` +
     `resources/anti-patterns.md`
5. **Keep the change surface minimal** — don't rewrite sections the
   user didn't ask about.
6. **Run the self-review-and-fix loop** (see below), then report
   results.

### Fix

Same mechanics as Update, triggered by a review finding or a failing
test.

1. **Map the finding to the resource file** that explains the pattern
   (e.g., a description problem maps to
   `resources/writing-descriptions.md`).
2. **Apply the fix**. Most fixes are mechanical and fit the "just do
   it" bucket.
3. **Run the self-review-and-fix loop** (see below) to confirm the fix
   landed and didn't introduce a new finding.

### Refactor

The skill works but is hard to read, long, or doesn't match the
patterns it should.

1. **Read `resources/progressive-disclosure.md`** — decide if splitting
   into `references/` helps.
2. **Read `resources/workflows-and-feedback-loops.md`** — check if a
   progress checklist would improve a long numbered list.
3. **Read `resources/common-patterns.md`** — spot missed template /
   examples / conditional-workflow opportunities.
4. **Reformat without changing semantics**. If semantic changes are
   needed, use AskUserQuestion first.
5. **Run the self-review-and-fix loop** (see below), then report
   results.

### Split / Rename / Retire

Always use AskUserQuestion before acting — these change discovery.

- **Split**: confirm the new skill boundaries (verb-by-verb, as in
  `resources/core-principles.md` — "one skill, one job"). Update both
  directories, frontmatters, README tables, and any cross-references.
- **Rename**: confirm the new name matches `resources/naming.md`
  conventions. Rename directory, update `name` frontmatter to match,
  update the README table, update any skill that references the old
  name.
- **Retire**: confirm deletion intent. Remove the skill directory and
  its README row.

After any of these, run the self-review-and-fix loop on whatever
skill(s) actually changed in the working tree.

## Self-review and fix loop

Run this at the end of every lifecycle verb.

### The loop

1. **Load the checklist** — read `resources/anti-patterns.md`, plus
   `resources/skill-format-spec.md` if any format question came up, if
   they aren't already in context this session.
2. **Apply each check** to the skill(s) that just changed. Also verify
   the README skills-table row matches (added / edited / removed) if
   the repo keeps one.
3. **Classify each finding** by the proactivity rule above:
   - **Mechanical (fits "just do it")** → fix silently, immediately.
     Examples: wrong frontmatter person, missing trigger clause,
     over-cap description, Windows paths, missing output template.
   - **Discovery-impacting** → AskUserQuestion before applying.
     Examples: a rename, trigger-phrase rewrites.
   - **NIT** → note in the final summary, don't block.
4. **Re-apply the checks** after fixes. Repeat. Cap at 3 cycles total.
5. **Final report** to the user — one line:
   `Done. <N> blockers / <M> issues / <K> nits.`
   If there are residual blockers or issues after 3 cycles, list them
   and stop, asking the user how to proceed.

### What's mechanical vs. what needs asking

A finding is mechanical when the fix is local, deterministic, and
doesn't change the skill's discovery surface or workflow content.
Otherwise, ask. The proactivity rule earlier in this file is the
authoritative table.

### Skills outside the changed set

Don't widen scope. If the user updated one skill, the loop checks that
skill only. Cleaning up existing skills is its own deliberate
authoring action (`improve <skill>`), not a side effect.

## After authoring — always

Every authoring session ends with:

1. **Confirm the self-review-and-fix loop converged** — one-line
   report (e.g., *"Done. 0 blockers / 0 issues / 1 nit"*).
2. **Confirm the README skills-table row** reflects the change, if the
   repo keeps one.
3. **Offer a three-part test plan** — either on a live agent now (if
   one is running with the skill loaded) or manually:
   - Trigger test (a phrase from the trigger clause invokes the skill)
   - Walk-through test (agent's explanation matches the body)
   - Over-trigger test (near-miss phrase does NOT invoke)

## Resource map

Read resources on demand. Don't pre-load them. The `resources/` folder
holds the Agent Skills spec and the Anthropic best-practices guide,
reorganized for on-demand reading:

| Resource | When to read |
|---|---|
| `resources/skill-format-spec.md` | Any format question — directory layout, the frontmatter fields (incl. optional `license` / `compatibility` / `metadata` / `allowed-tools`), file references. Ground yourself here before creating; consult on audits and when adding optional frontmatter |
| `resources/core-principles.md` | "Should this content be in the skill?" or "is this one skill or two?" — concise-is-key and one-skill-one-job decisions |
| `resources/naming.md` | Picking or changing a skill's name |
| `resources/writing-descriptions.md` | Writing or fixing the `description` field — the primary discovery mechanism |
| `resources/degrees-of-freedom.md` | "How prescriptive should this be?" — prose for judgment tasks, templates for shaped output, exact commands for fragile operations |
| `resources/progressive-disclosure.md` | Deciding skill shape (flat vs. SKILL.md + `references/`); splitting an over-long body (>500 lines) |
| `resources/workflows-and-feedback-loops.md` | Writing a multi-step workflow (6+ steps), or an output that's quality-critical and needs a validator → fix → repeat loop |
| `resources/common-patterns.md` | Choosing an output pattern — strict template, worked input / output examples, or branch-once conditional workflow |
| `resources/content-guidelines.md` | Caught time-sensitive info (dates, prices, versions) or mixed terminology (`prospect` vs `lead`) |
| `resources/anti-patterns.md` | Auditing for smells — Windows paths, too-many-options menus, over-explanation of concepts the agent already knows |
| `resources/code-bearing-skills.md` | Skill has or will have a `scripts/` directory, or references executable code |
| `resources/evaluation-and-iteration.md` | After drafting to plan testing; after a test fails to diagnose and iterate |
| `resources/connectors.md` | A skill mentions a connectable tool (calendar, chat, email, docs, CRM, sales engagement) — when to abstract behind a placeholder vs. keep the connector concrete |

## Language — agents not Claude

Write SKILL.md bodies and descriptions in agent-generic language. Say
"the agent", not "Claude". Skills get installed into many agent
runtimes (Claude Code, Cursor, Goose, OpenCode, …), and
product-specific language breaks portability.

Keep product references when they're genuinely product-specific —
"Claude Code Desktop" when naming the tool, "Anthropic best-practices
guide" when citing the source. Otherwise: agent.

## Do not

- Treat existing skills as exemplars. Audit them against the
  best-practices guide; don't copy their patterns.
- Dump the best-practices doc at the user. Apply it.
- Use text bullet lists to ask questions. Use AskUserQuestion.
- Skip the self-review-and-fix loop at the end of an authoring session.
- Edit a skill without updating the README skills table (if the repo
  keeps one).
- Make splits, renames, or substantive content changes without
  explicit user confirmation via AskUserQuestion.
