Cypress.Commands.add("login", (user) => {
    const pageLocation = '/login'
    const { isLocal, frontendLocal, frontendRemote } = Cypress.env()
    isLocal
        ? cy.visit(`${frontendLocal}${pageLocation}`)
        : cy.visit(`${frontendRemote}${pageLocation}`)

    // login procedure
    cy.get('input#email').type(user.email)
    cy.get('input#password').type(user.password)

    cy.get('#submit').click()

    cy.wait(2000)

    // wait for confimation of login and redirect
    cy.location('pathname', { timeout: 10000 }).should('include', '/home')

    // check the cookie have be set
    // cy.getCookie('token').should('exist')
})

Cypress.Commands.add("logout", () => {
    goto("/profile")
    cy.wait(200)
    cy.get('[cy-data="logout-btn"]').click()
    cy.wait(200)
    cy.getCookie('token').should('not.exist')
    cy.location('pathname').should('eq', '/login')
})

Cypress.Commands.add("goto", (pageLocation) => {
    goto(pageLocation)
})

const goto = (pageLocation) => {
    const { isLocal, frontendLocal, frontendRemote } = Cypress.env()
    isLocal
        ? cy.visit(`${frontendLocal}${pageLocation}`)
        : cy.visit(`${frontendRemote}${pageLocation}`)
}


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
