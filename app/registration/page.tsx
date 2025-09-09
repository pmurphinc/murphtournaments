// Server component
import TeamSignupForm from "@/components/signup/TeamSignupForm";
import { auth } from "@/lib/auth";
import { handleRegistration } from "./actions";

export default async function RegistrationPage() {
  const session = await auth();
  return (
    <div className="max-w-2xl mx-auto p-6">
      <TeamSignupForm
        tournaments={[]} // or your real list
        captainDiscordName={session?.user?.name ?? ""} // optional, not required by DB
        userKey={session?.user?.id ?? "anon"}          // used for localStorage draft key
        action={handleRegistration}                    // <-- pass server action
      />
    </div>
  );
}
