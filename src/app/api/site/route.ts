import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSiteContent, saveSiteContent } from "@/lib/site-content";

async function ensureAuthenticated() {
  const cookieStore = cookies();
  return cookieStore.get("portfolio_admin_session")?.value === "authenticated";
}

export async function GET() {
  const content = await getSiteContent();
  return NextResponse.json(content);
}

export async function PUT(request: Request) {
  const authenticated = await ensureAuthenticated();

  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await request.json();
  const content = await saveSiteContent(payload);
  return NextResponse.json(content);
}
