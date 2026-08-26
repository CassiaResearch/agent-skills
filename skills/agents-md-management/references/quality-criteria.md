# AGENTS.md Quality Criteria

## 8-Point Scoring Rubric

### 1. Commands/Workflows (15 points)

**15 points**: All essential commands documented with context
- Build, test, lint, dev commands present
- Commands are copy-paste ready
- Expected output or behavior noted

**10 points**: Most commands present, some missing context

**5 points**: Basic commands only

**0 points**: No commands documented

### 2. Architecture Clarity (15 points)

**15 points**: Clear codebase map
- Key directories explained with purpose
- Module relationships documented
- Entry points identified

**10 points**: Good structure overview, minor gaps

**5 points**: Basic directory listing only

**0 points**: No architecture info

### 3. Non-Obvious Patterns (15 points)

**15 points**: Gotchas and quirks captured
- Known issues documented
- Workarounds explained
- "Why we do it this way" for unusual patterns

**10 points**: Some patterns documented

**5 points**: Minimal pattern documentation

**0 points**: No patterns or gotchas

### 4. Conciseness (10 points)

**10 points**: Dense, valuable content
- No filler or obvious info
- Each line adds value
- One concept per line where possible

**7 points**: Mostly concise, some padding

**3 points**: Verbose in places

**0 points**: Mostly filler

### 5. Currency (15 points)

**15 points**: Reflects current codebase
- Commands work as documented
- File references accurate
- Tech stack current

**10 points**: Mostly current, minor staleness

**5 points**: Several outdated references

**0 points**: Severely outdated

### 6. Actionability (10 points)

**10 points**: Instructions are executable
- Commands can be copy-pasted
- Paths are real
- Steps are concrete

**7 points**: Mostly actionable

**3 points**: Some vague instructions

**0 points**: Vague or theoretical

### 7. Dos/Don'ts Clarity (10 points)

**10 points**: Clear behavioral directives
- Technology choices explicit
- Preferred patterns documented
- Anti-patterns listed

**7 points**: Some directives present

**3 points**: Minimal directives

**0 points**: No behavioral guidance

### 8. Progressive Disclosure (10 points)

**10 points**: Proper nesting
- Nested files reference parent for common patterns
- No duplication across levels
- Each level focuses on its scope

**7 points**: Mostly proper, some duplication

**3 points**: Significant duplication

**0 points**: No consideration of hierarchy

## Grading Scale

- **A (90-100)**: Comprehensive, current, actionable
- **B (70-89)**: Good coverage, minor gaps
- **C (50-69)**: Basic info, missing key sections
- **D (30-49)**: Sparse or outdated
- **F (0-29)**: Missing or severely outdated

## Monorepo-Specific Checks

- Root AGENTS.md lists all nested AGENTS.md files
- Nested files reference parent with `@../../AGENTS.md`
- Package/app commands use `pnpm --filter=` syntax
- No cross-file duplication of common patterns
