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

    cy.wait(3000)

    cy.get('[data-cy="meetingId"]').then(element => {
      // store the button's text

      const meetingId = element.text()

      cy.get('[data-cy="back-btn"]').click()

      cy.wait(500)

      cy.get('[data-cy="/feedback"]').click()

      cy.get('.meeting-id-input').type(meetingId)

      cy.wait(1000)
    })

    cy.get('[data-cy="submit"').click()

    cy.wait(200)

    answerQuestions()

    cy.get('[data-cy="overlay-text"]').contains('Tak for din besvarelse')
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

    answerQuestions()

    cy.get('[data-cy="overlay-text"]').contains('Tak for din besvarelse')
  })
})

const answerQuestions = () => {
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
}
