const db = require('../../../app/data/index')
const { getExistingDataFull } = require('../../../app/get-existing-data-full')

jest.mock('../../../app/data/index', () => ({
  reportData: {
    findOne: jest.fn()
  }
}))

describe('getExistingDataFull', () => {
  test('should call db.reportData.findOne with correct parameters', async () => {
    const correlationId = '123'
    const sourceSystem = 'test'
    const frn = '456'
    const agreementNumber = '789'
    const transaction = {}

    await getExistingDataFull(correlationId, sourceSystem, frn, agreementNumber, transaction)

    expect(db.reportData.findOne).toHaveBeenCalledWith({
      transaction,
      where: {
        correlationId,
        sourceSystem,
        frn,
        agreementNumber
      }
    })
  })
})
