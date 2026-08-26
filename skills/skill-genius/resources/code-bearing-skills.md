# Skills that ship code

## Contents

- Solve, don't punt
- Provide utility scripts
- Use visual analysis when it helps
- Create verifiable intermediate outputs
- Package dependencies
- Runtime environment
- MCP tool references
- Avoid assuming tools are installed
- Make execution intent unambiguous
- No voodoo constants

## Overview

Most skills don't need executable code. When a skill does — under
`scripts/` — apply everything in this file in addition to the general
best-practices.

Source: [Advanced: Skills with executable code](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/best-practices#advanced-skills-with-executable-code).

## Solve, don't punt

Scripts must handle errors explicitly. Do not `raise` or `exit 1` and
rely on the agent to retry with different inputs — the agent will burn
turns guessing what went wrong. Either succeed, or fail with a message
that tells the agent exactly what to do next.

### Bad — punts to the agent

```python
response = api.post(payload)
response.raise_for_status()   # throws; agent now guesses why
```

### Good — solves

```python
response = api.post(payload)
if response.status_code == 401:
    print("ERROR: API key missing or invalid. Set the expected env "
          "var and retry. (Got 401 from the server.)", file=sys.stderr)
    sys.exit(2)
if response.status_code == 422:
    print(f"ERROR: Server rejected the payload — "
          f"{response.json().get('detail')}. Check required fields "
          f"and retry.", file=sys.stderr)
    sys.exit(2)
response.raise_for_status()
```

Print actionable error messages. Use distinct exit codes for distinct
failure modes when the caller can meaningfully branch on them.

## Provide utility scripts

If a script pattern would repeat 3+ times across skill invocations,
bundle a canonical script in `scripts/` and point the skill at it.

- One `scripts/build_payload.py` is better than three invocations each
  writing their own ad-hoc helpers.
- Saves every future invocation from re-deriving.
- Reduces the surface area for bugs.

## Use visual analysis when it helps

For skills operating on images, screenshots, or UI layouts, instruct
the agent to use the Read tool with the image to analyze it directly.
Examples: form field detection, layout analysis, diagram
interpretation.

## Create verifiable intermediate outputs

Break long pipelines into steps with outputs the agent can verify:

```markdown
## Workflow

Step 1: Run `scripts/extract_fields.py input.pdf`.
This produces `fields.json`. Verify it contains all expected field
names before continuing.

Step 2: Run `scripts/validate_mapping.py fields.json`.
This exits 0 if valid, non-zero with a specific error if not.

Step 3: Run `scripts/fill_form.py input.pdf fields.json output.pdf`.
```

Intermediate outputs let the agent catch problems early instead of
re-doing the whole pipeline on a late failure.

## Package dependencies

List required packages explicitly in the skill body. Don't assume
they're installed.

```markdown
## Requires

- Python 3.10+
- `pdfplumber` (install with `pip install pdfplumber`)
- `OPENAI_API_KEY` in environment
```

For compiled or bundled code (e.g., pre-built Node bundles), say so:

```markdown
## Requires

- Node 18+
- `SERVICE_API_KEY` in environment
- No `npm install` needed — `reply.cjs` is a pre-built bundle.
```

## Runtime environment

If the skill depends on environment variables, a specific Python or
Node version, or a working directory, state it explicitly. Don't
assume.

## MCP tool references

If the skill uses MCP tools, always use fully qualified tool names.

- Format: `ServerName:tool_name`
- ✓ *"Use `BigQuery:bigquery_schema` to retrieve table schemas."*
- ✓ *"Call `HubSpot:update_deal` to move the deal stage."*
- ✗ *"Use `bigquery_schema`"* (unqualified; agent may fail to locate)
- ✗ *"Call `update_deal`"* (unqualified)

Unqualified MCP tool names fail silently or with confusing errors.

## Avoid assuming tools are installed

Before running the main operation, verify required tools and
dependencies are available. If not, fail with a clear install hint.

```python
try:
    import pdfplumber
except ImportError:
    print("ERROR: pdfplumber is not installed. Run: "
          "pip install pdfplumber", file=sys.stderr)
    sys.exit(2)
```

## Make execution intent unambiguous

When the skill references a script, say whether to **run it** or
**read it**.

- **Execute**: *"Run `analyze_form.py` to extract fields."*
- **Reference**: *"See `analyze_form.py` for the extraction
  algorithm."*

Ambiguous phrasing (*"use `analyze_form.py`"*) wastes turns while the
agent decides which mode applies.

## No voodoo constants

Every constant in a script should have a comment explaining what it
is.

- ✗ `time.sleep(1.7)` (why 1.7?)
- ✓ `time.sleep(1.7)  # Empirical backoff to avoid HubSpot rate limit`

- ✗ `MAX_RETRIES = 5`
- ✓ `MAX_RETRIES = 5  # HubSpot recommends 5 retries with exponential
  backoff`
