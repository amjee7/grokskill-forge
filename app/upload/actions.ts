"use server";

import { createClient } from "@/lib/supabase/server";
import { createSkill } from "@/lib/supabase/skills";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createSkillAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be logged in to upload a skill.");
  }

  const name = (formData.get("name") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const content = (formData.get("content") as string)?.trim();
  const category = (formData.get("category") as string) || null;
  const tagsRaw = (formData.get("tags") as string) || "";

  // Generate clean slug in createSkillAction (MVP)
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);

  const priceTier = formData.get("priceTier") as string;
  const customPrice = formData.get("customPrice") as string;

  if (!name || !description || !content) {
    throw new Error("Name, description, and content are required.");
  }

  // Calculate final price in cents
  let price_cents = 0;

  if (priceTier === "custom") {
    const dollars = parseFloat(customPrice);
    if (isNaN(dollars) || dollars < 0) {
      throw new Error("Please enter a valid custom price.");
    }
    price_cents = Math.round(dollars * 100);
  } else {
    price_cents = parseInt(priceTier, 10);
  }

  const tags = tagsRaw
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);

  await createSkill({
    owner_id: user.id,
    name,
    slug,                    // pass the generated clean slug
    description,
    content,
    category: category || undefined,
    tags,
    visibility: "public",
    price_cents,
    currency: "usd",
  });

  // Refresh dashboard and marketplace
  revalidatePath("/dashboard");
  revalidatePath("/marketplace");

  // Redirect to dashboard after success
  redirect("/dashboard");
}
