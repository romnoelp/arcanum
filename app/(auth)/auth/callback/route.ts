"use server";
import { NextResponse } from "next/server";
import { createClient } from "../../../../utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/redirect"; // Redirect after successful login

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Hardcode production domain for consistent redirects
      const redirectBase = "https://arcanum-two.vercel.app";

      return NextResponse.redirect(`${redirectBase}${next}`);
    }
  }

  // Redirect to the error page on failure
  return NextResponse.redirect("https://arcanum-two.vercel.app/error");
}
