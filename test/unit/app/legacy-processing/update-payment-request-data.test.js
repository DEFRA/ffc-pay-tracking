const db = require('../../../../app/data')
const { getOverallStatus } = require('../../../../app/data-generation')
const { updatePaymentRequestData } = require('../../../../app/legacy-processing/update-payment-request-data')

jest.mock('../../../../app/data')
jest.mock('../../../../app/data-generation')

describe('updatePaymentRequestData', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should compute update data and update report when related PR number is greater', async () => {
    const relatedPR = { paymentRequestNumber: 2, daxValue: 50, daxPaymentRequestNumber: 2, value: 200, reportDataId: 1 }
    const currentPR = { paymentRequestNumber: 1, daxValue: 150, daxPaymentRequestNumber: 1, value: 100 }

    getOverallStatus.mockReturnValue('Updated Status')

    const expectedData = {
      daxValue: 200,
      daxPaymentRequestNumber: 2,
      deltaAmount: 100,
      overallStatus: 'Updated Status',
      valueStillToProcess: 0
    }

    await updatePaymentRequestData(relatedPR, currentPR)

    expect(getOverallStatus).toHaveBeenCalledWith(relatedPR.value, expectedData.daxValue, relatedPR.paymentRequestNumber, expectedData.daxPaymentRequestNumber)
    expect(db.reportData.update).toHaveBeenCalledWith(expectedData, { where: { reportDataId: relatedPR.reportDataId } })
  })

  test('should update daxValue and overallStatus when PR numbers match but invoice numbers differ', async () => {
    const relatedPR = { paymentRequestNumber: 2, daxValue: -50, daxPaymentRequestNumber: 1, invoiceNumber: 'INV002', value: 200, reportDataId: 1 }
    const currentPR = { paymentRequestNumber: 2, daxValue: -50, daxPaymentRequestNumber: 2, invoiceNumber: 'INV001' }

    getOverallStatus.mockReturnValue('Updated Status')

    const expectedData = {
      daxValue: -100,
      daxPaymentRequestNumber: 2,
      overallStatus: 'Updated Status',
      valueStillToProcess: 300,
      prStillToProcess: 0
    }

    await updatePaymentRequestData(relatedPR, currentPR)

    expect(getOverallStatus).toHaveBeenCalledWith(relatedPR.value, expectedData.daxValue, relatedPR.paymentRequestNumber, expectedData.daxPaymentRequestNumber)
    expect(db.reportData.update).toHaveBeenCalledWith(expectedData, { where: { reportDataId: relatedPR.reportDataId } })
    expect(db.reportData.update).toHaveBeenCalledWith(expectedData, { where: { reportDataId: currentPR.reportDataId } })
  })

  test('should set ledgerSplit to "Y" when ledgers are "AP" and "AR"', async () => {
    const relatedPR = { paymentRequestNumber: 2, daxValue: -50, daxPaymentRequestNumber: 1, invoiceNumber: 'INV002', value: 200, reportDataId: 1, ledger: 'AP' }
    const currentPR = { paymentRequestNumber: 2, daxValue: -50, daxPaymentRequestNumber: 2, invoiceNumber: 'INV001', ledger: 'AR' }

    getOverallStatus.mockReturnValue('Updated Status')

    const expectedData = {
      daxValue: -100,
      daxPaymentRequestNumber: 2,
      overallStatus: 'Updated Status',
      valueStillToProcess: 300,
      prStillToProcess: 0,
      ledgerSplit: 'Y'
    }

    await updatePaymentRequestData(relatedPR, currentPR)

    expect(db.reportData.update).toHaveBeenCalledWith(expectedData, { where: { reportDataId: relatedPR.reportDataId } })
    expect(db.reportData.update).toHaveBeenCalledWith(expectedData, { where: { reportDataId: currentPR.reportDataId } })
  })

  test('should update fields when related PR has null fields', async () => {
    const relatedPR = { paymentRequestNumber: 1, daxValue: 50, daxPaymentRequestNumber: 1, invoiceNumber: 'INV001', value: 200, reportDataId: 1, someField: null }
    const currentPR = { paymentRequestNumber: 1, daxValue: 100, daxPaymentRequestNumber: 1, invoiceNumber: 'INV001', value: 200, someField: 'newValue' }

    const expectedData = { someField: 'newValue' }

    await updatePaymentRequestData(relatedPR, currentPR)
    expect(db.reportData.update).toHaveBeenCalledWith(expectedData, { where: { reportDataId: relatedPR.reportDataId } })
  })

  test('should not update when there are no null fields in related PR', async () => {
    const relatedPR = { paymentRequestNumber: 1, daxValue: 50, daxPaymentRequestNumber: 1, invoiceNumber: 'INV001', value: 200, reportDataId: 1, someField: 'existingValue' }
    const currentPR = { paymentRequestNumber: 1, daxValue: 100, daxPaymentRequestNumber: 1, invoiceNumber: 'INV001', value: 200, someField: 'newValue' }

    await updatePaymentRequestData(relatedPR, currentPR)
    expect(db.reportData.update).not.toHaveBeenCalled()
  })

  test('should destroy current report data if exact match found and invoice numbers match', async () => {
    const relatedPR = { paymentRequestNumber: 1, daxValue: 50, daxPaymentRequestNumber: 1, invoiceNumber: 'INV001', value: 200, reportDataId: 1, someField: 'existingValue' }
    const currentPR = { paymentRequestNumber: 1, daxValue: 50, daxPaymentRequestNumber: 1, invoiceNumber: 'INV001', value: 200, reportDataId: 2 }

    await updatePaymentRequestData(relatedPR, currentPR)
    expect(db.reportData.destroy).toHaveBeenCalledWith({ where: { reportDataId: currentPR.reportDataId } })
  })
})
