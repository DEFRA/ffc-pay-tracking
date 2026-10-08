const mockGetSourceSystemFromSchemeId = jest.fn()

jest.mock('ffc-pay-schemes', () => ({
  getSourceSystemFromSchemeId: mockGetSourceSystemFromSchemeId
}))

jest.mock('../../../../app/data', () => ({
  sequelize: {
    transaction: jest.fn()
  }
}))

jest.mock('../../../../app/retention/remove-report-data', () => ({
  removeReportData: jest.fn()
}))

const { removeAgreementData } = require('../../../../app/retention')
const db = require('../../../../app/data')
const { removeReportData } = require('../../../../app/retention/remove-report-data')
const { UNKNOWN } = require('../../../../app/constants/unknown')

describe('removeAgreementData', () => {
  const agreementNumber = 'AGR123'
  const frn = 456789
  const schemeId = 6
  const sourceSystem = 'BPS'

  let transaction

  beforeEach(() => {
    jest.clearAllMocks()

    transaction = {
      commit: jest.fn().mockResolvedValue(),
      rollback: jest.fn().mockResolvedValue()
    }

    db.sequelize.transaction.mockResolvedValue(transaction)
    mockGetSourceSystemFromSchemeId.mockReturnValue(sourceSystem)
  })

  test('removes data using the source system returned by ffc-pay-schemes', async () => {
    const retentionData = {
      agreementNumber,
      frn,
      schemeId
    }

    await removeAgreementData(retentionData)

    expect(db.sequelize.transaction).toHaveBeenCalledTimes(1)
    expect(mockGetSourceSystemFromSchemeId).toHaveBeenCalledWith(schemeId)
    expect(removeReportData).toHaveBeenCalledWith(
      agreementNumber,
      frn,
      sourceSystem,
      transaction
    )
    expect(transaction.commit).toHaveBeenCalledTimes(1)
    expect(transaction.rollback).not.toHaveBeenCalled()
  })

  test('rolls back the transaction when removeReportData throws', async () => {
    const error = new Error('removeReportData failure')
    removeReportData.mockRejectedValue(error)

    const retentionData = {
      agreementNumber,
      frn,
      schemeId
    }

    await expect(removeAgreementData(retentionData))
      .rejects
      .toThrow('removeReportData failure')

    expect(transaction.rollback).toHaveBeenCalledTimes(1)
    expect(transaction.commit).not.toHaveBeenCalled()
  })

  test('throws and rolls back when the source system is UNKNOWN', async () => {
    mockGetSourceSystemFromSchemeId.mockReturnValue(UNKNOWN)

    const retentionData = {
      agreementNumber,
      frn,
      schemeId
    }

    await expect(removeAgreementData(retentionData))
      .rejects
      .toThrow(`Unknown schemeId: ${schemeId}`)

    expect(mockGetSourceSystemFromSchemeId).toHaveBeenCalledWith(schemeId)
    expect(transaction.rollback).toHaveBeenCalledTimes(1)
    expect(transaction.commit).not.toHaveBeenCalled()
    expect(removeReportData).not.toHaveBeenCalled()
  })
})
