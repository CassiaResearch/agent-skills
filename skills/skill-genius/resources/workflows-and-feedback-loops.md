# Workflows and feedback loops

## Contents

- Use workflows for complex tasks
  - When to use a checklist
  - When NOT to use a checklist
  - Template
  - Example — research synthesis (no code)
  - Example — PDF form filling (with code)
- Implement feedback loops
  - Quality-critical categories
  - Template
  - Criteria must be objective
  - Two examples from the best-practices guide

## Sources

- [Use workflows for complex tasks](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/best-practices#use-workflows-for-complex-tasks)
- [Implement feedback loops](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/best-practices#implement-feedback-loops)

## Use workflows for complex tasks

Break complex operations into clear, sequential steps. For particularly
complex workflows, provide a **checklist the agent can copy into its
response and check off** as it progresses.

### When to use a checklist

- **6+ sequential steps** the agent executes in order.
- Steps whose order matters or where skipping a step has real cost.

### When NOT to use a checklist

- Output-shape specs. A numbered list of report sections isn't a
  workflow. *"The report contains: (1) summary, (2) key findings, (3)
  recommendations"* — don't checkbox this.
- Rule sets. A numbered list of policies isn't a workflow.
- Short workflows with ≤5 steps. Overhead isn't worth it.

### Template

````markdown
## Workflow

Copy this checklist and track your progress:

```
- [ ] Step 1: <short imperative>
- [ ] Step 2: <short imperative>
- [ ] Step 3: <short imperative>
- [ ] Step 4: <short imperative>
- [ ] Step 5: <short imperative>
- [ ] Step 6: <short imperative>
```

**Step 1: <imperative title>**

<full instructions for step 1>

**Step 2: <imperative title>**

<full instructions for step 2>

…
````

### Example — research synthesis (no code)

````markdown
## Research synthesis workflow

Copy this checklist and track your progress:

```
Research Progress:
- [ ] Step 1: Read all source documents
- [ ] Step 2: Identify key themes
- [ ] Step 3: Cross-reference claims
- [ ] Step 4: Create structured summary
- [ ] Step 5: Verify citations
```

**Step 1: Read all source documents**

Review each document in the `sources/` directory. Note the main
arguments and supporting evidence.

**Step 2: Identify key themes**

…
````

### Example — PDF form filling (with code)

````markdown
## PDF form filling workflow

Copy this checklist and check off items as you complete them:

```
Task Progress:
- [ ] Step 1: Analyze the form (run analyze_form.py)
- [ ] Step 2: Create field mapping (edit fields.json)
- [ ] Step 3: Validate mapping (run validate_fields.py)
- [ ] Step 4: Fill the form (run fill_form.py)
- [ ] Step 5: Verify output (run verify_output.py)
```

**Step 1: Analyze the form**

Run: `python scripts/analyze_form.py input.pdf`

This extracts form fields and their locations, saving to `fields.json`.

…

**Step 5: Verify output**

Run: `python scripts/verify_output.py output.pdf`

If verification fails, return to Step 2.
````

Clear steps prevent the agent from skipping critical validation.

## Implement feedback loops

For quality-critical outputs, include an explicit
**validator → fix → repeat** loop with concrete pass criteria. The
agent doesn't ship the output until the loop passes.

### Quality-critical categories

- Outputs governed by a data contract or structured schema.
- Compliance-sensitive copy (regulatory, legal review, CASL, etc.).
- Artifacts downstream systems parse and reject on miss (e.g. handoff
  forms requiring all fields).
- Outputs where the downstream cost of error is high (pipeline data
  quality, audit trails).

### Template

```markdown
## Validation

After producing the draft, check each criterion:

- [ ] <concrete, objectively-verifiable criterion>
- [ ] <concrete, objectively-verifiable criterion>
- [ ] <concrete, objectively-verifiable criterion>

If any criterion fails, fix the draft and re-check. Do not ship until
every criterion passes.
```

### Criteria must be objective

- ✗ *"The note is well-written."* (subjective)
- ✓ *"The note includes a next step, a dollar value, and an owner."*
  (checkable)

- ✗ *"The email feels professional."* (subjective)
- ✓ *"The email includes a clear subject line under 60 characters and
  a single call-to-action."* (checkable)

### Two examples from the best-practices guide

**Style guide compliance** (no code):

```markdown
## Content review process

After drafting, run this review:

- [ ] Active voice used throughout (no passive constructions)
- [ ] No terms from the prohibited list (see style-guide.md)
- [ ] Headings follow sentence case
- [ ] Reading level below grade 10

Fix any failing item and re-review. Ship only after all pass.
```

**Document editing** (with code):

```markdown
## Document editing process

After editing:

- [ ] Run `validate_structure.py edited.md`
- [ ] Run `check_references.py edited.md`

Both must exit 0. If not, fix the issue and re-run.
```
