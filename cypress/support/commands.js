// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('goToHomePage', () => {
  cy.visit('http://localhost:3000');
});

Cypress.Commands.add('login', () => {
  cy.goToHomePage();
  cy.clearLocalStorage();

  Cypress.log({
    displayName: 'login',
    message: `Signing in as ${Cypress.env('auth_user')}`,
  });

  cy.request('POST', 'http://localhost:9000/api/users/login', {
    user: Cypress.env('auth_user'),
    password: Cypress.env('auth_password'),
  })
  .its('body')
  .then(({token}) => {
    cy.window()
    .then((win) => {
      win.localStorage.setItem(
        `auth_token`,
        token,
      );
      cy.reload();
    });
  })
})