import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
    const cookieStore = await cookies();

    // Delete the cookie reliably on the server side
    // forcing path to / to match global visibility
    cookieStore.delete("auth_token");

    return NextResponse.json({ success: true });
}
