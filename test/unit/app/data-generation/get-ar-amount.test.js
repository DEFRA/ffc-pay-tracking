const { getARAmount } = require('../../../../app/data-generation/get-ar-amount')
const { PAYMENT_PROCESSED } = require('../../../../app/constants/events')
const { AP, AR } = require('../../../../app/constants/ledgers')

test('getARAmount', () => {
  const event1 = { type: PAYMENT_PROCESSED, data: { ledger: AR, value: 100 } }
  expect(getARAmount(event1)).toBe(100)

  const event2 = { type: PAYMENT_PROCESSED, data: { ledger: AP, value: 200 } }
  expect(getARAmount(event2)).toBeNull()

  const event3 = { type: 'OTHER_EVENT', data: { ledger: AR, value: 300 } }
  expect(getARAmount(event3)).toBeNull()
})
