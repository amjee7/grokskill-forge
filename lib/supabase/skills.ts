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
 * ULTRA-SIMPLE MVP HACK
 * Ignores the identifier completely.
 * Always returns the very first skill in the table.
 * This is temporary to unblock the detail page for MVP testing.
 */
export async function getSkillBySlug(identifier: string): Promise<Skill | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .limit(1)
    .single();

  if (error) {
    console.error('getSkillBySlug MVP error:', error);
    return null;
  }

  return data as Skill;
}

/**
 * Create a new skill (used by /upload page)
 */
export async function createSkill(input: CreateSkillInput & { owner_id: string }): Promise<Skill | null> {
  const supabase = await createClient();

  // Generate clean slug (can be overridden if passed)
  const rawSlug = (input as any).slug || input.name;
  const slug = rawSlug
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')     // remove special chars
    .replace(/[\s_-]+/g, '-')     // collapse spaces, underscores, dashes
    .replace(/^-+|-+$/g, '')      // trim leading/trailing dashes
    .slice(0, 80);                // safety limit

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
      price_cents: (input as any).price_cents ?? 0,
      currency: (input as any).currency || 'usd',
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
