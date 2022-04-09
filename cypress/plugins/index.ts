import {
  SESSION_SECRET,
  SUPABASE_ANON_KEY,
  SUPABASE_API_URL,
  SUPABASE_SECRET_SERVICE_ROLE,
  SUPABASE_E2ETEST_USERMAIL,
  SUPABASE_E2ETEST_PASSWORD
} from '~/variables.server';

require('dotenv').config();

module.exports = (
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions
) => {
  const isDev = config.watchForFileChanges;
  const port = process.env.PORT ?? (isDev ? '3000' : '8811');
  const configOverrides: Partial<Cypress.PluginConfigOptions> = {
    baseUrl: `http://localhost:${port}`,
    integrationFolder: 'cypress/e2e',
    video: !process.env.CI,
    screenshotOnRunFailure: !process.env.CI
  };
  Object.assign(config, configOverrides);

  // environment variables
  config.env.SESSION_SECRET = SESSION_SECRET;
  config.env.SUPABASE_ANON_KEY = SUPABASE_ANON_KEY;
  config.env.SUPABASE_API_URL = SUPABASE_API_URL;
  config.env.SUPABASE_SECRET_SERVICE_ROLE = SUPABASE_SECRET_SERVICE_ROLE;
  config.env.SUPABASE_E2ETEST_USERMAIL = SUPABASE_E2ETEST_USERMAIL;
  config.env.SUPABASE_E2ETEST_PASSWORD = SUPABASE_E2ETEST_PASSWORD;

  // To use this:
  // cy.task('log', whateverYouWantInTheTerminal)
  on('task', {
    log(message) {
      console.log(message);
      return null;
    }
  });

  return config;
};
