"use server";
import { NextResponse } from "next/server";
import { createClient } from "../../../../utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/redirect";

  console.log("origin", origin);
  console.log("code", code);

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const forwardedHost = request.headers.get("x-forwarded-host");
      console.log("forwarded host", forwardedHost);
      const isLocalEnv = process.env.NODE_ENV === "development";
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return;
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  } else {
    return NextResponse.redirect(`${origin}/`);
  }

  return NextResponse.redirect(`${origin}/error`);
}