const mockGetDataFilter = jest.fn()
jest.mock('../../../../app/helpers/get-data-filter', () => ({ getDataFilter: mockGetDataFilter }))

const { PAYMENT_PROCESSED, PAYMENT_SUBMITTED, PAYMENT_ACKNOWLEDGED, PAYMENT_SETTLED } = require('../../../../app/constants/events')
const { getWhereFilter } = require('../../../../app/helpers/get-where-filter')

describe('getWhereFilter', () => {
  beforeEach(() => {
    mockGetDataFilter.mockReset()
  })

  test('adds correlationId and invoiceNumber for payment events', () => {
    const baseWhere = { frn: 123 }
    mockGetDataFilter.mockReturnValue(baseWhere)

    const event = { type: PAYMENT_PROCESSED, data: { correlationId: 'corr1', invoiceNumber: 'INV1' } }
    const where = getWhereFilter(event)

    expect(mockGetDataFilter).toHaveBeenCalledWith(event.data)
    expect(where).toEqual({ ...baseWhere, correlationId: 'corr1', invoiceNumber: 'INV1' })
  })

  test('adds correlationId but not invoiceNumber for non-payment events', () => {
    const baseWhere = { frn: 456 }
    mockGetDataFilter.mockReturnValue(baseWhere)

    const event = { type: 'NON_PAYMENT_EVENT', data: { correlationId: 'corr2', invoiceNumber: 'INV2' } }
    const where = getWhereFilter(event)

    expect(where).toEqual({ ...baseWhere, correlationId: 'corr2' })
    expect(where.invoiceNumber).toBeUndefined()
  })

  test.each([PAYMENT_PROCESSED, PAYMENT_SUBMITTED, PAYMENT_ACKNOWLEDGED, PAYMENT_SETTLED])(
    'includes invoiceNumber for payment event type %s',
    (type) => {
      mockGetDataFilter.mockReturnValue({})
      const event = { type, data: { correlationId: 'c', invoiceNumber: 'I' } }
      const where = getWhereFilter(event)
      expect(where.invoiceNumber).toBe('I')
      expect(where.correlationId).toBe('c')
    }
  )
})