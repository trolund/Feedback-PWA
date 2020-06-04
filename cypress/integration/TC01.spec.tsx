/// <reference types="cypress">

import devices from '../fixtures/deviceConstants'

context('User registration', () => {
  beforeEach(() => {
    const pageLocation = '/registration'
    const { isLocal, frontendLocal, frontendRemote } = Cypress.env()
    isLocal
      ? cy.visit(`${frontendLocal}${pageLocation}`)
      : cy.visit(`${frontendRemote}${pageLocation}`)

    const { height, width } = devices.iphone
    cy.viewport(width, height)
  })

  it('Exsisting firm', () => {
    cy.fixture('test-user-data.json').then(users => {
      const { justCreated } = users
      cy.get('input#firstname').type(justCreated.firstname)
      cy.get('input#lastname').type(justCreated.lastname)
      cy.get('input#email').type(justCreated.email)
      cy.get('input#phone').type(justCreated.phone)
      cy.get('input#password').type(justCreated.password)
      cy.get('input#passworda').type(justCreated.password)

      // cy.get('input.oldCompanybtn').click({ force: true })

      cy.get('input#companyid').type(justCreated.companyId)
      cy.get('#accept').click()
      cy.get('#submit').click()

      cy.wait(600)
      cy.get('.toast').contains('allerede')
    })
  })

  it('New firm', () => {
    cy.fixture('test-user-data.json').then(users => {
      const { justCreated } = users
      cy.get('input#firstname').type(justCreated.firstname)
      cy.get('input#lastname').type(justCreated.lastname)
      cy.get('input#email').type(justCreated.email)
      cy.get('input#phone').type(justCreated.phone)
      cy.get('input#password').type(justCreated.password)
      cy.get('input#passworda').type(justCreated.password)

      cy.get('input.oldCompanybtn').click({ force: true })

      cy.get('input#companyname').type(`new firm ${Date.now()}`)

      cy.get('#accept').click()
      cy.get('#submit').click()

      cy.wait(600)
      cy.get('.toast').contains('allerede')
    })
  })
})

export {} // to fake export for lint rule
