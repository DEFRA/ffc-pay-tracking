const eventPrefixes = require('../../../../app/constants/event-prefixes')

describe('event-prefixes', () => {
  test('should export the correct event prefixes', () => {
    expect(eventPrefixes.PAYMENT_EVENT_PREFIX).toBe('uk.gov.defra.ffc.pay.payment.')
    expect(eventPrefixes.HOLD_EVENT_PREFIX).toBe('uk.gov.defra.ffc.pay.hold.')
    expect(eventPrefixes.WARNING_EVENT_PREFIX).toBe('uk.gov.defra.ffc.pay.warning.')
    expect(eventPrefixes.BATCH_EVENT_PREFIX).toBe('uk.gov.defra.ffc.pay.batch.')
  })
})
