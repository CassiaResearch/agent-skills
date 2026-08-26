# AGENTS.md Update Guidelines

## Core Principle

Only add information that will genuinely help AI agents work effectively. Context is precious - every line must earn its place.

## What TO Add

### 1. Commands Discovered

```markdown
## Commands

`pnpm --filter=web test:e2e` - Run E2E tests (requires dev server running)
```

Why: Saves future sessions from discovering these again.

### 2. Gotchas and Non-Obvious Patterns

```markdown
## Gotchas

- Tests must run sequentially (`--runInBand`) due to shared DB state
- Build required before migration: `pnpm build && pnpm db:migrate`
```

Why: Prevents repeating debugging sessions.

### 3. Behavioral Directives

```markdown
## Dos/Don'ts

**Do:**
- Use `@workspace/ui` components, not raw HTML
- Import from specific paths: `@workspace/ui/components/button`

**Don't:**
- Import from barrel files
- Create new components without checking existing ones
```

Why: Establishes clear patterns upfront.

### 4. Architecture Knowledge

```markdown
## Architecture

The `auth` module depends on `crypto` being initialized first.
Import order matters in `src/bootstrap.ts`.
```

Why: Not obvious from code alone.

## What NOT to Add

### 1. Obvious Code Info

Bad: "The `UserService` class handles user operations."

The class name already tells us this.

### 2. Generic Best Practices

Bad: "Always write tests for new features."

This is universal advice, not project-specific.

### 3. One-Off Fixes

Bad: "We fixed a bug in commit abc123 where login didn't work."

Won't recur; clutters the file.

### 4. Verbose Explanations

Bad: Long explanations of how JWT works.

Good: `Auth: JWT with HS256, tokens in Authorization: Bearer header`

## Placement Guidelines

### Root AGENTS.md

- Monorepo-wide patterns
- Common commands
- Shared architecture
- MCP servers
- Environment variables

### App/Package AGENTS.md

- Package-specific commands
- Local architecture details
- Package-specific gotchas
- Always reference parent for common patterns

## Validation Checklist

Before adding content, verify:

- [ ] Is this project-specific, not generic advice?
- [ ] Would this help a new session avoid issues?
- [ ] Is this the most concise way to express it?
- [ ] Is it placed at the most specific appropriate level?
- [ ] Does it avoid duplicating parent content?
