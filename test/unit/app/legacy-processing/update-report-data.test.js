const db = require('../../../../app/data')
const { getDataFilter } = require('../../../../app/get-data-filter')
const { updatePaymentRequestData } = require('../../../../app/legacy-processing/update-payment-request-data')
const { updateReportData } = require('../../../../app/legacy-processing/update-report-data')

jest.mock('../../../../app/data')
jest.mock('../../../../app/get-data-filter')
jest.mock('../../../../app/legacy-processing/update-payment-request-data')

describe('update report data for legacy migrated data', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should create new record when no related requests are found', async () => {
    const data = {
      paymentRequestNumber: 1,
      daxValue: 100,
      daxPaymentRequestNumber: 1
    }

    const where = { filter: 'some-filter' }
    getDataFilter.mockReturnValue(where)
    db.reportData.findAll.mockResolvedValue([])

    await updateReportData(data)

    expect(getDataFilter).toHaveBeenCalledWith(data)
    expect(db.reportData.findAll).toHaveBeenCalledWith({ where })
    expect(db.reportData.create).toHaveBeenCalledWith({ ...data })
  })

  test('should call updatePaymentRequestData for each related request', async () => {
    const data = {
      paymentRequestNumber: 1,
      daxValue: 100,
      daxPaymentRequestNumber: 1
    }

    const where = { filter: 'some-filter' }
    const relatedRequests = [
      {
        paymentRequestNumber: 2,
        daxValue: 50,
        daxPaymentRequestNumber: 2,
        value: 200,
        reportDataId: 1
      },
      {
        paymentRequestNumber: 1,
        daxValue: 50,
        daxPaymentRequestNumber: 1,
        value: 200,
        reportDataId: 2
      }
    ]

    getDataFilter.mockReturnValue(where)
    db.reportData.findAll.mockResolvedValue(relatedRequests)

    await updateReportData(data)

    expect(getDataFilter).toHaveBeenCalledWith(data)
    expect(db.reportData.findAll).toHaveBeenCalledWith({ where })
    expect(updatePaymentRequestData).toHaveBeenCalledTimes(2)
    expect(updatePaymentRequestData).toHaveBeenCalledWith(relatedRequests[0], data)
    expect(updatePaymentRequestData).toHaveBeenCalledWith(relatedRequests[1], data)
  })
})
