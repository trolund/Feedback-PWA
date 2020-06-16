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
    cy.fixture('test-user-data.json').then(users => {
      const { admin } = users
      ;(cy as any).login(admin)
      // the more option should be present in the menu
      cy.get('nav')
        .find('a[href="/more"]')
        .should('be.visible')
    })
    cy.wait(500)
    ;(cy as any).logout()
  })

  it('Login with VAdmin user', () => {
    cy.fixture('test-user-data.json').then(users => {
      const { vadmin } = users
      ;(cy as any).login(vadmin)
      // the more option should be present in the menu
      cy.get('nav')
        .find('a[href="/more"]')
        .should('be.visible')
    })
    cy.wait(500)
    ;(cy as any).logout()
  })

  it('Login with facilitator user', () => {
    cy.fixture('test-user-data.json').then(users => {
      const { facilitator } = users
      ;(cy as any).login(facilitator)
      // the more option should be present in the menu
      cy.get('nav')
        .find('a[href="/more"]')
        .should('not.be.visible')
    })
    cy.wait(500)
    ;(cy as any).logout()
  })
})

export {} // to fake export for lint rule

// const login = (user: any) => {
//   // login procedure
//   cy.get('input#email').type(user.email)
//   cy.get('input#password').type(user.password)

//   cy.get('#submit').click()

//   // wait for confimation of login and redirect
//   cy.wait(2200)

//   // should be redirected to the home page after login
//   cy.location('pathname').should('eq', '/home')

//   // check token with JWT is set
//   cy.getCookie('token').should('exist')
// }

// const logout = () => {
//   cy.visit('/profile')
//   cy.wait(200)
//   cy.get('[cy-data="logout-btn"]').click()
//   cy.wait(200)
//   cy.getCookie('token').should('not.exist')
//   cy.location('pathname').should('eq', '/login')
// }
