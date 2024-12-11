import { redirect } from "next/navigation";
import { createClient } from "../utils/supabase/client";

export const signInWithGoogle = async () => {
  const supabase = createClient();
  const redirectTo =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000/auth/callback"
      : "https://arcanum-3795.vercel.app/auth/callback";

  const { error: authError } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (authError) {
    console.error("Sign-in error:", authError);
    redirect("/error");
  }
};
