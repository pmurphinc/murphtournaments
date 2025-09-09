

'use server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export async function handleSignup(formData: FormData) {
  // Use server-only admin client
  const supabase = getSupabaseAdmin();

  // Extract form data
  const teamName = formData.get("teamName") as string;
  const captainDiscord = formData.get("captainDiscord") as string;
  const embark1 = formData.get("embark1") as string;
  const embark2 = formData.get("embark2") as string;
  const embark3 = formData.get("embark3") as string;
  const embarkSub = formData.get("embarkSub") as string;
  const platform1 = formData.get("platform1") as string || "PC";
  const platform2 = formData.get("platform2") as string || "PC";
  const platform3 = formData.get("platform3") as string || "PC";
  const platformSub = formData.get("platformSub") as string || "PC";
  const region1 = formData.get("region1") as string || "NA";
  const region2 = formData.get("region2") as string || "NA";
  const region3 = formData.get("region3") as string || "NA";
  const regionSub = formData.get("regionSub") as string || "NA";

  // Generate slug from team name
  const slug = teamName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 32);

  // DEBUG: Log payload before insert
  const teamPayload = { name: teamName, ownerId: captainDiscord, slug };
  console.log("Team insert payload:", teamPayload);
  const { data: team, error: teamError } = await supabase
    .from("Team")
    .insert(teamPayload)
    .select()
    .single();
  if (teamError || !team) {
    // Log full error object and response
    console.error("Supabase team insert error:", teamError);
    console.error("Supabase team insert response:", team);
    if (teamError) {
      console.error('Error code:', teamError.code);
      console.error('Error details:', teamError.details);
      console.error('Error hint:', teamError.hint);
      console.error('Error schema:', teamError.schema);
      console.error('Error table:', teamError.table);
    }
    throw new Error(`Failed to create team: ${teamError?.message || "Unknown error"}`);
  }

  // Add members
  const members = [
    { embarkId: embark1, platform: platform1, region: region1, role: "OWNER", discordId: captainDiscord },
    { embarkId: embark2, platform: platform2, region: region2, role: "PLAYER" },
    { embarkId: embark3, platform: platform3, region: region3, role: "PLAYER" },
  ];
  if (embarkSub) {
    members.push({ embarkId: embarkSub, platform: platformSub, region: regionSub, role: "SUB" });
  }
  for (const m of members) {
    await supabase.from("TeamMember").insert({
      teamId: team.id,
      userId: m.discordId || null,
      role: m.role,
    });
    await supabase.from("EmbarkIdentity").insert({
      userId: m.discordId || captainDiscord,
      embarkId: m.embarkId,
      platform: m.platform,
      region: m.region,
      isPrimary: m.role === "OWNER",
    });
  }

  // Handle invite link (optional, just return teamId for now)
  return { teamId: team.id };
}

export async function signInWithDiscord() {
  "use server";
  const { signIn } = await import("@/lib/auth");
  await signIn("discord");
}
