const db = require('../../../../app/data')
const { PAYMENT_ACKNOWLEDGED_STATUS, PAYMENT_SETTLED_STATUS, PAYMENT_ENRICHED_STATUS } = require('../../../../app/constants/statuses')
const { getDataFilter } = require('../../../../app/get-data-filter')
const { getStatus } = require('../../../../app/data-generation/get-status')
const { checkDAXPRN } = require('../../../../app/data-generation/check-dax-prn')

jest.mock('../../../../app/data')
jest.mock('../../../../app/get-data-filter')
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

  test('returns the current paymentRequestNumber when status is acknowledged', async () => {
    getStatus.mockReturnValue(PAYMENT_ACKNOWLEDGED_STATUS)

    const result = await checkDAXPRN(event, transaction)
    expect(result).toBe(3)
  })

  test('returns the current paymentRequestNumber when status is settled', async () => {
    getStatus.mockReturnValue(PAYMENT_SETTLED_STATUS)

    const result = await checkDAXPRN(event, transaction)
    expect(result).toBe(3)
  })

  test('returns the previous acknowledged paymentRequestNumber', async () => {
    getStatus.mockReturnValue(PAYMENT_ENRICHED_STATUS)

    db.reportData.findOne
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ status: PAYMENT_ENRICHED_STATUS })
      .mockResolvedValueOnce({ status: PAYMENT_ACKNOWLEDGED_STATUS, paymentRequestNumber: 1 })

    const result = await checkDAXPRN(event, transaction)
    expect(result).toBe(1)
  })

  test('returns the previous settled paymentRequestNumber', async () => {
    getStatus.mockReturnValue('OTHER_STATUS')

    db.reportData.findOne
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ status: PAYMENT_ENRICHED_STATUS })
      .mockResolvedValueOnce({ status: PAYMENT_SETTLED_STATUS, paymentRequestNumber: 1 })

    const result = await checkDAXPRN(event, transaction)
    expect(result).toBe(1)
  })

  test('returns null if no acknowledged or settled status is found', async () => {
    getStatus.mockReturnValue(PAYMENT_ENRICHED_STATUS)

    db.reportData.findOne.mockResolvedValue(null)

    const result = await checkDAXPRN(event, transaction)
    expect(result).toBeNull()
  })
})
