# Writing effective descriptions

## Contents

- Hard rules
- The formula (repo-specific)
- Third person, present tense
- Include both what and when
- Include specific nouns the user will type
- Avoid vague verbs
- Reject (anti-examples)
- Trigger-with clause (repo convention)
- Budget and truncation

## Overview

The `description` field is the primary discovery mechanism. Agents read
each skill's name + description on every turn and decide which to
consult. A vague description loses the contest — a skill with 100+
competitors available.

Source: [Writing effective descriptions](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/best-practices#writing-effective-descriptions).

## Hard rules

- `description` is required and non-empty.
- Maximum 1024 characters.
- No XML tags.
- Must be written in **third person, present tense**.

## The formula (repo-specific)

```
<Third-person verb> <what it does, specific>. <When / scenarios>.
Trigger with "<phrase 1>", "<phrase 2>", "<phrase 3>".
```

## Third person, present tense — non-negotiable

The description is spliced into the agent's system prompt; person
consistency matters.

- ✓ *"Drafts a cold email sequence…"*
- ✓ *"Generates commit messages…"*
- ✓ *"Processes Excel files and creates pivot tables…"*
- ✗ *"Draft a cold email…"* (imperative)
- ✗ *"I draft a cold email…"* (first person)
- ✗ *"You can use this to draft…"* (second person)
- ✗ *"Helps you draft…"* (weak + wrong person)

## Include both what and when

The description must describe:

1. **What** the skill does — specific verbs, specific nouns.
2. **When** to use it — the scenarios, tasks, or contexts it applies in.

Source examples from the best-practices guide:

```yaml
description: Extract text and tables from PDF files, fill forms, merge
  documents. Use when working with PDF files or when the user mentions
  PDFs, forms, or document extraction.
```

```yaml
description: Analyze Excel spreadsheets, create pivot tables, generate
  charts. Use when analyzing Excel files, spreadsheets, tabular data,
  or .xlsx files.
```

```yaml
description: Generate descriptive commit messages by analyzing git
  diffs. Use when the user asks for help writing commit messages or
  reviewing staged changes.
```

## Include specific nouns the user will type

Lexical overlap drives matching. Use the concrete nouns the user types
into the prompt: product names, tool names, artifact names, domain
terms.

- ✓ *"Excel files, .xlsx, pivot tables, spreadsheets"*
- ✓ *"cold email, sequence, prospect, demo"*
- ✗ *"documents"*, *"data"*, *"files"*, *"sales workflow"*

## Avoid vague verbs

Vague verbs lose to more specific competitors. Replace:

- *"Handles X"* → *"Drafts / Generates / Logs / Analyzes X"*
- *"Helps with X"* → *"Extracts / Merges / Transforms X"*
- *"Processes X"* → *"Parses / Validates / Converts X"*
- *"Manages X"* → *"Creates / Updates / Deletes X"*

## Reject

```yaml
description: Helps with documents
description: Processes data
description: Does stuff with files
```

## Trigger-with clause (repo convention)

On top of the Anthropic "what + when" requirement, this repo's
descriptions end with a `Trigger with "…", "…", "…"` clause listing
3-5 natural user phrases in quotes:

```yaml
description: >
  Drafts a warm-intro request message when the user has a mutual
  connection to a prospect. Use for asking a contact to forward an
  intro or identifying a mutual-connection path to a target account.
  Trigger with "ask [contact] for an intro to [company]",
  "draft a referral request", "get me a warm intro to [person]".
```

Bracketed slots (`[company]`, `[person]`) indicate variables. Phrases
should be what a real user would type, not a paraphrase of the
description.

## Budget and truncation

Hard limit is 1024 characters. If the combined description is too long
and truncation might lose the key use case, front-load the critical
information — what + when — before the trigger clause and any
additional scenarios.
