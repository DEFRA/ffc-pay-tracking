const db = require('../../../../app/data')
const { PAYMENT_ACKNOWLEDGED_STATUS, PAYMENT_SETTLED_STATUS, PAYMENT_ENRICHED_STATUS } = require('../../../../app/constants/statuses')
const { getDataFilter } = require('../../../../app/helpers/get-data-filter')
const { getStatus } = require('../../../../app/data-generation/get-status')
const { checkDAXPRN } = require('../../../../app/data-generation/check-dax-prn')

jest.mock('../../../../app/data')
jest.mock('../../../../app/helpers/get-data-filter')
jest.mock('../../../../app/data-generation/get-status')

describe('check PRN imported to DAX', () => {
  let event, transaction

  beforeEach(() => {
    event = {
      data: {
        paymentRequestNumber: 3
      }
    }
    transaction = {}
    getDataFilter.mockReturnValue({ filter: 'filterValue' })
  })

  test('returns the previous acknowledged paymentRequestNumber', async () => {
    getStatus.mockReturnValue(PAYMENT_ENRICHED_STATUS)
    db.reportData.findAll
      .mockResolvedValue([
        { status: PAYMENT_ENRICHED_STATUS },
        { status: PAYMENT_ACKNOWLEDGED_STATUS, paymentRequestNumber: 1 }
      ])
    const result = await checkDAXPRN(event, transaction)
    expect(result).toBe(1)
  })
  test('returns the previous settled paymentRequestNumber', async () => {
    getStatus.mockReturnValue('OTHER_STATUS')
    db.reportData.findAll
      .mockResolvedValue([
        { status: PAYMENT_ENRICHED_STATUS },
        { status: PAYMENT_SETTLED_STATUS, paymentRequestNumber: 1 }
      ])
    const result = await checkDAXPRN(event, transaction)
    expect(result).toBe(1)
  })
  test('returns 0 if no acknowledged or settled status is found', async () => {
    getStatus.mockReturnValue(PAYMENT_ENRICHED_STATUS)
    db.reportData.findAll.mockResolvedValue([])
    const result = await checkDAXPRN(event, transaction)
    expect(result).toBe(0)
  })
})
