import { NextRequest, NextResponse } from "next/server";
import { syncInstagramFeed } from "@/lib/sync-instagram";

// Called daily by Vercel Cron (vercel.json).
// Vercel automatically sends Authorization: Bearer {CRON_SECRET} for cron requests.
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!accessToken) {
    return NextResponse.json(
      { error: "INSTAGRAM_ACCESS_TOKEN env var not set" },
      { status: 500 }
    );
  }

  const result = await syncInstagramFeed(accessToken);
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json(result);
}
