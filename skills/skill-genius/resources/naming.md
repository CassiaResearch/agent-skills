# Naming conventions

Source: [Naming conventions](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/best-practices#naming-conventions).

## Hard rules

The `name` field in YAML frontmatter must:

- Be at most 64 characters.
- Contain only lowercase letters, numbers, and hyphens. Regex:
  `^[a-z0-9-]{1,64}$`.
- Contain no XML tags.
- Not contain the reserved words `anthropic` or `claude`.

The directory containing SKILL.md must match the `name` field exactly.

## Preferred form: gerund

Use gerund form (verb + `-ing`) to describe the capability the skill
provides:

- `processing-pdfs`
- `analyzing-spreadsheets`
- `managing-databases`
- `testing-code`
- `writing-documentation`

## Acceptable alternatives

- **Noun phrases**: `pdf-processing`, `spreadsheet-analysis`
- **Action-oriented**: `process-pdfs`, `analyze-spreadsheets`

Any of these forms is fine. Pick one form per skill collection and
stick with it for consistency.

## Avoid

- **Vague names**: `helper`, `utils`, `tools`, `documents`, `data`,
  `files`. These lose the selection contest to any more specific
  competing skill.
- **Overly generic**: anything that doesn't indicate what the skill
  actually does.
- **Reserved words**: `anthropic-helper`, `claude-tools`.
- **Inconsistent patterns** within the same repo.

## Why it matters

Consistent, specific naming makes skills easier to:

- Reference in documentation and conversations.
- Understand what a skill does at a glance.
- Organize and search through many skills.
- Surface in the agent's selection — the name is the first signal, the
  description is the second.
