
'use server';

export async function handleSignup(formData: FormData) {
  // ...your existing server-action code...
}

export async function signInWithDiscord() {
  "use server";
  const { signIn } = await import("@/lib/auth");
  await signIn("discord");
}
