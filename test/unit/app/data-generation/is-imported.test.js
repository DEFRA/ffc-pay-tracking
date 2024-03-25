const { isImported } = require('../../../../app/data-generation/is-imported')
const { PAYMENT_ACKNOWLEDGED, PAYMENT_SETTLED } = require('../../../../app/constants/events')

test('isImported', () => {
  const event1 = { type: PAYMENT_ACKNOWLEDGED }
  expect(isImported(event1)).toBe('Y')

  const event2 = { type: PAYMENT_SETTLED }
  expect(isImported(event2)).toBe('Y')

  const event3 = { type: 'OTHER_EVENT' }
  expect(isImported(event3)).toBeNull()
})
