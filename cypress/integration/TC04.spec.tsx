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
    cy.get('[data-cy="/calendar"]').click()
    cy.wait(2000)
    cy.get('.fc-today:visible')
      .first()
      .click({ force: true })
    cy.wait(2000)
    cy.get('[data-cy="meeting-list"] li')
      .last()
      .click()
    cy.get('[data-cy="feedback-link"]').click()
    cy.wait(300)
    cy.get('[data-cy="scale-0"]:visible').click()
    cy.get('[data-cy="scale-1"]:visible').click()
    cy.get('[data-cy="scale-2"]:visible').click()
    cy.get('[data-cy="scale-3"]:visible').click()

    cy.get('[data-cy="next"]:visible').click()
    cy.wait(500)

    cy.get('[data-cy="scale-3"]:visible').click()

    cy.get('[data-cy="next"]:visible').click()
    cy.wait(500)

    cy.get('[data-cy="scale-3"]:visible').click()
    cy.get('[data-cy="next"]:visible').click()
    cy.wait(500)

    cy.get('[data-cy="scale-3"]:visible').click()
    cy.get('[data-cy="next"]:visible').click()
    cy.wait(500)

    cy.get('[data-cy="scale-3"]:visible').click()
    cy.get('[data-cy="next"]:visible').click()
    cy.wait(500)

    cy.get('[data-cy="scale-3"]:visible').click()
    cy.get('[data-cy="next"]:visible').click()
    cy.wait(500)

    cy.get('[data-cy="scale-3"]:visible').click()
    cy.get('[data-cy="next"]:visible').click()
    cy.wait(500)

    cy.get('[data-cy="overlay-text"]').contains('Tak for din besvarelse')
  })
})
