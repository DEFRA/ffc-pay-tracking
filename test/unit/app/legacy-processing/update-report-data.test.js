const { SFI23 } = require('../../../../app/constants/schemes')
const db = require('../../../../app/data')
const { getLegacyFilter } = require('../../../../app/legacy-processing/get-legacy-filter')
const { updatePaymentRequestData } = require('../../../../app/legacy-processing/update-payment-request-data')
const { updateReportData } = require('../../../../app/legacy-processing/update-report-data')

jest.mock('../../../../app/data')
jest.mock('../../../../app/legacy-processing/get-legacy-filter')
jest.mock('../../../../app/legacy-processing/update-payment-request-data')

describe('update report data for legacy migrated data', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should create new record and not call updatePaymentRequestData when no related requests are found', async () => {
    const data = {
      paymentRequestNumber: 1,
      daxValue: 100,
      daxPaymentRequestNumber: 1
    }

    const where = { filter: 'some-filter' }
    const createdRecord = { ...data, reportDataId: 1 }

    db.reportData.create.mockResolvedValue(createdRecord)
    getLegacyFilter.mockReturnValue(where)
    db.reportData.findAll.mockResolvedValue([])

    await updateReportData(data, SFI23)

    expect(db.reportData.create).toHaveBeenCalledWith({ ...data })
    expect(getLegacyFilter).toHaveBeenCalledWith(createdRecord, SFI23)
    expect(db.reportData.findAll).toHaveBeenCalledWith({ where })
    expect(updatePaymentRequestData).not.toHaveBeenCalled()
  })

  test('should call updatePaymentRequestData for each related request', async () => {
    const data = {
      paymentRequestNumber: 1,
      daxValue: 100,
      daxPaymentRequestNumber: 1
    }

    const where = { filter: 'some-filter' }
    const createdRecord = { ...data, reportDataId: 1 }
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

    db.reportData.create.mockResolvedValue(createdRecord)
    getLegacyFilter.mockReturnValue(where)
    db.reportData.findAll.mockResolvedValue(relatedRequests)

    await updateReportData(data, SFI23)

    expect(db.reportData.create).toHaveBeenCalledWith({ ...data })
    expect(getLegacyFilter).toHaveBeenCalledWith(createdRecord, SFI23)
    expect(db.reportData.findAll).toHaveBeenCalledWith({ where })
    expect(updatePaymentRequestData).toHaveBeenCalledTimes(2)
    expect(updatePaymentRequestData).toHaveBeenCalledWith(relatedRequests[0], createdRecord)
    expect(updatePaymentRequestData).toHaveBeenCalledWith(relatedRequests[1], createdRecord)
  })
})
