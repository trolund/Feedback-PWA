/// <reference types="cypress">

import devices from '../fixtures/deviceConstants'

context('Delete and validate meeting', () => {
  beforeEach(() => {
    const { height, width } = devices.iphone
    cy.viewport(width, height)
    cy.fixture('test-user-data.json').then(users => {
      const { facilitator } = users
      ;(cy as any).login(facilitator)
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

  it('delete meeting uden feedback', () => {
    const meetingName = 'The meeting to delete!'

    cy.get('nav > div > a[data-cy="/calendar"]').click()

    cy.location('pathname', { timeout: 10000 }).should('include', '/calendar')

    cy.get('[data-cy="add-meeting-btn"]').click()

    cy.wait(600)
    cy.get('[data-cy="questionset-selector"] > .select-css > select').select(
      'Foredrag'
    )

    cy.get('[data-cy=meeting-name] > div > input').type(meetingName)

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
    cy.wait(1000)
    cy.reload()
    cy.wait(1000)
    cy.get('[data-cy="meeting-list"] li')
      .contains(meetingName)
      .click()
    cy.wait(200)

    cy.get('[data-cy="meeting-delete"]').click()
    cy.wait(200)
    cy.get('[data-cy="ok-btn"]').click()

    cy.wait(200)

    cy.location('pathname', { timeout: 10000 }).should(
      'include',
      '/meeting/day'
    )
  })
})
