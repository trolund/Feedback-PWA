/// <reference types="cypress">

import devices from '../fixtures/deviceConstants'

context('Deliver feedback', () => {
  beforeEach(() => {
    const { height, width } = devices.iphone
    cy.viewport(width, height)

    cy.fixture('test-user-data.json').then(users => {
      const { facilitator } = users
      ;(cy as any).login(facilitator.email, facilitator.password)
    })
  })

  it('Meeting loaded', () => {
    cy.get('nav > div > a[data-cy="/calendar"]').click()

    cy.location('pathname', { timeout: 10000 }).should('include', '/calendar')

    cy.get('.fc-today').click()

    cy.wait(2000)

    cy.get('[data-cy="meeting-list"] li')
      .last()
      .click()

    cy.get('[data-cy="feedback-link"]').click()
    cy.wait(300)

    cy.get('[data-cy="scale-0"]').click()
    cy.get('[data-cy="scale-1"]').click()
    cy.get('[data-cy="scale-2"]').click()
    cy.get('[data-cy="scale-3"]').click()

    while (cy.get('[data-cy="next"]:visable')) {
      cy.get('[data-cy="next"]:visable').click()
      cy.wait(500)
    }
  })
})

export {} // to fake export for lint rule
