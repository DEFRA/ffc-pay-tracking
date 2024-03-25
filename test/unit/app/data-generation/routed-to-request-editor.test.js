const { routedToRequestEditor } = require('../../../../app/data-generation/routed-to-request-editor')
const { PAYMENT_PAUSED_DEBT, PAYMENT_PAUSED_LEDGER, PAYMENT_PAUSED_QUALITY_CHECK } = require('../../../../app/constants/events')

test('routedToRequestEditor', () => {
  const event1 = { type: PAYMENT_PAUSED_DEBT }
  expect(routedToRequestEditor(event1)).toBe('Y')

  const event2 = { type: PAYMENT_PAUSED_LEDGER }
  expect(routedToRequestEditor(event2)).toBe('Y')

  const event3 = { type: PAYMENT_PAUSED_QUALITY_CHECK }
  expect(routedToRequestEditor(event3)).toBe('Y')

  const event4 = { type: 'OTHER_EVENT' }
  expect(routedToRequestEditor(event4)).toBeNull()
})
