const moment = require('moment')
const { createData } = require('../../../../app/payment/create-data')
const { getARAmount, getDebtType, getFileName, getBatch, getBatchExportDate, getStatus, getValue, getRevenue, getYear, routedToRequestEditor, getDeltaAmount, getAPAmount, isImported, getSettledValue, getOriginalInvoiceNumber, getRequestEditorDate, isEnriched, getRequestEditorReleased, checkDAXPRN, checkDAXValue, getOverallStatus, getCrossBorderFlag } = require('../../../../app/data-generation')

jest.mock('../../../../app/data-generation/index')

describe('createData', () => {
  test('should create and return the expected data object', async () => {
    const mockEvent = {
      data: {
        correlationId: 'testCorrelationId',
        frn: 1234567890,
        contractNumber: 'testContractNumber',
        agreementNumber: 'testAgreementNumber',
        marketingYear: 2023,
        invoiceNumber: 'testInvoiceNumber',
        currency: 'testCurrency',
        paymentRequestNumber: 2,
        sourceSystem: 'testSourceSystem'
      },
      time: new Date()
    }
    const mockTransaction = {}

    getDeltaAmount.mockResolvedValue(500)
    getOriginalInvoiceNumber.mockReturnValue('testOriginalInvoiceNumber')
    getValue.mockReturnValue(2500)
    getBatch.mockReturnValue('testBatch')
    getBatchExportDate.mockReturnValue('testBatchExportDate')
    getStatus.mockReturnValue('testStatus')
    getRevenue.mockReturnValue('testRevenueOrCapital')
    getYear.mockReturnValue(2022)
    routedToRequestEditor.mockReturnValue('testRoutedToRequestEditor')
    getAPAmount.mockReturnValue(500)
    getARAmount.mockReturnValue(0)
    getDebtType.mockReturnValue('testDebtType')
    getFileName.mockReturnValue('testDaxFileName')
    isImported.mockReturnValue('testDaxImported')
    getSettledValue.mockReturnValue('testSettledValue')
    getRequestEditorDate.mockReturnValue('testRequestEditorDate')
    isEnriched.mockReturnValue('testEnriched')
    getRequestEditorReleased.mockReturnValue('testRequestEditorReleased')
    checkDAXPRN.mockResolvedValue(1)
    checkDAXValue.mockResolvedValue(2000)
    getOverallStatus.mockReturnValue('testOverallStatus')
    getCrossBorderFlag.mockReturnValue('testCrossBorderFlag')

    const expectedData = {
      correlationId: 'testCorrelationId',
      frn: 1234567890,
      claimNumber: 'testContractNumber',
      agreementNumber: 'testAgreementNumber',
      marketingYear: 2023,
      originalInvoiceNumber: 'testOriginalInvoiceNumber',
      invoiceNumber: 'testInvoiceNumber',
      currency: 'testCurrency',
      paymentRequestNumber: 2,
      value: 2500,
      batch: 'testBatch',
      sourceSystem: 'testSourceSystem',
      batchExportDate: 'testBatchExportDate',
      status: 'testStatus',
      lastUpdated: moment(mockEvent.time).format(),
      revenueOrCapital: 'testRevenueOrCapital',
      year: 2022,
      routedToRequestEditor: 'testRoutedToRequestEditor',
      deltaAmount: 500,
      apValue: 500,
      arValue: 0,
      debtType: 'testDebtType',
      daxFileName: 'testDaxFileName',
      daxImported: 'testDaxImported',
      settledValue: 'testSettledValue',
      receivedInRequestEditor: 'testRequestEditorDate',
      enriched: 'testEnriched',
      releasedFromRequestEditor: 'testRequestEditorReleased',
      daxPaymentRequestNumber: 1,
      daxValue: 2000,
      overallStatus: 'testOverallStatus',
      crossBorderFlag: 'testCrossBorderFlag',
      valueStillToProcess: 2500 - 2000,
      prStillToProcess: 2 - 1,
      phError: null,
      daxError: null
    }

    const data = await createData(mockEvent, mockTransaction)

    expect(data).toEqual(expectedData)
  })

  test('should set valueStillToProcess to null and thus not be in final data when getValue returns null', async () => {
    const mockEvent = {
      data: {
        correlationId: 'testCorrelationId',
        frn: 1234567890,
        contractNumber: 'testContractNumber',
        agreementNumber: 'testAgreementNumber',
        marketingYear: 2023,
        invoiceNumber: 'testInvoiceNumber',
        currency: 'testCurrency',
        paymentRequestNumber: 2,
        sourceSystem: 'testSourceSystem'
      },
      time: new Date()
    }
    const mockTransaction = {}

    getValue.mockReturnValue(null)
    checkDAXValue.mockResolvedValue(2000)

    const data = await createData(mockEvent, mockTransaction)
    expect(data.valueStillToProcess).toBeUndefined()
  })
})
