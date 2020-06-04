/// <reference types="cypress">

import devices from '../fixtures/deviceConstants'

context('Delete and validate meeting', () => {
  beforeEach(() => {
    const { height, width } = devices.iphone
    cy.viewport(width, height)
    cy.fixture('test-user-data.json').then(users => {
      const { facilitator } = users
      ;(cy as any).login(facilitator.email, facilitator.password)
    })
  })

  it('Validate loaded', () => {
    cy.get('[data-cy="/calendar"]').click()
    cy.wait(2000)
    cy.get('.fc-today:visible')
      .first()
      .click({ force: true })
    cy.wait(2000)
    cy.get('[data-cy="meeting-list"] li')
      .last()
      .click()

    cy.get('[data-cy="meetingId"]').should('exist')
    cy.get('[data-cy="questionSet"]').should('exist')
    cy.get('[data-cy="eventName"]').should('exist')
    cy.get('[data-cy="discription"]').should('exist')
  })

  it('Meeting delete', () => {
    cy.get('[data-cy="/calendar"]').click()
    cy.wait(2000)
    cy.get('.fc-today:visible')
      .first()
      .click({ force: true })
    cy.wait(2000)
    cy.get('[data-cy="meeting-list"] li')
      .last()
      .click()

    cy.get('[data-cy="meeting-delete"]').click()
    cy.wait(200)
    cy.get('[data-cy="ok-btn"]').click()

    cy.wait(200)

    cy.location('pathname', { timeout: 10000 }).should('include', '/calendar')
  })
})
