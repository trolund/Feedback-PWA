/// <reference types="cypress">

import devices from '../fixtures/deviceConstants'

context('Login', () => {
  beforeEach(() => {
    const pageLocation = '/login'
    const { isLocal, frontendLocal, frontendRemote } = Cypress.env()
    isLocal
      ? cy.visit(`${frontendLocal}${pageLocation}`)
      : cy.visit(`${frontendRemote}${pageLocation}`)

    const { height, width } = devices.iphone
    cy.viewport(width, height)
  })
  it('Login with Admin user', () => {
    // login procedure
    cy.get('input#email').type('admin@spinoff.com')
    cy.get('input#password').type('Spinoff1234')

    cy.get('#submit').click()

    // wait for confimation of login and redirect
    cy.wait(2500)

    // should be redirected to the home page after login
    cy.location('pathname').should('eq', '/home')

    // check token with JWT is set
    cy.getCookie('token').should('exist')

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

    // check token with JWT is set
    cy.getCookie('token').should('exist')

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

    // check token with JWT is set
    cy.getCookie('token').should('exist')

    // the more option should be present in the menu
    cy.get('nav')
      .find('a[href="/more"]')
      .should('not.be.visible')
  })
})

export {} // to fake export for lint rule

const login = () => {
  cy.get('input#email').type('admin@spinoff.com')
  cy.get('input#password').type('Spinoff1234')

  cy.get('#submit').click()

  // wait for confimation of login and redirect
  cy.wait(2500)
}
