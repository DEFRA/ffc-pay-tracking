const db = require('../../../../app/data')
const {
  PAYMENT_ACKNOWLEDGED_STATUS,
  PAYMENT_SETTLED_STATUS,
  PAYMENT_ENRICHED_STATUS
} = require('../../../../app/constants/statuses')
const { getDataFilter } = require('../../../../app/helpers/get-data-filter')
const { getStatus } = require('../../../../app/data-generation/get-status')
const { checkDAXPRN } = require('../../../../app/data-generation/check-dax-prn')

jest.mock('../../../../app/data')
jest.mock('../../../../app/helpers/get-data-filter')
jest.mock('../../../../app/data-generation/get-status')

describe('check PRN imported to DAX', () => {
  let event
  let transaction

  beforeEach(() => {
    event = { data: { paymentRequestNumber: 3 } }
    transaction = {}
    getDataFilter.mockReturnValue({ filter: 'filterValue' })
  })

  const cases = [
    {
      name: 'previous acknowledged paymentRequestNumber',
      status: PAYMENT_ENRICHED_STATUS,
      dbResults: [
        { status: PAYMENT_ENRICHED_STATUS },
        { status: PAYMENT_ACKNOWLEDGED_STATUS, paymentRequestNumber: 1 }
      ],
      expected: 1
    },
    {
      name: 'previous settled paymentRequestNumber',
      status: 'OTHER_STATUS',
      dbResults: [
        { status: PAYMENT_ENRICHED_STATUS },
        { status: PAYMENT_SETTLED_STATUS, paymentRequestNumber: 1 }
      ],
      expected: 1
    },
    {
      name: '0 when no acknowledged or settled result exists',
      status: PAYMENT_ENRICHED_STATUS,
      dbResults: [],
      expected: 0
    }
  ]

  test.each(cases)('returns $expected for $name', async ({ status, dbResults, expected }) => {
    getStatus.mockReturnValue(status)
    db.reportData.findAll.mockResolvedValue(dbResults)

    const result = await checkDAXPRN(event, transaction)
    expect(result).toBe(expected)
  })
})
