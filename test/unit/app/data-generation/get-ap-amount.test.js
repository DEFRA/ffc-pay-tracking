const { getAPAmount } = require('../../../../app/data-generation/get-ap-amount')
const { PAYMENT_PROCESSED } = require('../../../../app/constants/events')
const { AR } = require('../../../../app/constants/ledgers')

describe('getAPAmount', () => {
  test('should return null if event type is not PAYMENT_PROCESSED', () => {
    const event = { type: 'OTHER_EVENT', data: { ledger: 'AP', value: 100 } }
    expect(getAPAmount(event)).toBeNull()
  })

  test('should return null if ledger is AR', () => {
    const event = { type: PAYMENT_PROCESSED, data: { ledger: AR, value: 100 } }
    expect(getAPAmount(event)).toBeNull()
  })

  test('should return the value if event type is PAYMENT_PROCESSED and ledger is not AR', () => {
    const event = { type: PAYMENT_PROCESSED, data: { ledger: 'AP', value: 100 } }
    expect(getAPAmount(event)).toBe(100)
  })
})
