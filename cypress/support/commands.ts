import { createClient } from '@supabase/supabase-js';
import { JSDOM } from 'jsdom';

interface Email {
  id: string;
  from: string;
  subject: string;
  date: string;
}

declare global {
  namespace Cypress {
    interface Chainable {
      createUser: typeof createUser;
      deleteUser: typeof deleteUser;
      cleanupUser: typeof cleanupUser;
      login: typeof login;
      getRandomEmail: typeof getRandomEmail;
      getEmailVerification: typeof getEmailVerification;
    }
  }
}

const supabase = createClient(
  Cypress.env('SUPABASE_API_URL'),
  Cypress.env('SUPABASE_SECRET_SERVICE_ROLE')
);

function login(user: { email: string; password: string }, redirectTo?: string) {
  cy.get('input#email').type(`{selectAll}${user.email!}`);
  cy.get('input#password').type(`{selectAll}${user.password!}`);

  cy.get('button[type="submit"]').click();

  // supabase.auth.api.setAuthCookie()

  cy.wait(5000);

  cy.getCookie('__session').should('exist');

  redirectTo && cy.visit(redirectTo);
}

async function createUser({
  email,
  password
}: {
  email: string;
  password: string;
}) {
  if (!email) {
    throw new Error('email required for login');
  }
  if (!email.endsWith('@example.com')) {
    throw new Error('All test emails must end in @example.com');
  }

  const { user, error } = await supabase.auth.api.createUser({
    email: email,
    password: password,
    email_confirm: true
  });

  if (error) {
    console.error('Error while creating user', error, user);
    throw new Error('User not created' + error.message);
  }

  return user;
}

async function deleteUser(id: string) {
  if (!id) {
    throw new Error('id required to delete user');
  }

  const { data: user, error } = await supabase.auth.api.deleteUser(id);

  if (error || !user) {
    throw new Error('User not deleted');
  }

  return !!user;
}

function cleanupUser(id: string) {
  deleteUser(id).then(() => {
    cy.clearCookie('__session');
  });
}

function getRandomEmail() {
  return cy
    .request('POST', 'https://api.disposablemailbox.com/mailboxes')
    .then(({ body }: { body: { code: string; mailbox: string } }) => {
      const email = body.mailbox;
      cy.log(`Generated random email: ${email}`, body);

      return Promise.resolve(email);
    });
}

function getEmailVerification(email: string) {
  cy.log(Cypress.env('SUPABASE_SECRET_SERVICE_ROLE'));
  return cy
    .request(`https://api.disposablemailbox.com/mailboxes/${email}`)
    .then(
      ({
        body
      }: {
        body: {
          code: string;
          messages: {
            message_id: string;
            subject_line: string;
            snippet_preview: string;
            received_at: number;
          }[];
        };
      }): Promise<string> => {
        const verificationMail = body?.messages?.find((e) =>
          e.subject_line.includes('Confirm your signup')
        );
        cy.log(JSON.stringify(body));
        if (verificationMail && verificationMail.message_id) {
          cy.request(
            `https://api.disposablemailbox.com/messages/${verificationMail.message_id}`
          ).then(
            ({
              body
            }: {
              body: {
                code: string;
                data: {
                  message_id: string;
                  disposable_mailbox: string;
                  from: string;
                  to: string[];
                  cc: string[];
                  bcc: string;
                  snippet_preview: string;
                  subject_line: string;
                  body_text: string;
                  body_html: string;
                  received_at: number;
                  scheduled_to_delete: number;
                  attachments: any[];
                };
              };
            }) => {
              const dom = new JSDOM(body.data.body_html);
              const confirmAnchor =
                dom.window.document.getElementsByTagName('a')[0];
              cy.request(confirmAnchor.href).then(() => {
                return Promise.resolve(email);
              });
            }
          );
        } else {
          return Promise.reject('No email found');
        }

        return Promise.resolve('');
      }
    );
}

Cypress.Commands.add('createUser', createUser);
Cypress.Commands.add('deleteUser', deleteUser);
Cypress.Commands.add('cleanupUser', cleanupUser);
Cypress.Commands.add('login', login);
Cypress.Commands.add('getEmailVerification', getEmailVerification);
Cypress.Commands.add('getRandomEmail', getRandomEmail);

/*
eslint
  @typescript-eslint/no-namespace: "off",
*/
