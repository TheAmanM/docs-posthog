// src/app/api/[...path]/route.ts
import { NextRequest, NextResponse } from "next/server";

const POSTHOG_HOST = "https://us.i.posthog.com";

function setCorsHeaders(response: NextResponse | Response) {
  const newHeaders = new Headers(response.headers);
  newHeaders.set("Access-Control-Allow-Origin", "*");
  newHeaders.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  newHeaders.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Baggage, Sentry-Trace"
  );
  return newHeaders;
}

async function handler(req: NextRequest) {
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
  const response = new Response(posthogResponse.body, {
    status: posthogResponse.status,
    statusText: posthogResponse.statusText,
    headers: posthogResponse.headers,
  });

  // Apply your CORS headers to the response
  const finalHeaders = setCorsHeaders(response);

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: finalHeaders,
  });
}

export async function OPTIONS() {
  // Create a new response for the preflight request
  const response = new NextResponse(null, { status: 204 });
  // Apply your CORS headers to the preflight response
  const finalHeaders = setCorsHeaders(response);
  return new Response(null, { status: 204, headers: finalHeaders });
}

export { handler as GET, handler as POST };
