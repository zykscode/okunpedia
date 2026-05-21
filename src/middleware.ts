import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { detectBot } from '@arcjet/next';
import arcjet from '@/libs/Arcjet';

const aj = arcjet.withRule(
  detectBot({
    mode: 'LIVE',
    allow: [
      'CATEGORY:SEARCH_ENGINE',
      'CATEGORY:PREVIEW',
      'CATEGORY:MONITOR',
    ],
  }),
);

export default auth(async (req) => {
  // 1. Verify the request with Arcjet WAF bot rules
  if (process.env.ARCJET_KEY) {
    const decision = await aj.protect(req);

    if (decision.isDenied()) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  }

  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isProtectedRoute = nextUrl.pathname.startsWith('/dashboard') || nextUrl.pathname.startsWith('/admin');

  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL('/sign-in', nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  // Match all pathnames except for
  // - … if they start with `/_next`, `/_vercel` or `monitoring`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!_next|_vercel|monitoring|api|.*\\..*).*)',
};
