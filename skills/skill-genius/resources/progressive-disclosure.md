# Progressive disclosure patterns

## Contents

- Three loading tiers
- Token budgets
- Three organization patterns (high-level-with-refs, domain-specific, conditional)
- When NOT to split
- Avoid deeply nested references
- Table of contents for long references
- Descriptive filenames

## Sources

- [Progressive disclosure patterns](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/best-practices#progressive-disclosure-patterns)
- [Avoid deeply nested references](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/best-practices#avoid-deeply-nested-references)
- [Structure longer reference files with table of contents](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/best-practices#structure-longer-reference-files-with-table-of-contents)

## Three loading tiers

1. **Metadata** — name + description. Always in context across all
   skills.
2. **SKILL.md body** — loaded when the skill triggers. Budget: ≤500
   lines.
3. **`references/*.md`** — loaded only when the agent reads them.
   Effectively unlimited; TOC required for files over 100 lines.

## Token budgets

- SKILL.md body under 500 lines. Split if you're approaching this.
- Reference files: no cap, but structure them so the agent can scan
  before deciding to read.

## Three organization patterns

Pick one by skill shape.

### Pattern 1 — High-level guide with references

Main SKILL.md is a workflow skeleton; deep detail lives in references
that the agent reads only when the relevant phase fires. Best when the
workflow is linear but has heavy appendices.

```
skill-name/
├── SKILL.md           # workflow skeleton
└── references/
    ├── domain_rules.md
    ├── output_template.md
    └── examples.md
```

### Pattern 2 — Domain-specific organization

Main SKILL.md selects the branch; per-domain reference holds that
branch's specifics. Best when the skill spans variants (multi-cloud,
multi-CRM, multi-language).

```
cloud-deploy/
├── SKILL.md           # workflow + selection logic
└── references/
    ├── aws.md
    ├── gcp.md
    └── azure.md
```

Agent reads only the reference file for the branch it's on.

### Pattern 3 — Conditional details

Main SKILL.md is universal; specific sub-workflows load only when
invoked. Best when most of the skill is shared but some operations
need deep detail.

```
skill-name/
├── SKILL.md           # universal flow
└── references/
    ├── setup.md       # read only on first-time setup
    ├── advanced.md    # read only when advanced path triggers
    └── troubleshoot.md  # read only on error
```

## Don't split if you don't need to

If the skill is short and has no deep material, keep a flat SKILL.md.
References for the sake of references adds cognitive overhead.

## Avoid deeply nested references

References may be nested **one level only**. Not deeper.

- ✓ `skill-name/references/guide.md`
- ✗ `skill-name/references/domain/guide.md`

Depth breaks the agent's ability to reason about where to look.

## Table of contents for long references

Reference files longer than 100 lines need a TOC at the top so the
agent sees the full scope when it reads a partial preview.

Example:

```markdown
# API Reference

## Contents

- Authentication and setup
- Core methods (create, read, update, delete)
- Error handling
- Rate limits

## Authentication and setup
...
```

## Descriptive filenames

Reference filenames must indicate content.

- ✓ `form_validation_rules.md`, `aws.md`, `cold-call-framework.md`
- ✗ `doc1.md`, `notes.md`, `misc.md`, `appendix.md`

Claude navigates the skill directory like a filesystem; name hygiene
helps the agent pick the right file.
