export interface Profile {
  id: string;
  email: string | null;
  full_name?: string | null;
}

export interface Skill {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  description: string;
  content: string; // Full SKILL.md markdown
  frontmatter: Record<string, any> | null;
  category: string | null;
  tags: string[] | null;
  visibility: "public" | "private";
  price_cents: number;           // 0 = free, e.g. 999 = $9.99
  currency: string;              // default 'usd'
  stars_count: number;
  forks_count: number;
  downloads_count: number;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  profiles?: Profile;
}

export interface SkillStep {
  id: string;
  title: string;
  instruction: string;
  success_criteria?: string;
}

export interface CreateSkillInput {
  name: string;
  description: string;
  content: string;
  frontmatter?: Record<string, any>;
  category?: string;
  tags?: string[];
  visibility?: "public" | "private";
  price_cents?: number;
  currency?: string;
}

export const CATEGORIES = [
  "development",
  "devops",
  "productivity",
  "research",
  "writing",
  "testing",
] as const;

export type Category = (typeof CATEGORIES)[number];
