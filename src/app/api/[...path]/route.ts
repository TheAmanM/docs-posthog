// src/app/api/[...path]/route.ts
import { NextRequest, NextResponse } from "next/server";

const POSTHOG_HOST = "https://us.i.posthog.com";

function setCorsHeaders(response: NextResponse) {
  response.headers.set(
    "Access-Control-Allow-Origin",
    "https://amanmeherally.com"
  );
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Baggage, Sentry-Trace"
  );

  return response;
}

export async function POST(req: NextRequest) {
  const path = req.nextUrl.pathname.replace("/api", "");
  const searchParams = req.nextUrl.search;
  const url = `${POSTHOG_HOST}${path}${searchParams}`;

  const headers = new Headers(req.headers);
  headers.delete("host");

  const posthogResponse = await fetch(url, {
    method: req.method,
    headers: headers,
    body: req.body,
  });

  // Create a new response so we can modify the headers
  const response = new NextResponse(posthogResponse.body, {
    status: posthogResponse.status,
    statusText: posthogResponse.statusText,
    headers: posthogResponse.headers,
  });

  // Apply your CORS headers to the response
  return setCorsHeaders(response);
}

export async function GET() {
  const response = NextResponse.json({ message: "GET request received" });
  return setCorsHeaders(response);
}

export const OPTIONS = () => {
  return NextResponse.json(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "https://amanmeherally.com",
      "Access-Control-Allow-Methods": "POST, OPTIONS, GET",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Headers": "Content-Type, Baggage, Sentry-Trace",
    },
  });
};
