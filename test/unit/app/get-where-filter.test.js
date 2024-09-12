const { getWhereFilter } = require('../../../app/helpers/get-where-filter')
const { PAYMENT_SUBMITTED, PAYMENT_ACKNOWLEDGED, PAYMENT_SETTLED } = require('../../../app/constants/events')
const { getDataFilter } = require('../../../app/helpers/get-data-filter')

jest.mock('../../../app/helpers/get-data-filter', () => ({
  getDataFilter: jest.fn()
}))

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

      getDataFilter.mockReturnValue({
        sourceSystem: 'test',
        frn: '456',
        agreementNumber: '789'
      })

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
