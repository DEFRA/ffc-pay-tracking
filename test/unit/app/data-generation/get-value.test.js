const { getValue } = require('../../../../app/data-generation/get-value')
const { PAYMENT_EXTRACTED, PAYMENT_ENRICHED } = require('../../../../app/constants/events')
const { convertToPence } = require('../../../../app/helpers/currency-convert')
const db = require('../../../../app/data')
const { getDataFilter } = require('../../../../app/helpers/get-data-filter')

jest.mock('../../../../app/helpers/currency-convert', () => ({
  convertToPence: jest.fn()
}))

jest.mock('../../../../app/data', () => ({
  reportData: {
    findOne: jest.fn()
  }
}))

jest.mock('../../../../app/helpers/get-data-filter', () => ({
  getDataFilter: jest.fn()
}))

describe('getValue', () => {
  test('should return converted value for PAYMENT_EXTRACTED event', async () => {
    convertToPence.mockReturnValueOnce(100)
    const event1 = { type: PAYMENT_EXTRACTED, data: { value: 1.00 } }
    await expect(getValue(event1)).resolves.toBe(100)
  })

  test('should return raw value for PAYMENT_ENRICHED event', async () => {
    const event2 = { type: PAYMENT_ENRICHED, data: { value: 200 } }
    await expect(getValue(event2)).resolves.toBe(200)
  })

  test('should return value from database for other events', async () => {
    const event3 = { type: 'OTHER_EVENT', data: { value: 300 } }
    const mockWhere = { someField: 'someValue' }
    const mockDbResponse = { value: 300 }

    getDataFilter.mockReturnValueOnce(mockWhere)
    db.reportData.findOne.mockResolvedValueOnce(mockDbResponse)

    await expect(getValue(event3)).resolves.toBe(300)
    expect(getDataFilter).toHaveBeenCalledWith(event3.data)
    expect(db.reportData.findOne).toHaveBeenCalledWith({
      where: mockWhere,
      transaction: undefined
    })
  })
})
