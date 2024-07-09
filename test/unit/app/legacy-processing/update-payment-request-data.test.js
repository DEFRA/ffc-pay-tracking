const db = require('../../../../app/data')
const { getOverallStatus } = require('../../../../app/data-generation')
const { updatePaymentRequestData } = require('../../../../app/legacy-processing/update-payment-request-data')

jest.mock('../../../../app/data')
jest.mock('../../../../app/data-generation')

describe('update payment request data on migrated PR', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should update daxValue and overallStatus when paymentRequestNumber in the report data is greater', async () => {
    const paymentRequest = {
      paymentRequestNumber: 2,
      daxValue: 50,
      daxPaymentRequestNumber: 2,
      value: 200,
      reportDataId: 1
    }

    const data = {
      paymentRequestNumber: 1,
      daxValue: 150,
      daxPaymentRequestNumber: 1
    }

    getOverallStatus.mockReturnValue('Updated Status')

    const expectedUpdateData = {
      daxValue: 200,
      daxPaymentRequestNumber: 2,
      overallStatus: 'Updated Status',
      valueStillToProcess: 0
    }

    await updatePaymentRequestData(paymentRequest, data)

    expect(getOverallStatus).toHaveBeenCalledWith(paymentRequest.value, expectedUpdateData.daxValue, paymentRequest.paymentRequestNumber, expectedUpdateData.daxPaymentRequestNumber)
    expect(db.reportData.update).toHaveBeenCalledWith(expectedUpdateData, { where: { reportDataId: paymentRequest.reportDataId } })
  })

  test('should update daxValue, deltaAmount and overallStatus when paymentRequestNumber matches, and invoiceNumber is different', async () => {
    const paymentRequest = {
      paymentRequestNumber: 2,
      daxValue: -50,
      deltaAmount: -50,
      daxPaymentRequestNumber: 1,
      invoiceNumber: 'INV002',
      value: 200,
      reportDataId: 1
    }

    const data = {
      paymentRequestNumber: 2,
      daxValue: -50,
      deltaAmount: -50,
      daxPaymentRequestNumber: 2,
      invoiceNumber: 'INV001'
    }

    getOverallStatus.mockReturnValue('Updated Status')

    const expectedUpdateData = {
      daxValue: -100,
      daxPaymentRequestNumber: 2,
      deltaAmount: -100,
      overallStatus: 'Updated Status',
      valueStillToProcess: 300,
      prStillToProcess: 0
    }

    await updatePaymentRequestData(paymentRequest, data)

    expect(getOverallStatus).toHaveBeenCalledWith(paymentRequest.value, expectedUpdateData.daxValue, paymentRequest.paymentRequestNumber, expectedUpdateData.daxPaymentRequestNumber)
    expect(db.reportData.update).toHaveBeenCalledWith(expectedUpdateData, { where: { reportDataId: paymentRequest.reportDataId } })
  })

  test('should update fields when exact match found and fields are null', async () => {
    const paymentRequest = {
      paymentRequestNumber: 1,
      daxValue: 50,
      deltaAmount: 30,
      daxPaymentRequestNumber: 1,
      invoiceNumber: 'INV001',
      value: 200,
      reportDataId: 1,
      someField: null
    }

    const data = {
      paymentRequestNumber: 1,
      daxValue: 100,
      deltaAmount: 50,
      invoiceNumber: 'INV001',
      value: 200,
      someField: 'newValue'
    }

    const expectedUpdateData = {
      someField: 'newValue'
    }

    await updatePaymentRequestData(paymentRequest, data)

    expect(db.reportData.update).toHaveBeenCalledWith(expectedUpdateData, { where: { reportDataId: paymentRequest.reportDataId } })
  })

  test('should not update fields when exact match found, and no fields are null', async () => {
    const paymentRequest = {
      paymentRequestNumber: 1,
      daxValue: 50,
      deltaAmount: 30,
      daxPaymentRequestNumber: 1,
      invoiceNumber: 'INV001',
      value: 200,
      reportDataId: 1,
      someField: 'existingValue'
    }

    const data = {
      paymentRequestNumber: 1,
      daxValue: 100,
      deltaAmount: 50,
      invoiceNumber: 'INV001',
      value: 200,
      someField: 'newValue'
    }

    await updatePaymentRequestData(paymentRequest, data)

    expect(db.reportData.update).not.toHaveBeenCalled()
  })
})
