const { removeAgreementData } = require('../../../../app/retention')
const db = require('../../../../app/data')
const schemes = require('../../../../app/constants/schemes')
const sourceSystems = require('../../../../app/constants/source-systems')

jest.mock('../../../../app/data', () => ({
  sequelize: {
    transaction: jest.fn()
  }
}))

jest.mock('../../../../app/retention/remove-report-data', () => ({
  removeReportData: jest.fn()
}))

const { removeReportData } = require('../../../../app/retention/remove-report-data')

describe('removeAgreementData', () => {
  const agreementNumber = 'AGR123'
  const frn = 456789
  const knownSchemeId = Object.values(schemes)[0]
  const unknownSchemeId = 999999

  let transaction

  beforeEach(() => {
    jest.clearAllMocks()

    transaction = {
      commit: jest.fn().mockResolvedValue(),
      rollback: jest.fn().mockResolvedValue()
    }
    db.sequelize.transaction.mockResolvedValue(transaction)
  })

  test('removes data from all tables with correct source system', async () => {
    removeReportData.mockResolvedValue()

    const schemeName = Object.entries(schemes).find(([, id]) => id === knownSchemeId)[0]
    const expectedSourceSystem = sourceSystems[schemeName]

    const retentionData = {
      agreementNumber,
      frn,
      schemeId: knownSchemeId
    }

    await removeAgreementData(retentionData)

    expect(db.sequelize.transaction).toHaveBeenCalledTimes(1)
    expect(removeReportData).toHaveBeenCalledWith(agreementNumber, frn, expectedSourceSystem, transaction)
    expect(transaction.commit).toHaveBeenCalledTimes(1)
    expect(transaction.rollback).not.toHaveBeenCalled()
  })

  test('rolls back transaction and throws error if removeReportData throws', async () => {
    const error = new Error('removeReportData failure')
    removeReportData.mockRejectedValue(error)

    const retentionData = {
      agreementNumber,
      frn,
      schemeId: Object.values(schemes)[0]
    }

    await expect(removeAgreementData(retentionData)).rejects.toThrow('removeReportData failure')

    expect(transaction.rollback).toHaveBeenCalledTimes(1)
    expect(transaction.commit).not.toHaveBeenCalled()
  })

  test('throws error and rolls back if schemeId is unknown', async () => {
    const retentionData = {
      agreementNumber,
      frn,
      schemeId: unknownSchemeId
    }

    await expect(removeAgreementData(retentionData)).rejects.toThrow(`Unknown schemeId: ${unknownSchemeId}`)

    expect(transaction.rollback).toHaveBeenCalledTimes(1)
    expect(transaction.commit).not.toHaveBeenCalled()
    expect(removeReportData).not.toHaveBeenCalled()
  })
})
