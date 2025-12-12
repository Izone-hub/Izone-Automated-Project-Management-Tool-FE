// import { cookies } from "next/headers";
// import { NextResponse } from "next/server";

// export async function POST() {
//     const cookieStore = await cookies();

//     // Delete the cookie reliably on the server side
//     // forcing path to / to match global visibility
//     cookieStore.delete("auth_token");

//     return NextResponse.json({ success: true });
// }





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

