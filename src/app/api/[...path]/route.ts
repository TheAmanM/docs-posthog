// src/app/api/[...path]/route.ts

import { NextRequest, NextResponse } from "next/server";

// Set the PostHog server URL
const POSTHOG_HOST = "https://us.i.posthog.com";

async function handler(req: NextRequest) {
  // Get the path and search params from the incoming request
  const path = req.nextUrl.pathname.replace("/api", "");
  const searchParams = req.nextUrl.search;

  // Construct the full URL to forward the request to
  const url = `${POSTHOG_HOST}${path}${searchParams}`;

  // Create a new request to PostHog, copying over the body and headers
  const posthogRequest = new NextRequest(url, {
    method: req.method,
    headers: req.headers,
    body: req.body,
    duplex: "half", // Required for streaming request bodies
  });

  try {
    // Await the response from PostHog
    const response = await fetch(posthogRequest);
    return response;
  } catch (error) {
    console.error("Error forwarding request to PostHog:", error);
    return new NextResponse("Error forwarding request", { status: 500 });
  }
}

// Export the handler for both GET and POST methods
export { handler as GET, handler as POST };
