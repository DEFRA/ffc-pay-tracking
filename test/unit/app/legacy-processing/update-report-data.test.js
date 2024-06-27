const db = require('../../../../app/data')
const { getOverallStatus } = require('../../../../app/data-generation')
const { getDataFilter } = require('../../../../app/get-data-filter')
const { updateReportData } = require('../../../../app/legacy-processing/update-report-data')

jest.mock('../../../../app/data')
jest.mock('../../../../app/data-generation')
jest.mock('../../../../app/get-data-filter')

describe('update report data for migrated data', () => {
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

  test('should update daxValue and overallStatus when paymentRequestNumber is greater in related request', async () => {
    const data = {
      paymentRequestNumber: 1,
      daxValue: 100,
      daxPaymentRequestNumber: 1,
      value: 200
    }

    const where = { filter: 'some-filter' }
    const relatedRequests = [
      {
        paymentRequestNumber: 2,
        daxValue: 50,
        daxPaymentRequestNumber: 2,
        value: 200,
        reportDataId: 1
      }
    ]

    getDataFilter.mockReturnValue(where)
    db.reportData.findAll.mockResolvedValue(relatedRequests)
    getOverallStatus.mockReturnValue('Updated Status')

    const expectedUpdateData = {
      daxValue: 150,
      daxPaymentRequestNumber: 2,
      overallStatus: 'Updated Status',
      valueStillToProcess: 50
    }

    await updateReportData(data)

    expect(getDataFilter).toHaveBeenCalledWith(data)
    expect(db.reportData.findAll).toHaveBeenCalledWith({ where })
    expect(db.reportData.update).toHaveBeenCalledWith(expectedUpdateData, { where: { reportDataId: relatedRequests[0].reportDataId } })
  })

  test('should update daxValue, deltaAmount, and overallStatus when paymentRequestNumber matches with related request, but invoiceNumber are different', async () => {
    const data = {
      paymentRequestNumber: 2,
      daxValue: 150,
      deltaAmount: -50,
      daxPaymentRequestNumber: 2,
      invoiceNumber: 'INV001',
      value: 200
    }

    const where = { filter: 'some-filter' }
    const relatedRequests = [
      {
        paymentRequestNumber: 2,
        daxValue: 50,
        deltaAmount: -50,
        daxPaymentRequestNumber: 2,
        invoiceNumber: 'INV002',
        value: 200,
        reportDataId: 1
      }
    ]

    getDataFilter.mockReturnValue(where)
    db.reportData.findAll.mockResolvedValue(relatedRequests)
    getOverallStatus.mockReturnValue('Updated Status')

    const expectedUpdateData = {
      daxValue: 200,
      deltaAmount: -100,
      daxPaymentRequestNumber: 2,
      overallStatus: 'Updated Status',
      valueStillToProcess: 0,
      prStillToProcess: 0
    }

    await updateReportData(data)

    expect(getDataFilter).toHaveBeenCalledWith(data)
    expect(db.reportData.findAll).toHaveBeenCalledWith({ where })
    expect(db.reportData.update).toHaveBeenCalledWith(expectedUpdateData, { where: { reportDataId: relatedRequests[0].reportDataId } })
  })

  test('should update fields when paymentRequestNumber matches and fields are null', async () => {
    const data = {
      paymentRequestNumber: 1,
      daxValue: 100,
      deltaAmount: 50,
      invoiceNumber: 'INV001',
      value: 200,
      someField: 'newValue'
    }

    const where = { filter: 'some-filter' }
    const relatedRequests = [
      {
        paymentRequestNumber: 1,
        daxValue: 50,
        deltaAmount: 30,
        daxPaymentRequestNumber: 1,
        invoiceNumber: 'INV001',
        value: 200,
        reportDataId: 1,
        someField: null
      }
    ]

    getDataFilter.mockReturnValue(where)
    db.reportData.findAll.mockResolvedValue(relatedRequests)

    const expectedUpdateData = {
      someField: 'newValue'
    }

    await updateReportData(data)

    expect(getDataFilter).toHaveBeenCalledWith(data)
    expect(db.reportData.findAll).toHaveBeenCalledWith({ where })
    expect(db.reportData.update).toHaveBeenCalledWith(expectedUpdateData, { where: { reportDataId: relatedRequests[0].reportDataId } })
  })

  test('should not update fields when paymentRequestNumber matches and no fields are null', async () => {
    const data = {
      paymentRequestNumber: 1,
      daxValue: 100,
      deltaAmount: 50,
      invoiceNumber: 'INV001',
      value: 200,
      someField: 'newValue'
    }

    const where = { filter: 'some-filter' }
    const relatedRequests = [
      {
        paymentRequestNumber: 1,
        daxValue: 50,
        deltaAmount: 30,
        daxPaymentRequestNumber: 1,
        invoiceNumber: 'INV001',
        value: 200,
        reportDataId: 1,
        someField: 'existingValue'
      }
    ]

    getDataFilter.mockReturnValue(where)
    db.reportData.findAll.mockResolvedValue(relatedRequests)

    await updateReportData(data)

    expect(getDataFilter).toHaveBeenCalledWith(data)
    expect(db.reportData.findAll).toHaveBeenCalledWith({ where })
    expect(db.reportData.update).not.toHaveBeenCalled()
  })
})
