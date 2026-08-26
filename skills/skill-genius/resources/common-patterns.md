# Common patterns

## Contents

- Template pattern (strict output shape)
- Examples pattern (input → output pairs)
- Conditional workflow pattern (branch once, not a tree)

## Overview

Three patterns solve ~80% of skill-authoring decisions. Reach for one.

Source: [Common patterns](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/best-practices#common-patterns).

## Template pattern (strict output shape)

For outputs with a fixed shape, provide a literal fenced code block.
Template-pattern beats prose-description for reproducibility.

### Strict template — when shape is non-negotiable

````markdown
## Report structure

ALWAYS use this exact template structure:

```markdown
# [Analysis Title]

## Executive summary
[One-paragraph overview of key findings]

## Key findings
- Finding 1 with supporting data
- Finding 2 with supporting data
- Finding 3 with supporting data

## Recommendations
1. Specific actionable recommendation
2. Specific actionable recommendation
```
````

Use `ALWAYS` only when the shape is genuinely non-negotiable.

### Flexible template — when adaptation helps

When adaptation is useful, drop the `ALWAYS` and call the template a
default:

````markdown
## Report structure (default)

Use this template as a starting point, adapt as needed:

```markdown
# [Analysis Title]

## Executive summary
...
```
````

## Examples pattern (input → output pairs)

For style-quality skills — where tone, voice, or format matters — show
worked input → output pairs. These constrain style better than
adjectives like "be professional".

### Example — commit messages

```markdown
## Commit message format

**Example 1:**
Input: Added user authentication with JWT tokens
Output: feat(auth): implement JWT-based authentication

**Example 2:**
Input: Fixed bug in payment processing
Output: fix(payments): resolve transaction validation error

**Example 3:**
Input: Updated README with installation instructions
Output: docs(readme): add installation and setup guide
```

### Guidance

- Include 2-4 pairs spanning the style space (formal ↔ casual,
  short ↔ long, positive ↔ objection).
- Use only when the output's *style* is what quality hinges on. Don't
  force examples onto deterministic outputs.
- Realistic inputs beat simplified ones; the agent learns better from
  inputs that look like what it will see.

## Conditional workflow pattern (branch once, not a tree)

Skills often have one early decision that shapes the whole workflow.
Branch on that decision explicitly; don't let the agent re-deliberate
at every step.

### Shape

```markdown
## Flow

Decide the branch once, up-front:

- **Branch A** — <condition>: <linear steps for A>
- **Branch B** — <condition>: <linear steps for B>
- **Branch C** — <condition>: <linear steps for C>
```

### Example — document modification

```markdown
## Document modification workflow

Decide once based on the change type:

- **Small edit** (typo, phrasing, <5 lines): apply directly, no diff
  preview.
- **Structural change** (new section, reordering, >5 lines): generate
  a diff, ask for confirmation, then apply.
- **Semantic change** (meaning, recommendations): generate a draft,
  ask for confirmation, then apply.
```

Each branch is linear from there. Avoid nested decisions inside a
branch — complexity compounds and the agent gets lost.
