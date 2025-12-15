jest.mock('../../../../app/data', () => ({
  reportData: {
    findOne: jest.fn()
  }
}))
const db = require('../../../../app/data')

jest.mock('../../../../app/helpers/get-data-filter', () => ({
  getDataFilter: jest.fn()
}))
const { getDataFilter } = require('../../../../app/helpers/get-data-filter')

const { getExistingDataFull } = require('../../../../app/helpers/get-existing-data-full')

describe('getExistingDataFull', () => {
  const transactionMock = { id: 'transaction-id' }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should return null if paymentRequestNumber is undefined', async () => {
    const data = { correlationId: 'corr-1' }
    const result = await getExistingDataFull(data, transactionMock)
    expect(result).toBeNull()
    expect(getDataFilter).not.toHaveBeenCalled()
    expect(db.reportData.findOne).not.toHaveBeenCalled()
  })

  test('should return null if paymentRequestNumber is null', async () => {
    const data = { paymentRequestNumber: null, correlationId: 'corr-1' }
    const result = await getExistingDataFull(data, transactionMock)
    expect(result).toBeNull()
    expect(getDataFilter).not.toHaveBeenCalled()
    expect(db.reportData.findOne).not.toHaveBeenCalled()
  })

  test('should call getDataFilter and db.reportData.findOne with correct parameters', async () => {
    const data = { paymentRequestNumber: 123, correlationId: 'corr-1' }
    const fakeWhere = { someKey: 'someValue' }
    getDataFilter.mockReturnValue(fakeWhere)

    const expectedWhere = { ...fakeWhere, correlationId: 'corr-1' }
    const findOneResult = { id: 1, data: 'some data' }
    db.reportData.findOne.mockResolvedValue(findOneResult)

    const result = await getExistingDataFull(data, transactionMock)

    expect(getDataFilter).toHaveBeenCalledTimes(1)
    expect(getDataFilter).toHaveBeenCalledWith(data)

    expect(db.reportData.findOne).toHaveBeenCalledTimes(1)
    expect(db.reportData.findOne).toHaveBeenCalledWith({
      where: expectedWhere,
      transaction: transactionMock
    })

    expect(result).toBe(findOneResult)
  })

  test('should work when paymentRequestNumber is 0 (falsy but valid)', async () => {
    const data = { paymentRequestNumber: 0, correlationId: 'corr-2' }
    const fakeWhere = { key: 'value' }
    getDataFilter.mockReturnValue(fakeWhere)

    const expectedWhere = { ...fakeWhere, correlationId: 'corr-2' }
    const findOneResult = { id: 2, data: 'result data' }
    db.reportData.findOne.mockResolvedValue(findOneResult)

    const result = await getExistingDataFull(data, transactionMock)

    expect(getDataFilter).toHaveBeenCalledWith(data)
    expect(db.reportData.findOne).toHaveBeenCalledWith({
      where: expectedWhere,
      transaction: transactionMock
    })
    expect(result).toBe(findOneResult)
  })
})
