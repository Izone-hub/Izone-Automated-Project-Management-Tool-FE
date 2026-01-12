// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });

  // Expire the cookie on the client
  response.cookies.set({
    name: "auth_token",
    value: "",
    path: "/",            // must match original cookie
    expires: new Date(0), // expire immediately
    httpOnly: true,
  });

  return response;
}

