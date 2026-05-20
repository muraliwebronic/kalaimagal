import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

/**
 * Edge middleware — protects /account/* and /admin/*.
 *
 * Notes:
 * - Edge runtime can't use Prisma, so this only verifies the JWT signature
 *   and exp. Session revocation is enforced inside lib/auth.ts (getCurrentUser),
 *   which API routes + server components use on every request.
 * - On missing/invalid access token, the response is a redirect to /login
 *   (preserving the original path via ?next=).
 * - The middleware does NOT attempt to refresh — that's a client/server-route
 *   concern. If the access token is expired the page will redirect; the user
 *   can re-login (refresh-token rotation lives in /api/auth/refresh).
 */

const PROTECTED_USER_PREFIXES = ["/account"];
const PROTECTED_ADMIN_PREFIXES = ["/admin"];
const ADMIN_LOGIN_PATH = "/admin/login";
const USER_LOGIN_PATH = "/login";
const COOKIE_ACCESS = "kalaimagal_at";

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");
  return new TextEncoder().encode(secret);
}

async function verify(token: string) {
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      issuer: "kalaimagal",
      audience: "kalaimagal-app",
    });
    return payload as { sub?: string; sid?: number; role?: string; email?: string };
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdmin = PROTECTED_ADMIN_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
  const isUser = PROTECTED_USER_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  if (!isAdmin && !isUser) return NextResponse.next();

  // Admin login page itself must be reachable without auth
  if (pathname === ADMIN_LOGIN_PATH) return NextResponse.next();

  const token = req.cookies.get(COOKIE_ACCESS)?.value;
  const claims = token ? await verify(token) : null;

  if (!claims) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = isAdmin ? ADMIN_LOGIN_PATH : USER_LOGIN_PATH;
    loginUrl.search = `?next=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(loginUrl);
  }

  if (isAdmin) {
    const role = claims.role;
    if (role !== "ADMIN" && role !== "SUPER_ADMIN" && role !== "EDITOR") {
      // Authenticated but not authorized — bounce to home rather than login loop
      const home = req.nextUrl.clone();
      home.pathname = "/";
      home.search = "";
      return NextResponse.redirect(home);
    }
  }

  // Attach user header so server components can read it cheaply if they want
  const res = NextResponse.next();
  res.headers.set("x-user-id", String(claims.sub ?? ""));
  res.headers.set("x-user-role", String(claims.role ?? ""));
  return res;
}

export const config = {
  matcher: [
    "/account/:path*",
    "/admin/:path*",
  ],
};
