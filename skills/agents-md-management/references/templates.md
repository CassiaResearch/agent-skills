# AGENTS.md Templates

Templates for creating consistent, high-quality AGENTS.md files across different module types.

---

## Template Structure Requirements

Every AGENTS.md file MUST include these sections (based on audit findings):

| Section | Required | Notes |
|---------|----------|-------|
| Header (Type, Framework, Purpose) | Yes | 3-line overview |
| Overview | Yes | 1-2 sentences expanding on purpose |
| Commands | Yes | ALL package.json scripts, copy-paste ready |
| Directory Structure | Yes | ASCII tree, minimum 2 levels deep |
| Key Patterns | Yes | At least one concrete code example |
| Gotchas / Non-obvious Patterns | **MANDATORY** | Key differentiator between good/poor docs |
| Dos and Don'ts | **MANDATORY** | Consistently missing in current files |
| Related | Yes | Use relative paths, not @ notation |
| Last Verified | Yes | YYYY-MM-DD format for currency tracking |

---

## 1. Monorepo Root Template

```markdown
# Project Overview

**Type**: Turborepo TypeScript monorepo
**Architecture**: [e.g., Feature-based organization with shared packages]
**Package Manager**: pnpm [version]
**Node**: [version]
**Branching**: [strategy]

## Structure

\`\`\`
apps/
  app-name/     Description (port XXXX)
  app-name/     Description (port XXXX)
packages/
  package-name/ Description
  package-name/ Description
\`\`\`

## Development Ports

| App | Port | Command |
|-----|------|---------|
| **app-name** | XXXX | `pnpm --filter=app-name dev` |

## Commands

\`\`\`bash
# Development
pnpm install
pnpm dev                        # All apps
pnpm dev:[app]                  # Specific app
pnpm --filter=[name] dev        # Any app/package

# Building & Testing
pnpm build                      # All projects
pnpm build:apps                 # Apps only
pnpm build:packages             # Packages only
pnpm lint                       # All projects
pnpm check-types                # TypeScript validation
pnpm format                     # Format all files
pnpm test                       # Run tests
\`\`\`

## Architecture Patterns

### [Pattern Name]

Brief description of the pattern and why it exists.

\`\`\`typescript
// Concrete code example showing the pattern
import { something } from "@workspace/package";

const example = doSomething();
\`\`\`

## Code Style

**Import Order:**
1. External packages
2. Workspace packages (`@workspace/*`)
3. Local aliases (`@/*`)
4. Relative imports

**Commits:**
- Format: Conventional Commits
- Types: feat, fix, docs, style, refactor, perf, test, build, ops, chore

## Gotchas / Non-obvious Patterns

- **[Gotcha 1]**: Explanation of why this is non-obvious and what to do
- **[Gotcha 2]**: Another non-obvious pattern or quirk
- **Common mistake**: What people often get wrong and how to avoid it

## Dos and Don'ts

**Do:**
- Follow feature-based organization
- Use shared contracts for type safety between apps
- Run `pnpm install` after pulling changes

**Don't:**
- Import across features directly
- Hardcode environment variables
- Skip type checking before commits

## Subproject Guidance

Navigate to directories for detailed context:

- [apps/app-name/AGENTS.md](apps/app-name/AGENTS.md) - Description
- [packages/package-name/AGENTS.md](packages/package-name/AGENTS.md) - Description

---

**Last Verified**: YYYY-MM-DD
```

---

## 2. Next.js App Template

```markdown
# [App Name] - AGENTS.md

**Type**: Next.js app
**Framework**: Next.js [version]
**Purpose**: [Brief description of what this app does]

## Overview

[1-2 sentences expanding on the purpose, key features, and integrations]

## Commands

\`\`\`bash
# Development
pnpm --filter=[app-name] dev        # Start dev server (port XXXX)
pnpm --filter=[app-name] build      # Build for production
pnpm --filter=[app-name] start      # Start production server
pnpm --filter=[app-name] lint       # Run ESLint
pnpm --filter=[app-name] check-types # TypeScript validation

# From root
pnpm dev                            # All apps
pnpm dev:[app-name]                 # This app only
\`\`\`

## Directory Structure

\`\`\`
app/
  (routes)/        Route groups
  api/             API routes
    endpoint/      API endpoint
      route.ts
  layout.tsx       Root layout
  page.tsx         Home page
features/
  feature-name/    Feature directory
    components/    Feature components
    hooks/         Feature hooks
    types.ts       Feature types
components/        Shared app components
lib/               Utilities
env/
  server.ts        Server environment (T3 Env)
  client.ts        Client environment (T3 Env)
\`\`\`

## Key Patterns

### Feature-Based Organization

Features are self-contained in `features/`:

\`\`\`
features/
  chat/
    components/  chat-panel.tsx
    types.ts     Agent state types
  icp/
    components/  icp-panel.tsx, icp-artifact.tsx
    types.ts     ICP types
\`\`\`

### Environment Variables (T3 Env)

\`\`\`typescript
// Server-side
import { serverEnv } from "@/env/server";
const dbUrl = serverEnv.DATABASE_URL;

// Client-side
import { clientEnv } from "@/env/client";
const key = clientEnv.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
\`\`\`

### Path Aliases

\`\`\`json
{
  "@/*": "./*",
  "@/features/*": "./features/*",
  "@workspace/ui/*": "../../packages/ui/src/*"
}
\`\`\`

## Gotchas / Non-obvious Patterns

- **Environment paths**: Env files are at `env/server.ts` not `app/env/server.ts`
- **Feature isolation**: Features cannot import from other features - compose at app level
- **API route handlers**: Use `route.ts` not `api.ts` for Next.js 13+ app router
- **Server components**: Default to Server Components; add "use client" only when needed
- **Import order**: ESLint enforces import ordering - external, workspace, local, relative

## Dos and Don'ts

**Do:**
- Keep features self-contained with their own components and types
- Use workspace packages for shared utilities (`@workspace/*`)
- Validate environment variables with T3 Env schemas
- Use Server Components by default for better performance

**Don't:**
- Import from one feature into another feature
- Access `process.env` directly - use T3 Env
- Create new top-level directories without updating this doc
- Forget to add new env vars to the T3 Env schema

## Related

- **Parent**: [../../AGENTS.md](../../AGENTS.md) - Monorepo overview
- **Siblings**:
  - [../other-app/AGENTS.md](../other-app/AGENTS.md) - Other app
- **Packages**:
  - [../../packages/ui/AGENTS.md](../../packages/ui/AGENTS.md) - UI components
  - [../../packages/database/AGENTS.md](../../packages/database/AGENTS.md) - Database

---

**Last Verified**: YYYY-MM-DD
```

---

## 3. LangGraph Agent Template

```markdown
# [Agent App Name] - AGENTS.md

**Type**: LangGraph agent
**Framework**: LangGraph + LangChain
**Purpose**: [Brief description of agent purpose]

## Overview

[1-2 sentences describing the agent's capabilities and integrations]

## Commands

\`\`\`bash
# Development
pnpm --filter=[app-name] dev     # Start LangGraph dev server (port XXXX)
pnpm --filter=[app-name] build   # Build TypeScript
pnpm --filter=[app-name] start   # Start production server
pnpm --filter=[app-name] lint    # Run ESLint
pnpm --filter=[app-name] check-types # TypeScript validation

# From root
pnpm dev                         # All apps
pnpm dev:[app-name]              # This agent only
\`\`\`

## Directory Structure

\`\`\`
src/
  features/
    feature-name/
      graph.ts       LangGraph state machine
      prompt.ts      Agent prompts
      tools/         Agent tools
        tool-a.ts
        tool-b.ts
  shared/
    mcp/             MCP adapter configurations
    utils/           Shared utilities
langgraph.json       LangGraph configuration
\`\`\`

## Key Patterns

### Graph Definition

\`\`\`typescript
import { StateGraph, MemorySaver, Annotation } from "@langchain/langgraph";
import { z } from "zod";

// State schema with Zod
const StateAnnotation = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (x, y) => x.concat(y),
  }),
  output: Annotation<OutputType | null>,
});

// Build graph
const graph = new StateGraph(StateAnnotation)
  .addNode("agent", agentNode)
  .addNode("tools", toolNode)
  .addEdge("__start__", "agent")
  .addConditionalEdges("agent", shouldContinue);

export const compiledGraph = graph.compile({
  checkpointer: new MemorySaver(),
});
\`\`\`

### Tool Creation

\`\`\`typescript
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { OutputSchema } from "@workspace/contracts";

export const myTool = tool(
  async (input) => {
    // Tool implementation
    return { success: true, data: result };
  },
  {
    name: "my_tool",
    description: "What this tool does",
    schema: z.object({
      param: z.string().describe("Parameter description"),
    }),
  }
);
\`\`\`

### MCP Adapters

\`\`\`typescript
import { createMCPClient } from "@langchain/mcp-adapters";

const mcpTools = await createMCPClient({
  servers: ["tavily", "explorium"],
});
// Tools prefixed: mcp__tavily_search, mcp__explorium_enrich
\`\`\`

### LangGraph Configuration

`langgraph.json`:
\`\`\`json
{
  "graphs": {
    "graph-id": "./src/features/feature/graph.ts:exportedGraph"
  },
  "node_version": "20"
}
\`\`\`

## Gotchas / Non-obvious Patterns

- **Tool prefixing**: MCP tools are prefixed with `mcp__` (e.g., `mcp__tavily_search`)
- **State immutability**: Always return new state objects, never mutate
- **Memory persistence**: MemorySaver is for dev only; use persistent storage in production
- **Tool return types**: Tools must return structured data matching contract schemas
- **M2M auth**: Tools calling web APIs need M2M tokens from Clerk

## Dos and Don'ts

**Do:**
- Use Zod schemas from `@workspace/contracts` for tool inputs/outputs
- Return `ToolMessage` with structured data from tools
- Test graphs locally with the LangGraph dev server
- Log intermediate states for debugging

**Don't:**
- Mutate state directly in nodes
- Use MemorySaver in production (use persistent checkpointer)
- Hardcode API endpoints - use environment variables
- Forget to handle tool errors gracefully

## Debugging

\`\`\`bash
# Start dev server with debugging
pnpm --filter=[app-name] dev

# View graph visualization
open http://localhost:XXXX/graph-id/playground
\`\`\`

## Related

- **Parent**: [../../AGENTS.md](../../AGENTS.md) - Monorepo overview
- **Siblings**:
  - [../web/AGENTS.md](../web/AGENTS.md) - Web app (consumes agents)
- **Packages**:
  - [../../packages/contracts/AGENTS.md](../../packages/contracts/AGENTS.md) - Shared DTOs
  - [../../packages/database/AGENTS.md](../../packages/database/AGENTS.md) - Database

---

**Last Verified**: YYYY-MM-DD
```

---

## 4. Database Package Template

```markdown
# Database Package - AGENTS.md

**Type**: Prisma database package
**Database**: [Database type, e.g., Neon Postgres with RLS]
**Purpose**: [Brief description]

## Overview

[1-2 sentences about the database package, key features like RLS, extensions]

## Commands

\`\`\`bash
# Development
pnpm --filter=@workspace/database dev        # Watch mode
pnpm --filter=@workspace/database build      # Build package

# Database
pnpm --filter=@workspace/database db:generate   # Generate Prisma Client
pnpm --filter=@workspace/database db:migrate    # Run migrations
pnpm --filter=@workspace/database db:push       # Push schema to database
pnpm --filter=@workspace/database db:studio     # Open Prisma Studio
pnpm --filter=@workspace/database db:seed       # Seed database

# Testing
pnpm --filter=@workspace/database test          # Run all tests
pnpm --filter=@workspace/database test:unit     # Unit tests only
pnpm --filter=@workspace/database test:int      # Integration tests
pnpm --filter=@workspace/database test:watch    # Watch mode
pnpm --filter=@workspace/database test:coverage # With coverage
\`\`\`

## Directory Structure

\`\`\`
src/
  client.ts          Main client factory
  extensions/
    core/
      rls.ts         RLS extension (context variables)
    models/
      model-a.ts     Model A extensions
      model-b.ts     Model B extensions
    index.ts         Extension exports
  __mocks__/         Test mocks
prisma/
  schema.prisma      Database schema
  migrations/        Migration files
\`\`\`

## Key Patterns

### Client Factory

\`\`\`typescript
import { createOrganizationClient } from "@workspace/database";

// Organization-scoped client (RLS enabled)
const db = createOrganizationClient(organizationId, userId, "org:admin");
const result = await db.model.createWithValidation(data);

// System client (bypasses RLS for admin operations)
const systemDb = createOrganizationClient("system");
const allOrgs = await systemDb.organization.findMany();
\`\`\`

### Prisma Extensions

\`\`\`typescript
// src/extensions/models/icp.ts
import { Prisma } from "@prisma/client";

export const icpExtension = Prisma.defineExtension({
  name: "icp",
  model: {
    icp: {
      async createWithValidation(data: CreateICPInput) {
        // Validation logic
        return prisma.icp.create({ data });
      },
      async listWithStats() {
        // Custom query with aggregations
      },
    },
  },
});
\`\`\`

### RLS (Row Level Security)

- RLS policies defined in migrations
- Client factory sets `app.current_tenant_id` and `app.current_user_id`
- All queries automatically filtered by tenant
- System role bypasses RLS for admin operations

## Gotchas / Non-obvious Patterns

- **Regenerate client**: After schema changes, run `db:generate` before `db:migrate`
- **RLS debugging**: Use `systemDb` to query without RLS when debugging tenant issues
- **Extension loading**: Extensions must be registered in correct order (RLS first)
- **Migration conflicts**: Pull latest before creating migrations to avoid conflicts
- **Test isolation**: Integration tests use separate database; reset between tests

## Dos and Don'ts

**Do:**
- Use `createOrganizationClient()` for all application queries
- Put business logic in extensions, not in API routes
- Write integration tests for RLS policies
- Use transactions for multi-step operations

**Don't:**
- Use raw `PrismaClient` - always use the factory
- Bypass RLS in application code (only tests/admin scripts)
- Forget to regenerate client after schema changes
- Create migrations on stale branches

## Testing

\`\`\`typescript
import { createTestClient } from "@workspace/database/testing";

describe("ICP extensions", () => {
  const db = createTestClient();

  beforeEach(async () => {
    await db.cleanup();
  });

  it("creates with validation", async () => {
    const result = await db.icp.createWithValidation(validData);
    expect(result).toBeDefined();
  });
});
\`\`\`

## Related

- **Parent**: [../../AGENTS.md](../../AGENTS.md) - Monorepo overview
- **Siblings**:
  - [../contracts/AGENTS.md](../contracts/AGENTS.md) - Shared DTOs
- **Consumers**:
  - [../../apps/web/AGENTS.md](../../apps/web/AGENTS.md) - Web app
  - [../../apps/agents/AGENTS.md](../../apps/agents/AGENTS.md) - Agents

---

**Last Verified**: YYYY-MM-DD
```

---

## 5. UI Package (shadcn) Template

```markdown
# UI Package - AGENTS.md

**Type**: Shared component library
**Framework**: React [version] + Radix UI + Tailwind CSS [version]
**Pattern**: shadcn/ui monorepo structure

## Overview

[1-2 sentences about the component library and its purpose]

## Commands

\`\`\`bash
# Development
pnpm --filter=@workspace/ui build        # Build TypeScript
pnpm --filter=@workspace/ui clean        # Remove dist/
pnpm --filter=@workspace/ui lint         # ESLint check
pnpm --filter=@workspace/ui check-types  # TypeScript validation

# Adding components (from consuming app)
cd apps/web
pnpm dlx shadcn@latest add button        # Installs to packages/ui/src/components/
\`\`\`

## Directory Structure

\`\`\`
src/
  components/     React components (button.tsx, card.tsx)
  blocks/         Larger component compositions
  icons/          Icon components
  hooks/          Custom React hooks
  lib/            Utilities (cn() function)
  styles/         Global CSS (globals.css)
\`\`\`

## Key Patterns

### CVA Variants

\`\`\`tsx
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const buttonVariants = cva("base-classes", {
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground",
      outline: "border border-input bg-background",
      ghost: "hover:bg-accent hover:text-accent-foreground",
    },
    size: {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
\`\`\`

### cn() Utility

\`\`\`tsx
import { cn } from "@workspace/ui/lib/utils";

<div className={cn(
  "base-classes",
  condition && "conditional-classes",
  className  // Allow prop overrides
)} />
\`\`\`

### Usage in Apps

\`\`\`tsx
// Import components
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";

// Import utilities
import { cn } from "@workspace/ui/lib/utils";

// Import global styles (layout.tsx only)
import "@workspace/ui/styles/globals";
\`\`\`

## Gotchas / Non-obvious Patterns

- **Source imports**: Apps import source directly, TypeScript must compile
- **Peer dependencies**: React [version] required in consuming apps
- **Global styles**: Only import `globals.css` once (in root layout.tsx)
- **Dark mode**: Requires `next-themes` provider in consuming app
- **Tree shaking**: Use explicit imports (`/components/button`), not barrel exports
- **Build script**: Package has a `build` script for pre-compilation if needed

## Dos and Don'ts

**Do:**
- Use CVA for component variants
- Support className prop for customization
- Use Radix primitives for accessibility
- Include visible focus indicators
- Add aria-labels for icon-only buttons

**Don't:**
- Create barrel exports (breaks tree shaking)
- Import globals.css multiple times
- Skip accessibility attributes
- Use inline styles instead of Tailwind classes
- Forget dark mode support

## Accessibility Requirements

All components must be accessible:

\`\`\`tsx
// Icon-only button
<Button aria-label="Close dialog">
  <X className="h-4 w-4" />
</Button>

// Form inputs
<Label htmlFor="email">Email</Label>
<Input id="email" type="email" aria-describedby="email-hint" />
<p id="email-hint" className="text-sm text-muted-foreground">
  We'll never share your email.
</p>
\`\`\`

## Related

- **Parent**: [../../AGENTS.md](../../AGENTS.md) - Monorepo overview
- **Consumers**:
  - [../../apps/web/AGENTS.md](../../apps/web/AGENTS.md) - Web app
  - [../../apps/docs/AGENTS.md](../../apps/docs/AGENTS.md) - Docs site
- **Component sources**:
  - https://ui.shadcn.com/
  - https://www.shadcndesign.com/

---

**Last Verified**: YYYY-MM-DD
```

---

## 6. Contracts Package Template

```markdown
# Contracts Package - AGENTS.md

**Type**: Shared DTOs package
**Library**: Zod [version]
**Purpose**: Type-safe data contracts between apps

## Overview

Shared DTOs (Data Transfer Objects) ensuring type safety and runtime validation across the monorepo. Contains Zod schemas that define contracts between web app and agents.

## Commands

\`\`\`bash
# Development
pnpm --filter=@workspace/contracts build       # Build package (CJS + ESM)
pnpm --filter=@workspace/contracts dev         # Watch mode
pnpm --filter=@workspace/contracts lint        # ESLint check
pnpm --filter=@workspace/contracts check-types # TypeScript validation
\`\`\`

## Directory Structure

\`\`\`
src/
  dtos/
    icp.ts           ICP-related DTOs
    weather.ts       Weather DTOs
    [domain].ts      Domain-specific DTOs
  index.ts           Barrel exports
\`\`\`

## Key Patterns

### Creating DTOs

\`\`\`typescript
// src/dtos/icp.ts
import { z } from "zod";

// Schema definition
export const ICPOutputSchema = z.object({
  id: z.string().uuid().describe("Unique identifier"),
  name: z.string().min(1).describe("ICP name"),
  criteria: z.array(z.string()).describe("Selection criteria"),
  createdAt: z.date().describe("Creation timestamp"),
}).describe("Complete ICP analysis output");

// Type inference
export type ICPOutput = z.infer<typeof ICPOutputSchema>;

// Input schema (for creation)
export const CreateICPInputSchema = ICPOutputSchema.omit({
  id: true,
  createdAt: true,
});

export type CreateICPInput = z.infer<typeof CreateICPInputSchema>;
\`\`\`

### Usage

\`\`\`typescript
import { ICPOutputSchema, type ICPOutput } from "@workspace/contracts";

// Parse and validate
const result = ICPOutputSchema.parse(untrustedData);

// Safe parse (no throw)
const parsed = ICPOutputSchema.safeParse(data);
if (parsed.success) {
  const icp: ICPOutput = parsed.data;
}

// Type-only import
const icp: ICPOutput = {
  id: "...",
  name: "Enterprise",
  criteria: ["Revenue > $10M"],
  createdAt: new Date(),
};
\`\`\`

## Gotchas / Non-obvious Patterns

- **Zod version**: Using Zod v4 - some APIs changed from v3
- **Dual exports**: Package exports both CJS and ESM - check bundler compatibility
- **Schema descriptions**: Use `.describe()` on all fields for documentation
- **Date handling**: Zod parses ISO strings to Date objects automatically
- **Optional vs nullable**: Use `.optional()` for missing, `.nullable()` for explicit null

## Dos and Don'ts

**Do:**
- Use `.describe()` on schemas and fields for self-documentation
- Export both schema and inferred type
- Use strict schemas (avoid `.passthrough()`)
- Version schemas if making breaking changes
- Use `.omit()` / `.pick()` to create input variants

**Don't:**
- Use `.any()` or `.unknown()` without validation
- Create schemas without descriptions
- Forget to export types alongside schemas
- Make breaking changes without versioning
- Duplicate schemas between files

## Schema Naming Conventions

| Pattern | Example | Usage |
|---------|---------|-------|
| `[Name]Schema` | `ICPOutputSchema` | Full schema definition |
| `[Name]` | `ICPOutput` | Inferred type |
| `Create[Name]InputSchema` | `CreateICPInputSchema` | Creation input |
| `Update[Name]InputSchema` | `UpdateICPInputSchema` | Update input (partial) |

## Related

- **Parent**: [../../AGENTS.md](../../AGENTS.md) - Monorepo overview
- **Consumers**:
  - [../../apps/web/AGENTS.md](../../apps/web/AGENTS.md) - Web app
  - [../../apps/agents/AGENTS.md](../../apps/agents/AGENTS.md) - Agents
- **Siblings**:
  - [../database/AGENTS.md](../database/AGENTS.md) - Database package

---

**Last Verified**: YYYY-MM-DD
```

---

## 7. Generic Package Template

```markdown
# [Package Name] - AGENTS.md

**Type**: [Package type, e.g., Utility package, Email templates, PDF generation]
**Framework**: [Main dependencies]
**Purpose**: [Brief description]

## Overview

[1-2 sentences about what this package does and why it exists]

## Commands

\`\`\`bash
# Development
pnpm --filter=@workspace/[package-name] dev         # Watch mode
pnpm --filter=@workspace/[package-name] build       # Build package
pnpm --filter=@workspace/[package-name] lint        # ESLint check
pnpm --filter=@workspace/[package-name] check-types # TypeScript validation
pnpm --filter=@workspace/[package-name] test        # Run tests
\`\`\`

## Directory Structure

\`\`\`
src/
  [main-feature]/    Feature directory
    index.ts         Feature exports
    types.ts         Feature types
  utils/             Shared utilities
  index.ts           Package exports
\`\`\`

## Key Patterns

### [Main Pattern Name]

\`\`\`typescript
import { something } from "@workspace/[package-name]";

// Concrete usage example
const result = something.doThing({
  param: "value",
});
\`\`\`

## Usage

\`\`\`typescript
// Import from package
import { MainExport, HelperFunction } from "@workspace/[package-name]";

// Usage example
const instance = new MainExport();
const result = HelperFunction(data);
\`\`\`

## Gotchas / Non-obvious Patterns

- **[Gotcha 1]**: Description and how to handle it
- **[Gotcha 2]**: Another non-obvious behavior
- **Build requirement**: [If applicable, note when build is needed]

## Dos and Don'ts

**Do:**
- [Positive guidance specific to this package]
- Use TypeScript strict mode
- Export types alongside implementations

**Don't:**
- [Negative guidance specific to this package]
- Import from internal paths (use public exports)

## Related

- **Parent**: [../../AGENTS.md](../../AGENTS.md) - Monorepo overview
- **Consumers**:
  - [../../apps/app-name/AGENTS.md](../../apps/app-name/AGENTS.md) - Consumer
- **Siblings**:
  - [../sibling-package/AGENTS.md](../sibling-package/AGENTS.md) - Related package

---

**Last Verified**: YYYY-MM-DD
```

---

## Template Checklist

Before finalizing any AGENTS.md file, verify:

- [ ] Header has Type, Framework/Pattern, Purpose (3 lines)
- [ ] Commands section lists ALL package.json scripts
- [ ] Commands include `pnpm --filter=` syntax for packages
- [ ] Directory structure is at least 2 levels deep
- [ ] At least one concrete code example included
- [ ] Gotchas section has 3+ items (even for simple packages)
- [ ] Dos and Don'ts section has 3+ items each
- [ ] Related section uses relative paths (not @ notation)
- [ ] Last Verified date is set
- [ ] All paths verified against actual codebase
- [ ] All commands tested and working
