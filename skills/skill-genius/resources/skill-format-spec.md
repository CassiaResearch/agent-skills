# Agent Skills format spec

The format spec for every skill in this repo.

Source: https://agentskills.io/specification.

## Contents

- Directory structure
- SKILL.md format (YAML frontmatter + markdown body)
- Frontmatter fields (6 total — 2 required, 4 optional)
- Optional directories (scripts/, references/, assets/)
- Progressive disclosure
- File references
- Validation

## Directory structure

A skill is a directory containing, at minimum, a `SKILL.md` file:

```
skill-name/
├── SKILL.md          # Required: metadata + instructions
├── scripts/          # Optional: executable code
├── references/       # Optional: documentation
├── assets/           # Optional: templates, resources
└── ...               # Any additional files or directories
```

The directory name must match the `name` field in frontmatter.

## SKILL.md format

Every `SKILL.md` has YAML frontmatter followed by Markdown body content.

```markdown
---
name: skill-name
description: A description of what this skill does and when to use it.
---

# Skill title

## When to use
...

## Steps
...
```

## Frontmatter fields

Two required fields (`name`, `description`) and four optional fields
(`license`, `compatibility`, `metadata`, `allowed-tools`).

| Field           | Required | Constraints |
|-----------------|----------|-------------|
| `name`          | Yes      | Max 64 chars. Lowercase letters, digits, hyphens. No leading / trailing hyphen. No consecutive hyphens. Must match parent directory. |
| `description`   | Yes      | Max 1024 chars. Non-empty. Describes what + when. |
| `license`       | No       | License name or reference to a bundled license file. |
| `compatibility` | No       | Max 500 chars. Environment requirements. |
| `metadata`      | No       | String→string map for arbitrary properties. |
| `allowed-tools` | No       | Space-separated pre-approved tools. (Experimental.) |

### `name` — required

- 1-64 characters.
- Lowercase alphanumeric (`a-z`, `0-9`) and hyphens (`-`) only.
- Must not start or end with a hyphen.
- Must not contain consecutive hyphens (`--`).
- Must match the parent directory name exactly.

**Valid**: `pdf-processing`, `data-analysis`, `code-review`.

**Invalid**: `PDF-Processing` (uppercase), `-pdf` (leading hyphen),
`pdf--processing` (consecutive hyphens).

See `naming.md` for naming conventions (preferred form, what to avoid).

### `description` — required

- 1-1024 characters.
- Non-empty.
- Describes what the skill does and when to use it.
- Includes specific keywords that help agents identify relevant tasks.

See `writing-descriptions.md` for how to write a description that
agents actually select.

### `license` — optional

- A short string naming the license, or a reference to a bundled
  license file.
- Not used by most skills in this repo.

```yaml
license: Proprietary. LICENSE.txt has complete terms
```

### `compatibility` — optional

- Max 500 characters.
- Declares environment requirements: intended product, required
  system packages, network access, runtime versions.
- Most skills do not need this field.

```yaml
compatibility: Designed for Claude Code (or similar products)
```

```yaml
compatibility: Requires git, docker, jq, and access to the internet
```

```yaml
compatibility: Requires Python 3.14+ and uv
```

Use this when the skill genuinely depends on specific tooling and
failure modes would be confusing otherwise. If a skill runs
anywhere — don't add it.

### `metadata` — optional

- A map from string keys to string values.
- For any additional properties not defined by the Agent Skills spec.
- Namespace keys to avoid conflicts across skill sources.

```yaml
metadata:
  author: example-org
  version: "1.0"
```

### `allowed-tools` — optional (experimental)

- A space-separated string of pre-approved tools the skill may use.
- Experimental — support varies across agent runtimes.

```yaml
allowed-tools: Bash(git:*) Bash(jq:*) Read
```

If you add this field, test it in the target runtime before relying on
it.

### Body content

After the frontmatter, the Markdown body contains skill instructions.
The spec imposes no format restrictions — write whatever helps agents
perform the task.

Recommended sections:

- Step-by-step instructions
- Examples of inputs and outputs
- Common edge cases

Agents load the entire body when the skill activates. See
`progressive-disclosure.md` for the 500-line soft cap and splitting
patterns, and `workflows-and-feedback-loops.md` for multi-step workflow
structure.

## Optional directories

### `scripts/`

Executable code agents can run. Common languages: Python, Bash,
JavaScript — support depends on the runtime. Scripts should be
self-contained or clearly declare dependencies, include helpful error
messages, and handle edge cases gracefully.

See `code-bearing-skills.md` for the full patterns (solve-don't-punt,
bundle utilities, make execution intent clear, declare dependencies).

### `references/`

Additional documentation agents read on demand. Common shapes:

- `REFERENCE.md` — detailed technical reference
- `FORMS.md` — form templates or structured data formats
- Domain-specific files (`finance.md`, `legal.md`, etc.)

Keep individual files focused and reasonably small — smaller files
mean less context used when the agent reads them.

See `progressive-disclosure.md` for organization patterns and the
one-level-deep nesting rule.

### `assets/`

Static resources:

- Templates (document, configuration)
- Images (diagrams, examples)
- Data files (lookup tables, schemas)

No format restriction. Agents load these as needed.

## Progressive disclosure

Agents load skills progressively, pulling in more detail as the task
calls for it:

1. **Metadata** (~100 tokens): `name` and `description` are
   pre-loaded at startup for every available skill.
2. **Instructions** (< 5000 tokens recommended): the full `SKILL.md`
   body loads when the skill activates.
3. **Resources** (as needed): files under `scripts/`, `references/`,
   or `assets/` load only when the agent reads or runs them.

Keep `SKILL.md` under 500 lines. Move detailed reference material to
separate files.

See `progressive-disclosure.md` for the three organization patterns
(high-level + refs, domain-specific, conditional details).

## File references

When the skill body references other files, use relative paths from
the skill root:

```markdown
See [the reference guide](references/REFERENCE.md) for details.

Run the extraction script:
scripts/extract.py
```

Keep references one level deep. Avoid deeply nested reference chains.

## Validation

Run the skill-genius self-review loop against the skill before committing.
It checks frontmatter, structure, body style, tool references, and the README
skills table.
