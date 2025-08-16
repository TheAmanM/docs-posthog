// src/app/api/event/route.ts
import { NextRequest, NextResponse } from "next/server";

const POSTHOG_HOST = "https://us.i.posthog.com";

function setCorsHeaders(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Request-Method", "*");
  response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS, GET");
  response.headers.set("Access-Control-Allow-Headers", "*");

  return response;
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  // IMPORTANT: We are explicitly forwarding to the /batch endpoint
  const posthogResponse = await fetch(`${POSTHOG_HOST}/batch`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  // Send the response from PostHog back to the client
  const data = await posthogResponse.json();
  const response = NextResponse.json(data);

  return setCorsHeaders(response);
}

export const GET = () => {
  const response = NextResponse.json({ message: "GET request received" });
  return setCorsHeaders(response);
};

export const OPTIONS = () => {
  return NextResponse.json(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS, GET",
      "Access-Control-Allow-Headers": "*",
    },
  });
};
