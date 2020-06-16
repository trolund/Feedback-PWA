export const createMeeting = () => {
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

  cy.get('[data-cy=create-meeting-btn]').click()
  cy.wait(200)
  cy.get('.toast').contains('er nu oprettet')

  //   const meetingId = getId(meetingName)

  //   return meetingId
}

export const getId = (name: string) => {
  ;(cy as any).goto('/calendar')
  cy.wait(1000)
  cy.get('.fc-today:visible')
    .first()
    .click({ force: true })
  cy.wait(2000)
  cy.get('[data-cy="meeting-list"] li')
    .contains(name)
    .first()
    .click()

  cy.wait(2000)

  cy.get('[data-cy="meetingId"]').then(element => {
    const meetingId = element.text()
    return meetingId
  })
}

export const getIdByDay = (name: string, date: Date) => {
  ;(cy as any).goto(`/meeting/day?date=${date.getTime()}`)
  cy.wait(2000)
  cy.get('[data-cy="meeting-list"] li')
    .contains(name)
    .first()
    .click()

  cy.wait(2000)

  cy.get('[data-cy="meetingId"]').then(element => {
    const meetingId = element.text()
    return meetingId
  })
}

export const addDay = () => {
  cy.get('[data-cy="meeting-date"]').click(40, 25)
  cy.get('.datepicker-col-1:visible') // day col
    .first()
    .trigger('mousedown')
    .trigger('mousemove', { which: 1, pageX: 600, pageY: 50 })
    .trigger('mouseup')

  cy.get('body').click()
}

export const deleteMeeting = (meetingId: string) => {
  ;(cy as any).goto(`/meeting/${meetingId}`)
  cy.get('[data-cy="meeting-delete"]').click()
  cy.wait(200)
  cy.get('[data-cy="ok-btn"]').click()
  cy.wait(200)
  cy.location('pathname', { timeout: 10000 }).should('include', '/meeting/day')
}

export const deleteMeetingDate = (name: string, date: Date) => {
  ;(cy as any).goto(`/meeting/day?date=${date.getTime()}`)
  cy.wait(2000)
  cy.get('[data-cy="meeting-list"] li')
    .contains(name)
    .first()
    .click()

  cy.wait(2000)
  cy.get('[data-cy="meeting-delete"]').click()
  cy.wait(200)
  cy.get('[data-cy="ok-btn"]').click()
  cy.wait(200)
  cy.location('pathname', { timeout: 10000 }).should('include', '/meeting/day')
}
