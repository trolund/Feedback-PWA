/// <reference types="cypress">

context('Login', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/login')
  })
  it('Login with Admin user', () => {
    // login procedure
    cy.get('input#email').type('admin@spinoff.com')
    cy.get('input#password').type('Spinoff1234')

    cy.get('#submit').click()

    // wait for confimation of login and redirect
    cy.wait(2200)

    // should be redirected to the home page after login
    cy.location('pathname').should('eq', '/home')

    // the more option should be present in the menu
    cy.get('nav')
      .find('a[href="/more"]')
      .should('be.visible')
  })

  it('Login with VAdmin user', () => {
    // login procedure
    cy.get('input#email').type('vadmin@spinoff.com')
    cy.get('input#password').type('Spinoff1234')

    cy.get('#submit').click()

    // wait for confimation of login and redirect
    cy.wait(2200)

    // should be redirected to the home page after login
    cy.location('pathname').should('eq', '/home')

    // the more option should be present in the menu
    cy.get('nav')
      .find('a[href="/more"]')
      .should('be.visible')
  })

  it('Login with facilitator user', () => {
    // login procedure
    cy.get('input#email').type('facilitator@spinoff.com')
    cy.get('input#password').type('Spinoff1234')

    cy.get('#submit').click()

    // wait for confimation of login and redirect
    cy.wait(2200)

    // should be redirected to the home page after login
    cy.location('pathname').should('eq', '/home')

    // the more option should be present in the menu
    cy.get('nav')
      .find('a[href="/more"]')
      .should('not.be.visible')
  })
})

export {} // to fake export for lint rule
