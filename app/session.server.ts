import { createCookieSessionStorage, redirect } from '@remix-run/node';
import { Session, User } from '@supabase/supabase-js';
import { SESSION_SECRET } from './variables.server';

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '__session',
    httpOnly: true,
    maxAge: 0,
    path: '/',
    sameSite: 'lax',
    secrets: [SESSION_SECRET],
    secure: process.env.NODE_ENV ? process.env.NODE_ENV === 'production' : true
  }
});

export async function getSession(request: Request) {
  const cookie = request.headers.get('Cookie');
  return sessionStorage.getSession(cookie);
}

export async function getSbSession(
  request: Request
): Promise<Session | undefined> {
  const session = await getSession(request);
  const sbSession = session.get('session');
  return sbSession;
}

export async function getUser(request: Request): Promise<null | User> {
  const session = await getSbSession(request);
  if (session === undefined) return null;

  if (session.user) return session.user;

  throw await logout(request);
}

export async function requireSession(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
): Promise<Session> {
  const session = await getSbSession(request);
  if (!session) {
    const searchParams = new URLSearchParams([['redirectTo', redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return session;
}

export async function requireUser(request: Request) {
  const session = await requireSession(request);

  if (session.user) return session.user;

  throw await logout(request);
}

export async function createUserSession({
  request,
  session,
  remember,
  redirectTo
}: {
  request: Request;
  session: Session;
  remember: boolean;
  redirectTo: string;
}) {
  const sessionCookie = await getSession(request);
  sessionCookie.set('session', session);
  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await sessionStorage.commitSession(sessionCookie, {
        maxAge: remember
          ? 60 * 60 * 24 * 7 // 7 days
          : undefined
      })
    }
  });
}

export async function logout(request: Request) {
  const session = await getSession(request);
  return redirect('/', {
    headers: {
      'Set-Cookie': await sessionStorage.destroySession(session)
    }
  });
}
