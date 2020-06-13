/// <reference types="cypress">

import devices from '../fixtures/deviceConstants'

context('question sets as admin', () => {
  beforeEach(() => {
    const { height, width } = devices.iphone
    cy.viewport(width, height)
    cy.fixture('test-user-data.json').then(users => {
      const { admin } = users
      ;(cy as any).login(admin.email, admin.password)
    })
    cy.get('[data-cy="/more"]').click()
    cy.get('[data-cy="/questionsets"]').click()
    cy.wait(2000)
  })

  it('add question set', () => {
    cy.get('[data-cy="add-questionset"]').click()
    cy.wait(2000)
    cy.get('.name').type('test')
    cy.get('.button').click()
    cy.get('.button').click()
    cy.get('.button').click()
    cy.get('[data-rbd-droppable-id="list"] li:nth-child(1) input').type('1')
    cy.get('[data-rbd-droppable-id="list"] li:nth-child(2) input').type('2')
    cy.get('[data-rbd-droppable-id="list"] li:nth-child(3) input').type('3')
    cy.get('.float-right > svg').click()
  })

  it('modifi question set', () => {
    cy.get('ul')
      .find('li')
      .find('.name')
      .contains('test')
      .first()
      .click()
    cy.wait(3000)
    cy.get('.name').clear()
    cy.get('.name').type('test modified')

    cy.get('[data-rbd-droppable-id="list"] li:nth-child(1) input')
      .clear()
      .type('1 modified')
    cy.get('[data-rbd-droppable-id="list"] li:nth-child(2) input')
      .clear()
      .type('2 modified')
    cy.get(
      '[data-rbd-droppable-id="list"] li:nth-child(3) svg:last-child'
    ).click()
    cy.get('.float-right > svg').click()
    cy.get('.toast').contains('opdateret')

    cy.get('.back-icon').click()

    cy.wait(3000)

    cy.get('ul')
      .find('li')
      .find('.name')
      .contains('test modified')
      .first()
      .click()

    // check all values has been updated
    cy.get('.name').should('have.value', 'test modified')
    cy.get('[data-rbd-droppable-id="list"] li:nth-child(1) input').should(
      'have.value',
      '1 modified'
    )
    cy.get('[data-rbd-droppable-id="list"] li:nth-child(2) input').should(
      'have.value',
      '2 modified'
    )
    cy.get('[data-rbd-droppable-id="list"]')
      .find('li')
      .should('have.length', 2)
  })
})
