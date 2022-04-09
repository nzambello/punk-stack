import faker from '@faker-js/faker';

describe('smoke tests', () => {
  it('should allow you to sign up', () => {
    let user = {
      email: faker.internet.email(undefined, undefined, 'example.com'),
      password: faker.internet.password(24, true, /[A-Z]/),
      id: ''
    };

    cy.visit('/');
    cy.findByRole('link', { name: /sign up/i }).click();

    cy.get('input#email').type(`{selectAll}${user.email}`);
    cy.get('input#password').type(`{selectAll}${user.password}`);

    cy.get('button[type="submit"]').should('be.disabled');

    cy.get('input#accept_terms').check();
    cy.get('button[type="submit"]').should('not.be.disabled');

    cy.createUser({
      email: faker.internet.email(undefined, undefined, 'example.com'),
      password: faker.internet.password(24)
    }).then((createdUser) => {
      cy.log(createdUser.id);
      user.id = createdUser.id;

      expect(user.id).to.not.be.empty;

      cy.deleteUser(user.id).then((value) => {
        cy.log('deleted', JSON.stringify(value));
        expect(value).to.not.be.null;
      });
    });
  });

  it('should allow you to login and create a note', () => {
    cy.visit('/');
    cy.findByRole('link', { name: /log in/i }).click();

    cy.get('input#email').type(
      `{selectAll}${Cypress.env('SUPABASE_E2ETEST_USERMAIL')}`
    );
    cy.get('input#password').type(
      `{selectAll}${Cypress.env('SUPABASE_E2ETEST_PASSWORD')}`
    );

    cy.get('button[type="submit"]').click();

    cy.wait(5000);

    cy.getCookie('__session').should('exist');

    const testNote = {
      title: faker.lorem.words(1),
      body: faker.lorem.sentences(1)
    };

    cy.url().should('include', '/notes');

    cy.findByRole('link', { name: /\+ new note/i }).click();

    cy.findByRole('textbox', { name: /title/i }).type(testNote.title);
    cy.findByRole('textbox', { name: /body/i }).type(testNote.body);
    cy.findByRole('button', { name: /save/i }).click();

    cy.findByRole('button', { name: /delete/i }).click();

    cy.findByText('No notes yet');
  });
});
