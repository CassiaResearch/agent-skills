# Connectors — the `~~category` model

When a skill needs a tool a workspace connects (calendar, chat, email, docs,
CRM, sales engagement, …), don't name the product — use a `~~category`
placeholder so one skill body works for any workspace. This guide is about
*when* to reach for the abstraction and how to wire it. Note: a placeholder
only works if the host repo provides a registry that resolves `~~category`
to the workspace's connected tool; if it doesn't, keep the connector name
concrete.

## When to use a placeholder — and when not to

Use `~~category` only when the abstraction is **clean**:

- The connectors in the category share the same core concepts (calendar events,
  attendees, availability; or chat channels and messages).
- Every operation the skill needs exists in all of those connectors.
- No connector-specific field name or workflow concept leaks into the body.

Keep the skill **connector-specific** (e.g. `hubspot-*`, `instantly-*`) when the
abstraction is **leaky**:

- The connectors' object models or field names differ enough to change behavior
  (e.g. HubSpot lifecycle stage vs. Salesforce lead status — abstracting them
  produces wrong outcomes).
- A key operation exists in one connector but not the others.
- Forcing the abstraction makes the skill less accurate or harder to follow.

When a sibling connector emerges later, add a sibling skill (`salesforce-sequences`
next to `hubspot-sequences`); the abstract version comes only once the siblings
exist and their semantics demonstrably converge.

### Quick test

"Would this instruction read correctly if I substituted each candidate tool for
the placeholder?" Try it for two or three real tools in the category. If every
substitution yields a valid, accurate instruction — use the abstraction. If any
substitution breaks or loses meaning — keep the connector name.

### Anti-pattern

Writing `~~CRM` in a body that contains HubSpot lifecycle-stage names. The
placeholder promises a generality the body contradicts, and both the reader and
the agent get confused. Either make the body genuinely generic, or name the
connector.

## Wiring rule (required)

A skill that uses any `~~category` must point to the registry **by name** — one
line near its first use:

> Connector placeholders (`~~category`) resolve to your connected tool of
> that type — see this repo's connector-registry skill.

Never hand-copy the category→tool table into a skill (it would drift). The
registry is the single source for the vocabulary and is the only skill that
carries the full table.

## Backticking

- **Prose, steps, tables** → backtick: `` `~~chat` ``.
- **Frontmatter `description`** → bare: `~~chat` (the catalog shows the
  description as raw text, so backticks would render literally).
- **Inside fenced code blocks and path templates** → bare: a JSON value like
  `"<~~knowledge base url>"`, or a path like `~~knowledge base/Reports/{campaign}/`.

## Not-connected fallback

State what happens when the category isn't connected. Blocking step → surface a
clear error and stop (`"~~calendar is not connected — connect a calendar provider
to use this skill."`). Optional step → continue and note the skip. Never silently
no-op.
