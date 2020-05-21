/// <reference types="cypress" />

context('Location', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/registration')
  })

  it('cy.location() - get window.location', () => {
    // https://on.cypress.io/location
    cy.get('input#firstname').type('Troels')
    cy.get('input#lastname').type('Lund')
    cy.get('input#email').type('trolund@gmail.com')
    cy.get('input#phone').type('29456660')
    cy.get('input#password').type('Test1234')
    cy.get('input#passworda').type('Test1234')

    // cy.get('input.oldCompanybtn').click({ force: true })

    cy.get('input#companyid').type('1')
    cy.get('#accept').click()
    cy.get('#submit').click()
  })
})
