# Core principles

Two meta-principles underpin everything else in the best-practices
guide. Read this file before any significant authoring decision.

Source: [Core principles](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/best-practices#core-principles).

## Concise is key

The context window is a public good. Your skill shares it with the
system prompt, conversation history, other skills' metadata, and the
user's actual request.

Not every token in a skill has an immediate cost. At startup, only the
metadata (name + description) of all skills is pre-loaded. The SKILL.md
body loads only when the skill triggers. Reference files load only when
the agent reads them.

But once SKILL.md loads, every token competes. **Every paragraph in
SKILL.md must justify its cost on every invocation.**

### Default assumption: agents are already very smart

Only add context the agent doesn't already have. Challenge every piece
of information:

- "Does the agent really need this explanation?"
- "Can I assume the agent knows this?"
- "Does this paragraph justify its token cost?"

**Bad** (~150 tokens) — over-explains a concept the agent already
knows:

```markdown
PDF (Portable Document Format) files are a common file format that
contains text, images, and other content. To extract text from a PDF,
you'll need to use a library. There are many libraries available for
PDF processing, but one of the most reliable is pdfplumber. First,
install it...
```

**Good** (~50 tokens) — skips to the directive:

````markdown
## Extract PDF text

Use pdfplumber for text extraction:

```python
import pdfplumber

with pdfplumber.open("file.pdf") as pdf:
    text = pdf.pages[0].extract_text()
```
````

## One skill, one job

Compose; don't aggregate. If a workflow has multiple distinct verbs
(research → draft → log), split into separate skills that call each
other by name. Each gets a tighter description, which means the agent
selects better.

- **Too broad**: description reads "handles all sales workflows", or
  trigger phrases span unrelated verbs. Split along verb / output
  boundary.
- **Too narrow**: body under ~20 lines, no branching, no output
  template, no meaningful payload. Fold into a sibling.

## Test with the models you plan to use

Skills add to the model; their effectiveness depends on it. Test a
skill with every model class you'll deploy it on:

- **Small / economical models**: does the skill give enough guidance?
- **Balanced models**: is the skill clear and efficient?
- **Powerful reasoning models**: does the skill avoid over-explaining?

What works perfectly for a powerful model may need more structure for
an economical one.
