import { redirect } from "next/navigation";
import { createClient } from "../utils/supabase/client";

export const signInWithGoogle = async () => {
  const supabase = createClient();
  const redirectTo = "https://arcanum-two.vercel.app/admin";

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
