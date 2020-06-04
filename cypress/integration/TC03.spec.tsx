/// <reference types="cypress">

import devices from '../fixtures/deviceConstants'

context('Create meeting', () => {
  beforeEach(() => {
    const { height, width } = devices.iphone
    cy.viewport(width, height)
    cy.fixture('test-user-data.json').then(users => {
      const { facilitator } = users
      ;(cy as any).login(facilitator.email, facilitator.password)
    })
  })

  it('Minimal meeting infomation', () => {
    cy.get('nav > div > a[data-cy="/calendar"]').click()

    cy.location('pathname', { timeout: 10000 }).should('include', '/calendar')

    cy.get('[data-cy="add-meeting-btn"]').click()

    cy.wait(600)
    cy.get('[data-cy="questionset-selector"] > .select-css > select').select(
      'Foredrag ny'
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

    cy.get('[data-cy=create-meeting-btn]').click()
    cy.wait(200)
    cy.get('.toast').contains('er nu oprettet')
  })

  it('Meeting with multiple categories', () => {
    cy.get('nav > div > a[data-cy="/calendar"]').click()

    cy.location('pathname', { timeout: 10000 }).should('include', '/calendar')

    cy.get('[data-cy="add-meeting-btn"]').click()

    cy.wait(600)
    cy.get('[data-cy="questionset-selector"] > .select-css > select').select(
      'Foredrag ny'
    )

    cy.get('[data-cy=meeting-name] > div > input').type(
      'test meeting' + Date.now().toFixed(5)
    )

    cy.get('[data-cy="categories-selector"]').click()
    cy.get('[data-cy="cat-0"]').click('left')
    cy.get('[data-cy="cat-1"]').click('left')

    cy.get('[data-cy="exit-cat-picker"]').click()

    cy.get('[data-cy=meeting-end-time]').click()
    cy.get('.datepicker-col-1:visible') // hours col
      .first()
      .trigger('mousedown')
      .trigger('mousemove', { which: 1, pageX: 600, pageY: 50 })
      .trigger('mouseup')

    cy.get('body').click()

    cy.get('[data-cy=create-meeting-btn]').click()
    cy.wait(200)
    cy.get('.toast').contains('er nu oprettet')
  })

  it('Meeting with multiple categories and description', () => {
    cy.get('nav > div > a[data-cy="/calendar"]').click()

    cy.location('pathname', { timeout: 10000 }).should('include', '/calendar')

    cy.get('[data-cy="add-meeting-btn"]').click()

    cy.wait(600)
    cy.get('[data-cy="questionset-selector"] > .select-css > select').select(
      'Foredrag ny'
    )

    cy.get('[data-cy=meeting-name] > div > input').type(
      'test meeting' + Date.now().toFixed(5)
    )

    cy.get('[data-cy="categories-selector"]').click()
    cy.get('[data-cy="cat-0"]').click('left')
    cy.get('[data-cy="cat-1"]').click('left')

    cy.get('[data-cy="exit-cat-picker"]').click()

    cy.get('[data-cy="comment"] textarea').type('test description')

    cy.get('[data-cy=meeting-end-time]').click()
    cy.get('.datepicker-col-1:visible') // hours col
      .first()
      .trigger('mousedown')
      .trigger('mousemove', { which: 1, pageX: 600, pageY: 50 })
      .trigger('mouseup')

    cy.get('body').click()

    cy.get('[data-cy=create-meeting-btn]').click()
    cy.wait(200)
    cy.get('.toast').contains('er nu oprettet')
  })

  it('Meeting without name - negativ test', () => {
    cy.get('nav > div > a[data-cy="/calendar"]').click()

    cy.location('pathname', { timeout: 10000 }).should('include', '/calendar')

    cy.get('[data-cy="add-meeting-btn"]').click()

    cy.wait(600)
    cy.get('[data-cy="questionset-selector"] > .select-css > select').select(
      'Foredrag ny'
    )

    cy.get('[data-cy="categories-selector"]').click()
    cy.get('[data-cy="cat-0"]').click('left')
    cy.get('[data-cy="cat-1"]').click('left')

    cy.get('[data-cy="exit-cat-picker"]').click()

    cy.get('[data-cy="comment"] textarea').type('test description')

    cy.get('[data-cy=meeting-end-time]').click()
    cy.get('.datepicker-col-1:visible') // hours col
      .first()
      .trigger('mousedown')
      .trigger('mousemove', { which: 1, pageX: 600, pageY: 50 })
      .trigger('mouseup')

    cy.get('body').click()

    cy.get('[data-cy=create-meeting-btn]').click()
    cy.wait(200)
    cy.get('.toast').contains('fejl')
  })

  it('Meeting without date change', () => {
    cy.get('nav > div > a[data-cy="/calendar"]').click()

    cy.location('pathname', { timeout: 10000 }).should('include', '/calendar')

    cy.get('[data-cy="add-meeting-btn"]').click()

    cy.wait(600)
    cy.get('[data-cy="questionset-selector"] > .select-css > select').select(
      'Foredrag ny'
    )

    cy.get('[data-cy="comment"] textarea').type('test description')

    cy.get('[data-cy=meeting-end-time]').click()
    cy.get('.datepicker-col-1:visible') // hours col
      .first()
      .trigger('mousedown')
      .trigger('mousemove', { which: 1, pageX: 600, pageY: 50 })
      .trigger('mouseup')

    cy.get('body').click()

    cy.get('[data-cy=create-meeting-btn]').click()
    cy.wait(200)
    cy.get('.toast').contains('fejl')
  })

  it('Meeting without question set', () => {
    cy.get('nav > div > a[data-cy="/calendar"]').click()

    cy.location('pathname', { timeout: 10000 }).should('include', '/calendar')

    cy.get('[data-cy="add-meeting-btn"]').click()

    cy.wait(600)

    cy.get('[data-cy="comment"] textarea').type('test description')

    cy.get('[data-cy=meeting-end-time]').click()
    cy.get('.datepicker-col-1:visible') // hours col
      .first()
      .trigger('mousedown')
      .trigger('mousemove', { which: 1, pageX: 600, pageY: 50 })
      .trigger('mouseup')

    cy.get('body').click()

    cy.get('[data-cy=create-meeting-btn]').click()
    cy.wait(200)
    cy.get('.toast').contains('fejl')
  })
})
