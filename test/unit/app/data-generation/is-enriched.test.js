const { isEnriched } = require('../../../../app/data-generation/is-enriched')
const { PAYMENT_PAUSED_DEBT, PAYMENT_DEBT_ATTACHED } = require('../../../../app/constants/events')

describe('isEnriched', () => {
  test('should return "N" when event type is PAYMENT_PAUSED_DEBT', () => {
    const event = { type: PAYMENT_PAUSED_DEBT }
    const result = isEnriched(event)
    expect(result).toBe('N')
  })

  test('should return "Y" when event type is PAYMENT_DEBT_ATTACHED', () => {
    const event = { type: PAYMENT_DEBT_ATTACHED }
    const result = isEnriched(event)
    expect(result).toBe('Y')
  })

  test('should return null when event type is neither PAYMENT_PAUSED_DEBT nor PAYMENT_DEBT_ATTACHED', () => {
    const event = { type: 'OTHER_EVENT' }
    const result = isEnriched(event)
    expect(result).toBeNull()
  })
})
