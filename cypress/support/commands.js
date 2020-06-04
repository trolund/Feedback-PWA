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
Cypress.Commands.add("login", (email, password) => {
    const pageLocation = '/login'
    const { isLocal, frontendLocal, frontendRemote } = Cypress.env()
    isLocal
        ? cy.visit(`${frontendLocal}${pageLocation}`)
        : cy.visit(`${frontendRemote}${pageLocation}`)

    // login procedure
    cy.get('input#email').type(email)
    cy.get('input#password').type(password)

    cy.get('#submit').click()

    // wait for confimation of login and redirect
    cy.location('pathname', { timeout: 10000 }).should('include', '/home')
})
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
