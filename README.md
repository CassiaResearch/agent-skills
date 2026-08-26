# agent-skills

Open-source [Agent Skills](https://docs.claude.com/en/docs/agents-and-tools/agent-skills) from [Cassia Research](https://github.com/CassiaResearch), publishable via [skills.sh](https://www.skills.sh).

## Install

```bash
npx skills add CassiaResearch/agent-skills
```

Pick specific skills:

```bash
npx skills add CassiaResearch/agent-skills --skill skill-genius --agent claude-code
```

Works with Claude Code, Cursor, Codex, Goose, OpenCode, and other agents supported by the [skills CLI](https://github.com/vercel-labs/skills).

## Skills

| Skill | Purpose |
|---|---|
| [`skill-genius`](skills/skill-genius/) | End-to-end skill authoring: create, update, fix, refactor, rename, split, retire skills against Anthropic best-practices |
| [`agents-md-management`](skills/agents-md-management/) | Full lifecycle of AGENTS.md files — create from project-type templates, audit against an 8-point quality rubric, revise with session learnings. AGENTS.md is canonical; CLAUDE.md gets a one-line `@AGENTS.md` pointer |

## Repo layout

Each skill is a self-contained directory under `skills/`:

```
skills/<name>/SKILL.md
skills/<name>/references/   # optional supporting docs, loaded on demand
```

## Developing in this repo

`.agents/skills/` is the main location for agent-facing skills in this repo; `.claude/skills/` chains to it for Claude Code. Each entry is a symlink to the source in `skills/`, so edits are live immediately:

```bash
# .agents/skills/<name> -> skills/<name>            (primary)
# .claude/skills/<name> -> .agents/skills/<name>    (Claude Code shim)
```

To enable a new skill locally:

```bash
ln -s ../../skills/<name> .agents/skills/<name>
ln -s ../../.agents/skills/<name> .claude/skills/<name>
```

`skill-genius` is itself the authoring tool for this repo — use it to create and improve skills here.

## License

MIT
