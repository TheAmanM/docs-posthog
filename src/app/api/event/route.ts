// src/app/api/event/route.ts
import { NextRequest, NextResponse } from "next/server";

const POSTHOG_HOST = "https://us.i.posthog.com";

export async function POST(req: NextRequest) {
  const body = await req.json();

  // IMPORTANT: We are explicitly forwarding to the /batch endpoint
  const response = await fetch(`${POSTHOG_HOST}/batch`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  // Send the response from PostHog back to the client
  const data = await response.json();
  return NextResponse.json(data);
}
