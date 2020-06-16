/// <reference types="cypress">

import devices from '../fixtures/deviceConstants'
import {
  getId,
  addDay,
  getIdByDay,
  deleteMeeting,
  deleteMeetingDate
} from '../fixtures/meetingHelper'

context('Deliver feedback', () => {
  beforeEach(() => {
    const { height, width } = devices.iphone
    cy.viewport(width, height)
    cy.fixture('test-user-data.json').then(users => {
      const { facilitator } = users
      ;(cy as any).login(facilitator)
    })
  })

  it('Meeting loaded and is open for feedback', () => {
    cy.get('nav > div > a[data-cy="/calendar"]').click()

    cy.location('pathname', { timeout: 10000 }).should('include', '/calendar')

    cy.get('[data-cy="add-meeting-btn"]').click()

    cy.wait(600)
    cy.get('[data-cy="questionset-selector"] > .select-css > select').select(
      'Foredrag'
    )

    cy.get('[data-cy=meeting-name] > div > input').type(
      'test meeting' + Date.now().toFixed(5)
    )

    cy.get('[data-cy=meeting-end-time]').click()
    cy.get('.datepicker-col-1:visible') // hours col
      .first()
      .trigger('mousedown')
      .trigger('mousemove', { which: 1, pageX: 600, pageY: 50 })
      .trigger('mouseup')

    cy.get('body').click()

    cy.wait(500)

    cy.get('[data-cy=create-meeting-btn]').click()
    cy.wait(200)
    cy.get('.toast').contains('er nu oprettet')

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

  it('Shoud say that you only can give feedback once', () => {
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

    cy.wait(1000)

    cy.get('.msg').contains('Man kan kun give feedback en gang')
  })

  it('should not exist', () => {
    const pageLocation = '/feedback/IkkeEtMødeID'
    const { isLocal, frontendLocal, frontendRemote } = Cypress.env()
    isLocal
      ? cy.visit(`${frontendLocal}${pageLocation}`)
      : cy.visit(`${frontendRemote}${pageLocation}`)

    cy.wait(1000)

    cy.get('.msg').contains('Mødet blev ikke fundet')
  })

  it('should not be open', () => {
    ;(cy as any).goto('/calendar')
    cy.wait(2000)

    cy.location('pathname', { timeout: 10000 }).should('include', '/calendar')

    cy.get('[data-cy="add-meeting-btn"]').click()

    cy.wait(600)
    cy.get('[data-cy="questionset-selector"] > .select-css > select').select(
      'Foredrag'
    )

    const meetingName = 'test meeting' + Date.now().toPrecision(3)

    cy.get('[data-cy=meeting-name] > div > input').type(meetingName)

    cy.get('[data-cy=meeting-end-time]').click()
    cy.get('.datepicker-col-1:visible') // hours col
      .first()
      .trigger('mousedown')
      .trigger('mousemove', { which: 1, pageX: 600, pageY: 50 })
      .trigger('mouseup')

    cy.get('body').click()

    cy.wait(500)

    addDay()

    cy.wait(500)

    cy.get('[data-cy=create-meeting-btn]').click()
    cy.wait(200)
    cy.get('.toast').contains('er nu oprettet')

    const date = new Date()
    date.setDate(date.getDate() + 1)

    const meetingId = getIdByDay(meetingName, date)
    ;(cy as any).goto(`/feedback/${meetingId}`)
    cy.get('.msg').contains('Mødet er ikke åben')

    deleteMeetingDate(name, date)
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
