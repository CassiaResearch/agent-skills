# Content guidelines

Sources:

- [Avoid time-sensitive information](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/best-practices#avoid-time-sensitive-information)
- [Use consistent terminology](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/best-practices#use-consistent-terminology)

## Avoid time-sensitive information

Embedded dates, version numbers, prices, deadlines, roadmap items — they
all go stale. When the skill is re-read six months later, time-sensitive
lines either mislead the agent or force re-reads the agent can't
automatically do.

### Rules

- Don't embed specific dates ("as of November 2024…").
- Don't embed version numbers unless behavior is version-gated.
- Don't embed prices, quotas, or rate limits — link to the canonical
  source instead.
- If time-sensitive info is unavoidable, isolate it under an "old
  patterns" or "current method" heading so the agent knows it's
  bounded in time.

### Example

```markdown
## Current method

Use `OAuth2PasswordBearer` from FastAPI for API authentication.

## Old patterns

Previously, APIs used Basic Auth with SHA-1 password hashes. If you
see this pattern in legacy code, migrate it to the current method.
```

### Link to canonical sources

For info that *will* change, link out rather than embedding:

- ✓ *"See the HubSpot deal-stage table at
  [confluence-link]"*
- ✗ *"Stages: Qualified (stage_id=12345), Demo Booked (stage_id=12346)..."*

## Use consistent terminology

Pick one term per concept and stick with it. Synonyms confuse the
agent and produce inconsistent output.

### Common drift pairs to pick between

- `prospect` vs `lead`
- `customer` vs `account`
- `deal` vs `opportunity`
- `email` vs `message`
- `workflow` vs `process`
- `template` vs `pattern`

### How to apply

- Pick a term on first use in the skill, then use only that term.
- If the repo has a canonical term (e.g., this repo uses `prospect`
  and `deal`), honor it.
- For a multi-term concept, pick the one that matches the tool being
  called: if the skill operates on a HubSpot `deal`, use `deal`.

Consistency helps the agent understand and follow instructions without
having to mentally reconcile synonyms.
