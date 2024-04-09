const { getRevenue } = require('../../../../app/data-generation/get-revenue')
const { PAYMENT_EXTRACTED } = require('../../../../app/constants/events')
const { REVENUE, CAPITAL } = require('../../../../app/constants/cs-types')

test('getRevenue', () => {
  const event1 = { type: PAYMENT_EXTRACTED, data: { schemeId: 5, dueDate: '2016-12-01' } }
  expect(getRevenue(event1)).toBe(REVENUE)

  const event2 = { type: 'OTHER_EVENT', data: { schemeId: 5, dueDate: '01/12/2016' } }
  expect(getRevenue(event2)).toBe(REVENUE)

  const event3 = { type: PAYMENT_EXTRACTED, data: { schemeId: 5, dueDate: '2016-01-01' } }
  expect(getRevenue(event3)).toBe(REVENUE)

  const event4 = { type: 'OTHER_EVENT', data: { schemeId: 5, dueDate: '01/01/2016' } }
  expect(getRevenue(event4)).toBe(REVENUE)

  const event5 = { type: PAYMENT_EXTRACTED, data: { schemeId: 4, dueDate: '2016-12-01' } }
  expect(getRevenue(event5)).toBeNull()

  const event6 = { type: PAYMENT_EXTRACTED, data: { schemeId: 5, dueDate: '2016-02-01' } }
  expect(getRevenue(event6)).toBe(CAPITAL)
})
