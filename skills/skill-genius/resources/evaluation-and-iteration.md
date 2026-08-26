# Evaluation and iteration

Skills get better through use. The best-practices guide covers eval
frameworks and iterative development with an agent. This file keeps it
lightweight — the heavy eval apparatus (parallel baseline runs,
benchmarks, assertion grading) is deliberately out of scope for this
repo's daily authoring flow.

Source: [Evaluation and iteration](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/best-practices#evaluation-and-iteration).

## The three-part test plan (repo standard)

After any authoring action, every skill is tested three ways before
merge. The PR template captures these; `skill-genius` reminds the user
at the end of each authoring session.

1. **Trigger test** — does a phrase from the `Trigger with "…"` clause
   invoke the skill?
   - Pass: agent activates the skill when the phrase is used.
   - Fail: agent doesn't activate — the description needs more
     specific nouns or a better trigger clause.

2. **Walk-through test** — ask the agent to explain the skill's steps.
   Does the explanation match the SKILL.md body?
   - Pass: agent's explanation is accurate and complete.
   - Fail: agent is inventing steps or missing steps — the body has
     ambiguity or structure issues.

3. **Over-trigger test** — does a related-but-off-topic phrase
   correctly NOT invoke the skill?
   - Pass: agent doesn't activate the skill on near-misses.
   - Fail: description is too broad; trigger phrases are too generic
     or overlap with other skills' territory.

## Iterating with an agent

When a test fails, iterate:

- **Trigger failure** → read `writing-descriptions.md`; tighten nouns,
  strengthen the trigger clause.
- **Walk-through failure** → read `progressive-disclosure.md` and
  `workflows-and-feedback-loops.md`; restructure the body.
- **Over-trigger failure** → the description or name is too broad.
  Narrow it, or split the skill.

Content changes to fix trigger or over-trigger failures affect
discovery — use `AskUserQuestion` before committing per the
proactivity rule in the main SKILL.md.

## Observe how the agent navigates

When you have the chance to watch an agent use a skill live, note:

- **Which reference files did it read?** If it never read a file, the
  file may be unnecessary or poorly signaled.
- **Did it skip steps in a workflow?** If so, the checklist pattern
  (see `workflows-and-feedback-loops.md`) would help.
- **Did it ask the user for info that's in the skill?** The skill
  isn't surfacing that info clearly enough.

Use these observations to refine, not to assume.
