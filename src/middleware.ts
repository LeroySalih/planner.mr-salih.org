// src/middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Public routes (no auth required). Add/remove as needed.
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  // "/assignment-tracker-test(.*)", // uncomment if that area is public
]);

export default clerkMiddleware(async (auth, req) => {
  // Protect everything that isn't public
  if (!isPublicRoute(req)) {
    await auth.protect(); // NOTE: no parentheses on `auth`
  }
});

export const config = {
  matcher: [
    // Skip _next and static assets
    "/((?!_next|.*\\..*).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};
