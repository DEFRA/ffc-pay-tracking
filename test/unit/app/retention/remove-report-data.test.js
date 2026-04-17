const db = require('../../../../app/data')
const { removeReportData } = require('../../../../app/retention/remove-report-data')

jest.mock('../../../../app/data', () => ({
  reportData: {
    destroy: jest.fn()
  }
}))

describe('removeReportData', () => {
  const agreementNumber = 'AGR123'
  const frn = 456789
  const sourceSystem = 'Source system'
  const transaction = { id: 'transaction-object' }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('calls db.reportData.destroy with correct parameters', async () => {
    await removeReportData(agreementNumber, frn, sourceSystem, transaction)

    expect(db.reportData.destroy).toHaveBeenCalledTimes(1)
    expect(db.reportData.destroy).toHaveBeenCalledWith({
      where: {
        agreementNumber,
        frn,
        sourceSystem
      },
      transaction
    })
  })

  test('calls db.reportData.destroy with undefined transaction if not provided', async () => {
    await removeReportData(agreementNumber, frn, sourceSystem)

    expect(db.reportData.destroy).toHaveBeenCalledWith({
      where: {
        agreementNumber,
        frn,
        sourceSystem
      },
      transaction: undefined
    })
  })

  test('propagates errors from db.reportData.destroy', async () => {
    const error = new Error('DB failure')
    db.reportData.destroy.mockRejectedValue(error)

    await expect(removeReportData(agreementNumber, frn, sourceSystem, transaction)).rejects.toThrow('DB failure')
  })
})
