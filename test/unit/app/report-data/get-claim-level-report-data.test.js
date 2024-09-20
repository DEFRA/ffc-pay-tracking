const { getClaimLevelReportData } = require('../../../../app/report-data/get-claim-level-report-data')
const db = require('../../../../app/data')
const { BPS: bps, CS: cs, FDMR: fdmr } = require('../../../../app/constants/source-systems')
const { mockResult } = require('../../../mocks/report-data/mock-get-claim-report-data')
const { BPS, CS, FDMR } = require('../../../../app/constants/schemes')

jest.mock('../../../../app/data', () => ({
  sequelize: {
    query: jest.fn(),
    QueryTypes: {
      SELECT: 'SELECT'
    }
  }
}))

describe('get claim level report data', () => {
  beforeEach(() => {
    db.sequelize.query.mockClear()
  })

  test('should call sequelize.query with correct SQL and options', async () => {
    const schemeId = BPS
    const year = 2023
    const paymentRequestNumber = 1
    const revenueOrCapital = 'Revenue'
    const frn = 1234567890

    const expectedSQL = `
      WITH "rankedData" AS (
        SELECT
          *,
          ROW_NUMBER() OVER (
            PARTITION BY
              "sourceSystem",
              frn
              , "marketingYear"
            ORDER BY
              "paymentRequestNumber" DESC,
              "lastUpdated" DESC
          ) AS row_num
        FROM
          "reportData"
        WHERE "sourceSystem" = :sourceSystem
        AND "year" = :year
        AND "paymentRequestNumber" = :paymentRequestNumber
        AND "frn" = :frn
        AND "revenueOrCapital" = :revenueOrCapital
      )
      SELECT
        *
      FROM
        "rankedData"
      WHERE
        row_num = 1
    `

    const expectedOptions = {
      replacements: {
        sourceSystem: bps,
        year,
        paymentRequestNumber,
        frn,
        revenueOrCapital
      },
      type: db.sequelize.QueryTypes.SELECT
    }

    await getClaimLevelReportData(schemeId, year, paymentRequestNumber, revenueOrCapital, frn)

    const actualSQL = db.sequelize.query.mock.calls[0][0].replace(/\s+/g, ' ').trim()
    const expectedSQLCleaned = expectedSQL.replace(/\s+/g, ' ').trim()
    expect(actualSQL).toEqual(expectedSQLCleaned)
    expect(db.sequelize.query).toHaveBeenCalledWith(expect.anything(), expectedOptions)
  })

  test('should throw an error if source system is not found', async () => {
    const schemeId = 'invalidSchemeId'

    await expect(getClaimLevelReportData(schemeId)).rejects.toThrow('Source system not found for schemeId: invalidSchemeId')
  })

  test('should return the result of sequelize.query', async () => {
    const schemeId = CS
    const year = 2023

    const mockedResult = mockResult
    db.sequelize.query.mockReturnValue(Promise.resolve(mockedResult))
    const result = await getClaimLevelReportData(schemeId, year)
    expect(result).toEqual(mockedResult)
  })

  test.each([
    { schemeId: BPS, sourceSystem: bps, additionalProperty1: null, additionalProperty2: 'marketingYear' },
    { schemeId: CS, sourceSystem: cs, additionalProperty1: 'claimNumber', additionalProperty2: null },
    { schemeId: FDMR, sourceSystem: fdmr, additionalProperty1: null, additionalProperty2: null }
  ])('should apply correct partitioning for $sourceSystem source system', async ({ schemeId, sourceSystem, additionalProperty1, additionalProperty2 }) => {
    const year = 2023

    const expectedPartitionClause = `
      PARTITION BY
        "sourceSystem",
        frn
        ${additionalProperty1 ? `, "${additionalProperty1}"` : ''}
        ${additionalProperty2 ? `, "${additionalProperty2}"` : ''}
    `

    await getClaimLevelReportData(schemeId, year)

    const actualSQL = db.sequelize.query.mock.calls[0][0].replace(/\s+/g, ' ').trim()
    const expectedPartitionClauseCleaned = expectedPartitionClause.replace(/\s+/g, ' ').trim()
    expect(actualSQL).toContain(expectedPartitionClauseCleaned)
  })
})
