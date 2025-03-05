// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// -- This is a parent command --
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login');
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
});

// -- This is a child command --
Cypress.Commands.add('checkHabitExists', { prevSubject: true }, (subject, habitName) => {
  cy.wrap(subject).should('contain', habitName);
});

// -- This is a dual command --
Cypress.Commands.add('completeHabit', (habitName) => {
  cy.contains(habitName)
    .parents('.habit-item')
    .within(() => {
      cy.get('.complete-button').click();
    });
});

// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... }) 