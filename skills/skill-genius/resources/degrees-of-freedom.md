# Degrees of freedom

Match the specificity of instructions to the fragility and variability
of the task. The best-practices guide's analogy: a robot on a narrow
bridge with cliffs needs exact guardrails; in an open field, it just
needs general direction.

Source: [Set appropriate degrees of freedom](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/best-practices#set-appropriate-degrees-of-freedom).

## High freedom — text, principles, heuristics

Use when:

- Multiple approaches are valid.
- Decisions depend on context.
- Heuristics guide the approach.

```markdown
## Code review process

1. Analyze the code structure and organization
2. Check for potential bugs or edge cases
3. Suggest improvements for readability and maintainability
4. Verify adherence to project conventions
```

Signals for high freedom: *"There's no single right answer; context
determines the best path."*

## Medium freedom — pseudocode or templates with parameters

Use when:

- A preferred pattern exists.
- Some variation is acceptable.
- Configuration affects behavior.

````markdown
## Generate report

Use this template and customize as needed:

```python
def generate_report(data, format="markdown", include_charts=True):
    # Process data
    # Generate output in specified format
    # Optionally include visualizations
```
````

Signals for medium freedom: *"The shape matters; the values come from
context."*

## Low freedom — specific scripts, exact commands, few or no parameters

Use when:

- Operations are fragile and error-prone.
- Consistency is critical.
- A specific sequence must be followed.

````markdown
## Database migration

Run exactly this script:

```bash
python scripts/migrate.py --verify --backup
```

Do not modify the command or add additional flags.
````

Signals for low freedom: *"One specific sequence works; variation
breaks things."*

## Anti-patterns

- **Rigid `ALWAYS` / `NEVER` caps on a high-freedom task.** Stifles
  judgment. Produces brittle skills that fail on inputs slightly
  outside the examples.
- **Loose prose on a low-freedom task.** Each invocation re-derives
  the approach, producing random breakage. Fragile operations need
  explicit sequences.

## Picking the right level

Ask about the operation:

- If variation is safe and judgment is needed → **high**.
- If the shape is fixed but values vary → **medium**.
- If failure is expensive or the sequence matters → **low**.

A single skill can mix levels — a medium-freedom workflow with one
low-freedom fragile step, for example. Name the level per-section when
it helps.
