# Anti-patterns to avoid

Source: [Anti-patterns to avoid](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/best-practices#anti-patterns-to-avoid).

## Avoid Windows-style paths

Always use forward slashes, even on Windows.

- ✓ `scripts/helper.py`, `reference/guide.md`
- ✗ `scripts\helper.py`, `reference\guide.md`

Unix-style paths work across all platforms; Windows-style paths cause
errors on Unix systems.

## Avoid offering too many options

Don't list multiple equal options without picking a default. Decision
paralysis is real — for the author *and* for the agent.

- ✗ *"You can use oathtool, pyotp, or totp-cli to generate TOTP
  codes."*
- ✓ *"Use oathtool to generate TOTP codes. If oathtool isn't
  available, fall back to pyotp."*

Pattern: pick a default, offer alternatives as escape hatches, not
equal choices.

### When alternatives are necessary

If a real decision point exists, structure it as a conditional
workflow (see `common-patterns.md`), not an unranked menu.

## Avoid over-explaining

The agent already knows most common concepts. Over-explanation wastes
tokens on every invocation.

- ✗ *"HubSpot is a CRM platform that stores contacts, deals, and
  companies. A deal stage represents where a deal is in the sales
  pipeline…"*
- ✓ *"When a prospect agrees to a demo, move the deal to 'Meeting
  Booked' using `HubSpot:update_deal`."*

See `core-principles.md` for the fuller treatment.

## Avoid first-person or second-person voice

Descriptions and bodies should be imperative (to the agent) or third
person.

- ✗ *"I will draft the email…"*
- ✗ *"You can draft the email by…"*
- ✓ *"Draft the email using the template in `references/email.md`."*
- ✓ *"Drafts the email using the template."* (in descriptions)

## Avoid rigid MUSTs on judgment tasks

`ALWAYS` and `NEVER` caps belong on fragile operations (API payloads,
schema migrations), not on judgment tasks (qualification, scoring).

See `degrees-of-freedom.md`.

## Avoid treating one skill as many

One skill = one job. If the description needs "and" to describe the
skill's purpose, consider splitting.

- ✗ *"Researches prospects, drafts cold emails, and logs activity in
  HubSpot."*
- ✓ Three skills: `prospect-research`, `cold-email-draft`,
  `hubspot-activity-log`.

See `core-principles.md` → one skill, one job.

## Avoid deeply nested references

References may be nested one level only.

- ✓ `skill-name/references/guide.md`
- ✗ `skill-name/references/domain/guide.md`

See `progressive-disclosure.md`.

## Avoid vague filenames

Reference filenames must indicate content.

- ✓ `hubspot-stage-ids.md`, `email-patterns.md`
- ✗ `doc1.md`, `notes.md`, `misc.md`, `appendix.md`
