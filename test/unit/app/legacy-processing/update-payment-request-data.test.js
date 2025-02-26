const db = require('../../../../app/data')
const { getOverallStatus } = require('../../../../app/data-generation')
const { updatePaymentRequestData } = require('../../../../app/legacy-processing/update-payment-request-data')

jest.mock('../../../../app/data')
jest.mock('../../../../app/data-generation')

describe('update payment request data on migrated PR', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should compute update data and update report data when related paymentRequestNumber is greater', async () => {
    const relatedPaymentRequest = {
      paymentRequestNumber: 2,
      daxValue: 50,
      daxPaymentRequestNumber: 2,
      value: 200,
      reportDataId: 1
    }

    const currentPaymentRequest = {
      paymentRequestNumber: 1,
      daxValue: 150,
      daxPaymentRequestNumber: 1,
      value: 100
    }

    getOverallStatus.mockReturnValue('Updated Status')

    const expectedUpdateData = {
      daxValue: 200,
      daxPaymentRequestNumber: 2,
      deltaAmount: 100,
      overallStatus: 'Updated Status',
      valueStillToProcess: 0
    }

    await updatePaymentRequestData(relatedPaymentRequest, currentPaymentRequest)

    expect(getOverallStatus).toHaveBeenCalledWith(
      relatedPaymentRequest.value,
      expectedUpdateData.daxValue,
      relatedPaymentRequest.paymentRequestNumber,
      expectedUpdateData.daxPaymentRequestNumber
    )
    expect(db.reportData.update).toHaveBeenCalledWith(expectedUpdateData, { where: { reportDataId: relatedPaymentRequest.reportDataId } })
  })

  test('should update daxValue and overallStatus when paymentRequestNumber matches and invoiceNumber is different', async () => {
    const relatedPaymentRequest = {
      paymentRequestNumber: 2,
      daxValue: -50,
      daxPaymentRequestNumber: 1,
      invoiceNumber: 'INV002',
      value: 200,
      reportDataId: 1
    }

    const currentPaymentRequest = {
      paymentRequestNumber: 2,
      daxValue: -50,
      daxPaymentRequestNumber: 2,
      invoiceNumber: 'INV001'
    }

    getOverallStatus.mockReturnValue('Updated Status')

    const expectedUpdateData = {
      daxValue: -100,
      daxPaymentRequestNumber: 2,
      overallStatus: 'Updated Status',
      valueStillToProcess: 300,
      prStillToProcess: 0
    }

    await updatePaymentRequestData(relatedPaymentRequest, currentPaymentRequest)

    expect(getOverallStatus).toHaveBeenCalledWith(
      relatedPaymentRequest.value,
      expectedUpdateData.daxValue,
      relatedPaymentRequest.paymentRequestNumber,
      expectedUpdateData.daxPaymentRequestNumber
    )
    expect(db.reportData.update).toHaveBeenCalledWith(expectedUpdateData, { where: { reportDataId: relatedPaymentRequest.reportDataId } })
    expect(db.reportData.update).toHaveBeenCalledWith(expectedUpdateData, { where: { reportDataId: currentPaymentRequest.reportDataId } })
  })

  test('should set ledgerSplit to "Y" when paymentRequestNumber matches and ledgers are "AP" and "AR"', async () => {
    const relatedPaymentRequest = {
      paymentRequestNumber: 2,
      daxValue: -50,
      daxPaymentRequestNumber: 1,
      invoiceNumber: 'INV002',
      value: 200,
      reportDataId: 1,
      ledger: 'AP'
    }

    const currentPaymentRequest = {
      paymentRequestNumber: 2,
      daxValue: -50,
      daxPaymentRequestNumber: 2,
      invoiceNumber: 'INV001',
      ledger: 'AR'
    }

    getOverallStatus.mockReturnValue('Updated Status')

    const expectedUpdateData = {
      daxValue: -100,
      daxPaymentRequestNumber: 2,
      overallStatus: 'Updated Status',
      valueStillToProcess: 300,
      prStillToProcess: 0,
      ledgerSplit: 'Y'
    }

    await updatePaymentRequestData(relatedPaymentRequest, currentPaymentRequest)

    expect(getOverallStatus).toHaveBeenCalledWith(
      relatedPaymentRequest.value,
      expectedUpdateData.daxValue,
      relatedPaymentRequest.paymentRequestNumber,
      expectedUpdateData.daxPaymentRequestNumber
    )
    expect(db.reportData.update).toHaveBeenCalledWith(expectedUpdateData, { where: { reportDataId: relatedPaymentRequest.reportDataId } })
    expect(db.reportData.update).toHaveBeenCalledWith(expectedUpdateData, { where: { reportDataId: currentPaymentRequest.reportDataId } })
  })

  test('should update fields when matching fields are null in related payment request', async () => {
    const relatedPaymentRequest = {
      paymentRequestNumber: 1,
      daxValue: 50,
      daxPaymentRequestNumber: 1,
      invoiceNumber: 'INV001',
      value: 200,
      reportDataId: 1,
      someField: null
    }

    const currentPaymentRequest = {
      paymentRequestNumber: 1,
      daxValue: 100,
      daxPaymentRequestNumber: 1,
      invoiceNumber: 'INV001',
      value: 200,
      someField: 'newValue'
    }

    const expectedUpdateData = {
      someField: 'newValue'
    }

    await updatePaymentRequestData(relatedPaymentRequest, currentPaymentRequest)

    expect(db.reportData.update).toHaveBeenCalledWith(expectedUpdateData, { where: { reportDataId: relatedPaymentRequest.reportDataId } })
  })

  test('should not update fields when there are no null fields in related payment request', async () => {
    const relatedPaymentRequest = {
      paymentRequestNumber: 1,
      daxValue: 50,
      daxPaymentRequestNumber: 1,
      invoiceNumber: 'INV001',
      value: 200,
      reportDataId: 1,
      someField: 'existingValue'
    }

    const currentPaymentRequest = {
      paymentRequestNumber: 1,
      daxValue: 100,
      daxPaymentRequestNumber: 1,
      invoiceNumber: 'INV001',
      value: 200,
      someField: 'newValue'
    }

    await updatePaymentRequestData(relatedPaymentRequest, currentPaymentRequest)

    expect(db.reportData.update).not.toHaveBeenCalled()
  })

  test('should destroy current report data when exact match found and invoice number is the same', async () => {
    const relatedPaymentRequest = {
      paymentRequestNumber: 1,
      daxValue: 50,
      daxPaymentRequestNumber: 1,
      invoiceNumber: 'INV001',
      value: 200,
      reportDataId: 1,
      someField: 'existingValue'
    }

    const currentPaymentRequest = {
      paymentRequestNumber: 1,
      daxValue: 50,
      daxPaymentRequestNumber: 1,
      invoiceNumber: 'INV001',
      value: 200,
      reportDataId: 2
    }

    await updatePaymentRequestData(relatedPaymentRequest, currentPaymentRequest)

    expect(db.reportData.destroy).toHaveBeenCalledWith({ where: { reportDataId: currentPaymentRequest.reportDataId } })
  })
})
