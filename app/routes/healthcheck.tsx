// learn more: https://fly.io/docs/reference/configuration/#services-http_checks
import type { LoaderFunction } from '@remix-run/node';

import { getUser } from '~/session.server';

export const loader: LoaderFunction = async ({ request }) => {
  const host =
    request.headers.get('X-Forwarded-Host') ?? request.headers.get('host');

  try {
    // if we can connect to the database and make a simple query
    const user = await getUser(request);
    // and make a HEAD request to ourselves, then we're good.
    const url = new URL('/', `http://${host}`);
    await fetch(url.toString(), { method: 'HEAD' }).then((r) => {
      if (!r.ok) return Promise.reject(r);
    });

    return new Response('OK');
  } catch (error: unknown) {
    console.log('healthcheck ❌', { error });
    return new Response('ERROR', { status: 500 });
  }
};
