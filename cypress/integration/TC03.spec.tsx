/// <reference types="cypress">

context('Create meeting', () => {
  beforeEach(() => {
    cy.fixture('test-user-data.json').then(users => {
      const { facilitator } = users
      ;(cy as any).login(facilitator.email, facilitator.password)
    })
  })
  it('minimal meeting infomation', () => {
    cy.get('nav > div > a[data-cy="/calendar"]').click()
    cy.wait(2500)
    cy.get('.float-right > svg').click()
    cy.wait(600)
    cy.get('[data-cy="questionset-selector"] > .select-css > select').select(
      'Foredrag'
    )
    cy.get('[data-cy=meeting-name] > div > input').type(
      'test meeting' + Date.now().toFixed(5)
    )
    cy.get('[data-cy=meeting-name] > div > input').type(
      'test meeting' + Date.now().toFixed(5)
    )

    // cy.get('[data-cy=meeting-end-time] > .container > svg').click()

    // cy.get('.datepicker-content')
    //   .trigger('mousedown', { which: 1, pageX: 600, pageY: 500 })
    //   .trigger('mousemove', { which: 1, pageX: 600, pageY: 300 })
    //   .trigger('mouseup')

    cy.get('[data-cy=create-meeting-btn]').click()
  })
})

export {} // to fake export for lint rule
