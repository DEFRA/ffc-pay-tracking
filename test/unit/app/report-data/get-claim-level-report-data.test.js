const { getClaimLevelReportData } = require('../../../../app/report-data/get-claim-level-report-data')
const db = require('../../../../app/data')
const { bps, cs, fdmr } = require('../../../../app/constants/source-systems')
const { mockResult } = require('../../../mocks/report-data/mock-get-claim-report-data')

jest.mock('../../../../app/data', () => ({
  sequelize: {
    query: jest.fn(),
    QueryTypes: {
      SELECT: 'SELECT'
    }
  }
}))

describe('getClaimLevelReportData', () => {
  beforeEach(() => {
    db.sequelize.query.mockClear()
  })

  test('should call sequelize.query with correct SQL and options', async () => {
    const expectedSQL = `
        WITH "rankedData" AS (
            SELECT
            *,
            ROW_NUMBER() OVER (
                PARTITION BY
                "sourceSystem",
                frn,
                CASE 
                    WHEN "sourceSystem" = :BPS THEN NULL
                    WHEN "sourceSystem" = :FDMR THEN NULL
                    WHEN "sourceSystem" = :CS THEN "claimNumber"
                    ELSE "agreementNumber"
                END,
                CASE
                    WHEN "sourceSystem" = :FDMR THEN NULL
                    WHEN "sourceSystem" = :CS THEN NULL
                    ELSE "marketingYear"
                END
                ORDER BY
                "paymentRequestNumber" DESC,
                "lastUpdated" DESC
            ) AS row_num
            FROM
            "reportData"
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
        BPS: bps,
        CS: cs,
        FDMR: fdmr
      },
      type: db.sequelize.QueryTypes.SELECT
    }

    await getClaimLevelReportData()

    const actualSQL = db.sequelize.query.mock.calls[0][0].replace(/\s+/g, ' ').trim()
    const expectedSQLCleaned = expectedSQL.replace(/\s+/g, ' ').trim()
    expect(actualSQL).toEqual(expectedSQLCleaned)
    expect(db.sequelize.query).toHaveBeenCalledWith(expect.anything(), expectedOptions)
  })

  test('should return the result of sequelize.query', async () => {
    const mockedResult = mockResult
    db.sequelize.query.mockReturnValue(Promise.resolve(mockedResult))
    const result = await getClaimLevelReportData()
    expect(result).toEqual(mockedResult)
  })
})
