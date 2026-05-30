import { createClient } from './server';
import type { Skill, CreateSkillInput } from '@/types/skill';

/**
 * Data Access Layer for Skills (MVP)
 * All functions are designed to run on the server (Server Components, Route Handlers, Server Actions).
 */

/**
 * ULTRA-SIMPLE MVP VERSION
 * Fetches every single row from public.skills with zero filtering.
 * 
 * To permanently disable RLS for MVP (run this in Supabase SQL Editor):
 * 
 *   ALTER TABLE public.skills DISABLE ROW LEVEL SECURITY;
 * 
 * Or to re-enable later:
 * 
 *   ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
 */
export async function getPublicSkills(): Promise<Skill[]> {
  const supabase = await createClient();

  console.log("=== FETCHING SKILLS ===");

  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .order('created_at', { ascending: false });

  console.log("SKILLS FETCHED:", data?.length || 0, data);

  if (error) {
    console.error('Error fetching skills:', error);
    return [];
  }

  return data || [];
}

/**
 * Forgiving lookup for MVP.
 * Tries to find skill by slug, then by id, then by name (exact or partial).
 */
export async function getSkillBySlug(identifier: string): Promise<Skill | null> {
  if (!identifier) return null;

  const supabase = await createClient();

  // 1. Try exact slug match
  let { data, error } = await supabase
    .from('skills')
    .select('*')
    .eq('slug', identifier)
    .maybeSingle();

  if (data) return data as Skill;

  // 2. Try by id (if it looks like a UUID)
  if (identifier.length > 30) {
    ({ data, error } = await supabase
      .from('skills')
      .select('*')
      .eq('id', identifier)
      .maybeSingle());
    if (data) return data as Skill;
  }

  // 3. Try exact name match
  ({ data, error } = await supabase
    .from('skills')
    .select('*')
    .eq('name', identifier)
    .maybeSingle());

  if (data) return data as Skill;

  // 4. Very forgiving: name contains the identifier
  ({ data, error } = await supabase
    .from('skills')
    .select('*')
    .ilike('name', `%${identifier}%`)
    .limit(1)
    .maybeSingle());

  if (error) {
    console.error('Error fetching skill by identifier:', error);
  }

  return data as Skill | null;
}

/**
 * Create a new skill (used by /upload page)
 */
// Helper to generate a clean slug from a name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')     // remove special characters
    .replace(/[\s_-]+/g, '-')     // collapse spaces, underscores and dashes
    .replace(/^-+|-+$/g, '')      // trim leading/trailing dashes
    .slice(0, 80);                // safety limit
}

export async function createSkill(input: CreateSkillInput & { owner_id: string }): Promise<Skill | null> {
  const supabase = await createClient();

  // Use provided slug or generate a clean one from the name
  const slug = input.slug || generateSlug(input.name);

  const { data, error } = await supabase
    .from('skills')
    .insert({
      owner_id: input.owner_id,
      name: input.name,
      slug,
      description: input.description,
      content: input.content,
      frontmatter: input.frontmatter || null,
      category: input.category || null,
      tags: input.tags || [],
      visibility: input.visibility || 'public',
      price_cents: input.price_cents ?? 0,
      currency: input.currency || 'usd',
      published_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating skill:', error);
    throw new Error(error.message);
  }

  return data as Skill;
}

/**
 * Get all skills owned by the current user
 */
export async function getMySkills(ownerId: string): Promise<Skill[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .eq('owner_id', ownerId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching my skills:', error);
    return [];
  }

  return (data as Skill[]) || [];
}

/**
 * Get all successful purchases made by the user (skills they bought)
 */
export async function getMyPurchases(buyerId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('purchases')
    .select(`
      *,
      skill:skills(*)
    `)
    .eq('buyer_id', buyerId)
    .eq('status', 'succeeded')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching my purchases:', error);
    return [];
  }

  return data || [];
}

/**
 * Check if a user has purchased a specific skill
 */
export async function hasUserPurchasedSkill(userId: string, skillId: string): Promise<boolean> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('purchases')
    .select('id')
    .eq('buyer_id', userId)
    .eq('skill_id', skillId)
    .eq('status', 'succeeded')
    .maybeSingle();

  if (error) {
    console.error('Error checking purchase status:', error);
    return false;
  }

  return !!data;
}
