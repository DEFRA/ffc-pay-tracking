const db = require('../../../app/data')
const { getExistingDataFull } = require('../../../app/get-existing-data-full')
const { getDataFilter } = require('../../../app/get-data-filter')

jest.mock('../../../app/data', () => ({
  reportData: {
    findOne: jest.fn()
  }
}))

jest.mock('../../../app/get-data-filter', () => ({
  getDataFilter: jest.fn()
}))

describe('getExistingDataFull', () => {
  test('should call db.reportData.findOne with correct parameters', async () => {
    const data = {
      correlationId: '123',
      sourceSystem: 'test',
      frn: '456',
      agreementNumber: '789',
      paymentRequestNumber: '1'
    }
    const transaction = {}

    getDataFilter.mockReturnValue({
      sourceSystem: 'test',
      frn: '456',
      agreementNumber: '789'
    })

    await getExistingDataFull(data, transaction)

    expect(db.reportData.findOne).toHaveBeenCalledWith({
      transaction,
      where: {
        correlationId: '123',
        sourceSystem: 'test',
        frn: '456',
        agreementNumber: '789'
      }
    })
  })
})
