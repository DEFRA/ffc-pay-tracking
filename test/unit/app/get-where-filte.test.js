const { getWhereFilter } = require('../../../app/get-where-filter')
const { PAYMENT_SUBMITTED, PAYMENT_ACKNOWLEDGED, PAYMENT_SETTLED } = require('../../../app/constants/events')

describe('getWhereFilter', () => {
  const paymentEventTypes = [PAYMENT_SUBMITTED, PAYMENT_ACKNOWLEDGED, PAYMENT_SETTLED]

  paymentEventTypes.forEach(eventType => {
    test(`should return correct filter for ${eventType} event`, () => {
      const event = {
        type: eventType,
        data: {
          correlationId: '123',
          sourceSystem: 'test',
          frn: '456',
          agreementNumber: '789',
          invoiceNumber: '101112'
        }
      }

      const filter = getWhereFilter(event)

      expect(filter).toEqual({
        correlationId: '123',
        sourceSystem: 'test',
        frn: '456',
        agreementNumber: '789',
        invoiceNumber: '101112'
      })
    })
  })
})
