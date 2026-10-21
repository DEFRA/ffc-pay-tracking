const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock(['reportData'])

jest.mock('../../../../app/database', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const { getValue } = require('../../../../app/data-generation/get-value')
const { PAYMENT_EXTRACTED, PAYMENT_ENRICHED } = require('../../../../app/constants/events')
const { convertToPence } = require('../../../../app/helpers/currency-convert')
const { getDataFilter } = require('../../../../app/helpers/get-data-filter')

jest.mock('../../../../app/helpers/currency-convert', () => ({
  convertToPence: jest.fn()
}))

jest.mock('../../../../app/helpers/get-data-filter', () => ({
  getDataFilter: jest.fn()
}))

describe('getValue', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockDb.builder.resolves()
  })

  test('should return converted value for PAYMENT_EXTRACTED event', async () => {
    convertToPence.mockReturnValueOnce(100)
    const event1 = { type: PAYMENT_EXTRACTED, data: { value: 1.00 } }
    await expect(getValue(event1)).resolves.toBe(100)
  })

  test('should return raw value for PAYMENT_ENRICHED event', async () => {
    const event2 = { type: PAYMENT_ENRICHED, data: { value: 200 } }
    await expect(getValue(event2)).resolves.toBe(200)
  })

  test('should make correct calls to getDataFilter, database', async () => {
    const event4 = { type: 'OTHER_EVENT', data: { value: 400, correlationId: 'test-correlation-id', sourceSystem: 'SFI' } }
    const mockWhere = { someField: 'someValue' }
    const mockDbResponse = { value: 400 }

    getDataFilter.mockReturnValueOnce(mockWhere)
    mockDb.builder.resolves(mockDbResponse)

    await expect(getValue(event4)).resolves.toBe(400)
    expect(getDataFilter).toHaveBeenCalledWith(event4.data)
    expect(mockDb.tables.reportData).toHaveBeenCalledWith(undefined)
    expect(mockDb.builder.where).toHaveBeenCalledWith(mockWhere)
    expect(mockDb.builder.first).toHaveBeenCalledTimes(1)
  })

  test('should query the transaction when one is supplied', async () => {
    getDataFilter.mockReturnValueOnce({})
    mockDb.builder.resolves({ value: 1 })

    await getValue({ type: 'OTHER_EVENT', data: {} }, mockDb.trx)

    expect(mockDb.tables.reportData).toHaveBeenCalledWith(mockDb.trx)
  })

  test('should return undefined when no existing row is found', async () => {
    getDataFilter.mockReturnValueOnce({})

    await expect(getValue({ type: 'OTHER_EVENT', data: {} })).resolves.toBeUndefined()
  })
})
