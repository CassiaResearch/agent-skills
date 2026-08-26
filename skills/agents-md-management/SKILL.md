---
name: agents-md-management
description: >
  Manages the full lifecycle of AGENTS.md files — create, generate,
  audit, revise, and update. Creates AGENTS.md files from project-type
  templates, audits existing files against an 8-point quality rubric,
  and captures session learnings into the most specific file. Use for
  any AGENTS.md or CLAUDE.md context-file verb. Trigger with
  "create/generate an AGENTS.md", "audit AGENTS.md files", "improve
  our AGENTS.md", "capture what we learned into AGENTS.md",
  "manage agents.md files".
license: MIT
metadata:
  author: azogheb
  version: "2.0.0"
---

# AGENTS.md Management

Manage AGENTS.md files across their full lifecycle: **create** from
project-type templates, **audit** against the 8-point quality rubric,
and **revise** with session learnings. One skill, three modes.

AGENTS.md is an open standard for providing AI agents with
project-specific context: commands and workflows, architecture,
non-obvious patterns and gotchas, dos and don'ts.

## File policy — AGENTS.md canonical, CLAUDE.md as pointer

AGENTS.md is the canonical context file. Claude Code reads CLAUDE.md
instead — bridge the two with a one-line import:

- **On create**: after writing AGENTS.md, ensure CLAUDE.md exists and
  contains exactly one line: `@AGENTS.md`. If CLAUDE.md already has
  content, ask before replacing it.
- **On CLAUDE.md-only repos**: if a CLAUDE.md with content exists but
  no AGENTS.md, suggest migrating — move the content into AGENTS.md
  and reduce CLAUDE.md to the `@AGENTS.md` pointer.
- Never maintain substantive context in both files; they drift.

## Mode dispatch

An explicit verb wins:

| User says | Mode |
|---|---|
| create / generate / write / add an AGENTS.md | Create |
| audit / review / score / improve AGENTS.md | Audit |
| revise / capture learnings / record what we learned | Revise |

No verb → auto-detect from repo state:

1. Discover what exists: `find . -name AGENTS.md -o -name CLAUDE.md`
   (skip node_modules and other dependency dirs).
2. No AGENTS.md in scope → **Create**.
3. AGENTS.md files exist → **Audit** (default).
4. Session signals captured learnings (end of session, "what did we
   learn", a fix that cost debugging time) → **Revise**.
5. Still ambiguous → ask the user which mode.

## Create mode

1. **Determine target** — no path given: offer choices (repo root,
   package/app dirs). Path given: validate it.
2. **Detect project type** from the target directory:

   | Indicator | Type |
   |---|---|
   | Root of monorepo (workspaces / apps / packages) | Monorepo root |
   | `next` in package.json | Next.js app |
   | `@langchain/langgraph` in deps | LangGraph agent |
   | `prisma` in deps | Database package |
   | `components.json` present | UI package (shadcn) |
   | Exports Zod schemas | Contracts package |
   | Default | Generic package |

3. **Existing file?** Read it and propose updates for codebase drift
   instead of regenerating from scratch.
4. **Gather context** — package.json scripts, dependencies, name;
   directory structure; parent/sibling AGENTS.md files; env schema
   (`env.schema.ts` or `env/` folder).
5. **Generate** from the matching template in
   [references/templates.md](references/templates.md) — fill in real
   commands, real directory structure, actual dependencies and
   versions, references to parent/sibling files.
6. **Preview and confirm** — show the content; write only after
   approval.
7. **Write** AGENTS.md, then apply the file policy (CLAUDE.md pointer).

## Audit mode

1. **Discover** all AGENTS.md files in scope (or audit just the given
   path).
2. **Assess** each against the 8-point rubric in
   [references/quality-criteria.md](references/quality-criteria.md)
   (commands, architecture clarity, non-obvious patterns, conciseness,
   currency, actionability, dos/don'ts, progressive disclosure).
3. **Output the quality report first** — scores and gaps per file.
   Never skip straight to edits.
4. **Propose targeted improvements** per
   [references/update-guidelines.md](references/update-guidelines.md).
5. **Apply with approval** — show diffs, get confirmation, then edit.

## Revise mode

1. **Reflect** on the session: commands discovered or used, gotchas
   encountered (debugging sessions, failed attempts), non-obvious code
   patterns, config quirks, testing approaches that worked,
   architecture knowledge gained.
2. **Find** the files: `find . -name AGENTS.md | head -20`.
3. **Categorize** each learning:

   | Aspect | Options |
   |---|---|
   | Type | command, gotcha, pattern, config, testing, architecture |
   | Scope | root (repo-wide) vs specific package/app |
   | Target | the most specific file that fits |

4. **Draft additions** — one line per concept, format
   `<command or pattern>` - `<brief description>`, per
   [references/update-guidelines.md](references/update-guidelines.md).
5. **Show proposed changes** — per file: the addition, its type, and a
   one-line why.
6. **Apply with approval** — only edit files the user approves.

Validate each addition before proposing: project-specific (not generic
advice), would help a new session avoid the same issue, one line where
possible, placed at the most specific appropriate level.

## Key principles

- **Conciseness** — every line earns its place; agent context is
  precious.
- **Project-specific** — no generic advice; only what's unique here.
- **Actionable** — commands copy-paste ready.
- **Current** — keep files aligned with the codebase as it evolves.
- **Approval-based** — always show changes and get approval before
  editing.
- **Progressive disclosure** — root AGENTS.md carries repo-wide
  patterns and links to nested files; nested files carry
  module-specific context and reference the parent. No duplication.

## References

| Document | Use |
|---|---|
| [references/templates.md](references/templates.md) | Create — project-type templates |
| [references/quality-criteria.md](references/quality-criteria.md) | Audit — 8-point quality rubric |
| [references/update-guidelines.md](references/update-guidelines.md) | Audit & revise — what to add, what to avoid |
