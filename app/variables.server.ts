import invariant from 'tiny-invariant';

const MAYBE_SESSION_SECRET = process.env.SESSION_SECRET;
const MAYBE_SUPABASE_API_URL = process.env.SUPABASE_API_URL;
const MAYBE_SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const MAYBE_SUPABASE_SECRET_SERVICE_ROLE =
  process.env.SUPABASE_SECRET_SERVICE_ROLE;
const MAYBE_SUPABASE_E2ETEST_USERMAIL = process.env.SUPABASE_E2ETEST_USERMAIL;
const MAYBE_SUPABASE_E2ETEST_PASSWORD = process.env.SUPABASE_E2ETEST_PASSWORD;

invariant(typeof MAYBE_SESSION_SECRET === 'string', 'SESSION_SECRET required');
invariant(
  typeof MAYBE_SUPABASE_API_URL === 'string',
  'SUPABASE_API_URL required'
);
invariant(
  typeof MAYBE_SUPABASE_ANON_KEY === 'string',
  'SUPABASE_ANON_KEY required'
);
invariant(
  typeof MAYBE_SUPABASE_SECRET_SERVICE_ROLE === 'string',
  'SUPABASE_SECRET_SERVICE_ROLE required'
);
invariant(
  typeof MAYBE_SUPABASE_E2ETEST_USERMAIL === 'string',
  'SUPABASE_E2ETEST_USERMAIL required'
);
invariant(
  typeof MAYBE_SUPABASE_E2ETEST_PASSWORD === 'string',
  'SUPABASE_E2ETEST_PASSWORD required'
);

export const SESSION_SECRET = MAYBE_SESSION_SECRET as string;
export const SUPABASE_API_URL = MAYBE_SUPABASE_API_URL as string;
export const SUPABASE_ANON_KEY = MAYBE_SUPABASE_ANON_KEY as string;
export const SUPABASE_SECRET_SERVICE_ROLE =
  MAYBE_SUPABASE_SECRET_SERVICE_ROLE as string;
export const SUPABASE_E2ETEST_USERMAIL =
  MAYBE_SUPABASE_E2ETEST_USERMAIL as string;
export const SUPABASE_E2ETEST_PASSWORD =
  MAYBE_SUPABASE_E2ETEST_PASSWORD as string;
