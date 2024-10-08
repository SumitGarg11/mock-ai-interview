import { clerkMiddleware,createRouteMatcher } from "@clerk/nextjs/server";



const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/forum(.*)'
])

export default clerkMiddleware((auth, req) => {
  // Restrict admin routes to users with specific permissions
  if (isProtectedRoute(req))  auth().protect();
  
})

export const config = {
  matcher: ['/dashboard', '/(api|trpc)(.*)'],

  // matcher: ['/,'/(api|trpc)(.*)'],
};