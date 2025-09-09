// app/registration/page.tsx
export const runtime = "nodejs";

import TeamSignupForm from "@/components/signup/TeamSignupForm";
import { auth } from "@/lib/auth";
import { handleRegistration } from "./actions";

export default async function RegistrationPage() {
  const session = await auth();

  return (
    <div className="max-w-2xl mx-auto p-6">
      <TeamSignupForm
        tournaments={[]}
        captainDiscordName={session?.user?.name ?? ""}
        userKey={session?.user?.id ?? "anon"}
        action={handleRegistration}   // <-- pass the server action
      />
    </div>
  );
}