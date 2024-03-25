const { getDebtType } = require('../../../../app/data-generation/get-debt-type')
const { PAYMENT_PAUSED_LEDGER, PAYMENT_PROCESSED } = require('../../../../app/constants/events')

test('getDebtType', () => {
  const event1 = { type: PAYMENT_PAUSED_LEDGER, data: { debtType: 'irr' } }
  expect(getDebtType(event1)).toBe('Irregular')

  const event2 = { type: PAYMENT_PROCESSED, data: { debtType: 'adm' } }
  expect(getDebtType(event2)).toBe('Administrative')

  const event3 = { type: 'OTHER_EVENT', data: { debtType: 'irr' } }
  expect(getDebtType(event3)).toBeNull()

  const event4 = { type: PAYMENT_PAUSED_LEDGER, data: { debtType: 'other' } }
  expect(getDebtType(event4)).toBeNull()
})
