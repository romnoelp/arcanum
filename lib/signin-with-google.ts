import { redirect } from "next/navigation";
import { createClient } from "../utils/supabase/client";

function getBaseURL() {
  // if (typeof window !== "undefined") return "";
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;

  if (process.env.RENDER_INTERNAL_HOSTNAME)
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;

  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export const signInWithGoogle = async () => {
  console.log("getbaseurl", getBaseURL());
  const supabase = createClient();
  const { error: authError } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${getBaseURL()}/auth/callback`,
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