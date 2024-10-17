"use server";

import { redirect } from "next/navigation";
import { createClient } from "../../utils/supabase/server";

const supabase = createClient();

// Post Auth (if successful), this will run
const handleOAuthCallback = async () => {
   const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession();

   if (sessionError || !sessionData?.session?.user) {
      console.error("Session retrieval error:", sessionError);
      redirect("/error");
      return;
   }

   const user = sessionData.session.user;

   const { data: userInfo, error: roleError } = await supabase
      .from("User")
      .select("type")
      .eq("uuid", user.id)
      .single();

   if (roleError) {
      console.error("Role fetch error:", roleError);
      redirect("/error");
      return;
   }

   // Change when we have role-based login feature already
   if (userInfo?.type === "admin") {
      redirect("/dashboard");
   } else {
      redirect("/dashboard");
   }
};

// Google OAuth
const signInWithGoogle = async (redirectUrl: string) => {
   const { data, error: authError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
         redirectTo: redirectUrl,
         queryParams: {
            access_type: "offline",
            prompt: "consent",
         },
      },
   });

   if (authError) {
      console.error("Sign-in error:", authError);
      redirect("/error");
      return;
   }

   redirect(data.url);
};

// Signout 
const signout = async () => {
   const { error } = await supabase.auth.signOut();

   if (error) {
      console.error("Sign-out error:", error);
      redirect("/error");
      return;
   }

   redirect("/logout");
};


export { handleOAuthCallback, signInWithGoogle, signout };