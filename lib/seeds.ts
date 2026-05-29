import type { Skill } from "@/types/skill";

// Realistic demo skills shown when the database is empty or for the landing page.
// These match the spirit and quality of real Grok bundled skills.

export const demoSkills: Skill[] = [
  {
    id: "demo-review",
    owner_id: "00000000-0000-0000-0000-000000000001",
    name: "review",
    slug: "review",
    description: "Run a reviewer subagent against uncommitted local changes, a named branch, or a GitHub PR. Produces structured findings with severity levels.",
    content: `---
name: review
description: >
  Run a reviewer subagent against uncommitted local changes, a named branch,
  or a GitHub PR. Local and branch modes write a review file plus a summary to disk.
when-to-use: "Use when asked to 'review', 'code review', 'review my changes', or '/review'."
---

# Review Skill

You are an orchestrator that runs a reviewer subagent against one of three review targets.

## Modes

1. **Local mode (default)** — uncommitted local changes
2. **Branch mode** — diff between a named branch and merge-base
3. **PR mode** — full GitHub pull request review posted as PENDING

The reviewer subagent is always read-only.`,
    frontmatter: { name: "review", "when-to-use": "Use when asked to 'review' or '/review'" },
    category: "development",
    tags: ["code-review", "github", "quality"],
    visibility: "public",
    price_cents: 0,
    currency: "usd",
    stars_count: 1243,
    forks_count: 189,
    downloads_count: 4821,
    created_at: "2025-01-12T10:00:00Z",
    updated_at: "2025-03-01T14:22:00Z",
    published_at: "2025-01-12T10:00:00Z",
    profiles: { id: "seed", email: "grok@x.ai" },
  },
  {
    id: "demo-implement",
    owner_id: "00000000-0000-0000-0000-000000000001",
    name: "implement",
    slug: "implement",
    description: "Full implement-review-fix loop using specialized personas. Supports effort-based multi-reviewer scaling (1-5 reviewers).",
    content: `---
name: implement
description: >
  Run the full implement-review-fix loop. Uses implementer + reviewer personas.
  Supports --effort N for multiple parallel reviewers.
when-to-use: "Use when asked to implement a feature, fix a bug, or '/implement'."
---

# Implement Skill

Orchestrates a complete feature or refactor using:

- An implementer persona that writes code
- One or more reviewer personas that critique it
- Automatic iteration until all reviewers approve with zero open issues`,
    frontmatter: { name: "implement" },
    category: "development",
    tags: ["feature", "refactor", "loop"],
    visibility: "public",
    price_cents: 999,
    currency: "usd",
    stars_count: 876,
    forks_count: 134,
    downloads_count: 3102,
    created_at: "2025-02-03T08:30:00Z",
    updated_at: "2025-03-04T11:10:00Z",
    published_at: "2025-02-03T08:30:00Z",
    profiles: { id: "seed", email: "grok@x.ai" },
  },
  {
    id: "demo-design",
    owner_id: "00000000-0000-0000-0000-000000000001",
    name: "design",
    slug: "design",
    description: "Run the full design-doc-writer and design-doc-reviewer loop until consensus. Produces polished architecture and technical design documents.",
    content: `---
name: design
description: >
  Run the full design-doc-writer and design-doc-reviewer loop until consensus.
  Produces a polished design document with a PR plan.
when-to-use: "Use when asked to 'design', 'write a design doc', 'system design' or '/design'."
---

# Design Skill

Coordinates two specialized personas:
- design-doc-writer
- design-doc-reviewer

Iterates until the reviewers have no remaining issues.`,
    frontmatter: { name: "design" },
    category: "productivity",
    tags: ["architecture", "documentation", "planning"],
    visibility: "public",
    price_cents: 1999,
    currency: "usd",
    stars_count: 654,
    forks_count: 91,
    downloads_count: 1877,
    created_at: "2025-01-28T16:00:00Z",
    updated_at: "2025-02-20T09:45:00Z",
    published_at: "2025-01-28T16:00:00Z",
    profiles: { id: "seed", email: "grok@x.ai" },
  },
  {
    id: "demo-skillify",
    owner_id: "00000000-0000-0000-0000-000000000002",
    name: "skillify",
    slug: "skillify",
    description: "Interactively turn any workflow you just performed into a clean, reusable Grok skill. Analyzes session history or guides from scratch.",
    content: `---
name: skillify
description: >
  Interactively capture a workflow as a reusable skill.
  Use when you want to create a skill or run /create-skill.
when-to-use: "Use when you want to turn repeated work into a skill or run /skillify."
---

# Skillify

1. Gathers context from recent tool calls and commands (or asks from scratch)
2. Interviews you for name, description, and scope
3. Generates high-quality frontmatter + numbered steps
4. Writes the finished SKILL.md to disk (project or user scope)`,
    frontmatter: { name: "skillify" },
    category: "productivity",
    tags: ["meta", "creation", "workflow"],
    visibility: "public",
    price_cents: 0,
    currency: "usd",
    stars_count: 421,
    forks_count: 67,
    downloads_count: 1299,
    created_at: "2025-02-11T12:00:00Z",
    updated_at: "2025-03-02T17:30:00Z",
    published_at: "2025-02-11T12:00:00Z",
    profiles: { id: "seed2", email: "community@forge.dev" },
  },
];

export function getDemoSkillBySlug(slug: string): Skill | undefined {
  return demoSkills.find((s) => s.slug === slug);
}
