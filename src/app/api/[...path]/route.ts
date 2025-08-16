// src/app/api/[...path]/route.ts
import { NextRequest } from "next/server";

const POSTHOG_HOST = "https://us.i.posthog.com";

// This is the handler for the actual data requests (POST and GET)
async function handler(req: NextRequest) {
  const path = req.nextUrl.pathname.replace("/api", "");
  const searchParams = req.nextUrl.search;
  const url = `${POSTHOG_HOST}${path}${searchParams}`;

  const requestHeaders = new Headers(req.headers);
  requestHeaders.delete("host");
  requestHeaders.delete("origin");
  requestHeaders.delete("referer");

  // Forward the request to PostHog
  const posthogResponse = await fetch(url, {
    method: req.method,
    headers: requestHeaders,
    body: req.body,
  });

  // Create a new set of headers for the response we send back to the browser.
  const responseHeaders = new Headers();

  // Copy the Content-Type from PostHog's response
  const contentType = posthogResponse.headers.get("Content-Type");
  if (contentType) {
    responseHeaders.set("Content-Type", contentType);
  }

  // Add the crucial CORS headers
  responseHeaders.set(
    "Access-Control-Allow-Origin",
    "https://amanmeherally.com"
  );
  responseHeaders.set("Access-Control-Allow-Credentials", "true");

  // Return a new response with the body from PostHog and our custom headers
  return new Response(posthogResponse.body, {
    status: posthogResponse.status,
    headers: responseHeaders,
  });
}

// This is the handler for the preflight OPTIONS request
export async function OPTIONS(request: NextRequest) {
  const headers = new Headers();
  headers.set("Access-Control-Allow-Origin", "https://amanmeherally.com");
  headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Baggage, Sentry-Trace"
  );
  headers.set("Access-Control-Allow-Credentials", "true");

  // A successful preflight response must have a 204 status code and no body
  return new Response(null, {
    status: 204,
    headers: headers,
  });
}

export { handler as GET, handler as POST };
