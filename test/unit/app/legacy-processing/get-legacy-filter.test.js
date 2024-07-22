const { BPS, FDMR, CS, SFI } = require('../../../../app/constants/schemes')
const db = require('../../../../app/data')
const { getLegacyFilter } = require('../../../../app/legacy-processing/get-legacy-filter')

describe('get legacy data filter', () => {
  const baseData = {
    reportDataId: 1,
    sourceSystem: 'system1',
    frn: '1234567890',
    marketingYear: 2021,
    claimNumber: 'claim123',
    agreementNumber: 'agreement456'
  }

  test('should return the correct filter for BPS scheme', () => {
    const result = getLegacyFilter(baseData, BPS)
    expect(result).toEqual({
      reportDataId: { [db.Sequelize.Op.ne]: baseData.reportDataId },
      sourceSystem: baseData.sourceSystem,
      frn: baseData.frn,
      marketingYear: baseData.marketingYear
    })
  })

  test('should return the correct filter for FDMR scheme', () => {
    const result = getLegacyFilter(baseData, FDMR)
    expect(result).toEqual({
      reportDataId: { [db.Sequelize.Op.ne]: baseData.reportDataId },
      sourceSystem: baseData.sourceSystem,
      frn: baseData.frn,
      marketingYear: baseData.marketingYear
    })
  })

  test('should return the correct filter for CS scheme', () => {
    const result = getLegacyFilter(baseData, CS)
    expect(result).toEqual({
      reportDataId: { [db.Sequelize.Op.ne]: baseData.reportDataId },
      sourceSystem: baseData.sourceSystem,
      frn: baseData.frn,
      claimNumber: baseData.claimNumber
    })
  })

  test('should return the correct filter for SFI', () => {
    const result = getLegacyFilter(baseData, SFI)
    expect(result).toEqual({
      reportDataId: { [db.Sequelize.Op.ne]: baseData.reportDataId },
      sourceSystem: baseData.sourceSystem,
      frn: baseData.frn,
      marketingYear: baseData.marketingYear,
      agreementNumber: baseData.agreementNumber
    })
  })
})
