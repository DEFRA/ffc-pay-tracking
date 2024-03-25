const moment = require('moment')
const { createData } = require('../../../../app/payment/create-data')
const { getARAmount, getDebtType, getFileName, getBatch, getBatchExportDate, getStatus, getValue, getRevenue, getYear, routedToRequestEditor, getDeltaAmount, getAPAmount, isImported, getSettledValue, getOriginalInvoiceNumber } = require('../../../../app/data-generation/index')

jest.mock('../../../../app/data-generation/index')

describe('createData', () => {
  test('should create and return the expected data object', async () => {
    const mockEvent = {
      data: {
        correlationId: 'testCorrelationId',
        frn: 'testFrn',
        contractNumber: 'testContractNumber',
        agreementNumber: 'testAgreementNumber',
        marketingYear: 'testMarketingYear',
        invoiceNumber: 'testInvoiceNumber',
        currency: 'testCurrency',
        paymentRequestNumber: 'testPaymentRequestNumber',
        sourceSystem: 'testSourceSystem'
      },
      time: new Date()
    }
    const mockTransaction = {}

    getDeltaAmount.mockResolvedValue('testDeltaAmount')
    getOriginalInvoiceNumber.mockReturnValue('testOriginalInvoiceNumber')
    getValue.mockReturnValue('testValue')
    getBatch.mockReturnValue('testBatch')
    getBatchExportDate.mockReturnValue('testBatchExportDate')
    getStatus.mockReturnValue('testStatus')
    getRevenue.mockReturnValue('testRevenueOrCapital')
    getYear.mockReturnValue('testYear')
    routedToRequestEditor.mockReturnValue('testRoutedToRequestEditor')
    getAPAmount.mockReturnValue('testAPValue')
    getARAmount.mockReturnValue('testARValue')
    getDebtType.mockReturnValue('testDebtType')
    getFileName.mockReturnValue('testDaxFileName')
    isImported.mockReturnValue('testDaxImported')
    getSettledValue.mockReturnValue('testSettledValue')

    const expectedData = {
      correlationId: 'testCorrelationId',
      frn: 'testFrn',
      claimNumber: 'testContractNumber',
      agreementNumber: 'testAgreementNumber',
      marketingYear: 'testMarketingYear',
      originalInvoiceNumber: 'testOriginalInvoiceNumber',
      invoiceNumber: 'testInvoiceNumber',
      currency: 'testCurrency',
      paymentRequestNumber: 'testPaymentRequestNumber',
      value: 'testValue',
      batch: 'testBatch',
      sourceSystem: 'testSourceSystem',
      batchExportDate: 'testBatchExportDate',
      status: 'testStatus',
      lastUpdated: moment(mockEvent.time).format(),
      revenueOrCapital: 'testRevenueOrCapital',
      year: 'testYear',
      routedToRequestEditor: 'testRoutedToRequestEditor',
      deltaAmount: 'testDeltaAmount',
      apValue: 'testAPValue',
      arValue: 'testARValue',
      debtType: 'testDebtType',
      daxFileName: 'testDaxFileName',
      daxImported: 'testDaxImported',
      settledValue: 'testSettledValue',
      phError: null,
      daxError: null
    }

    const data = await createData(mockEvent, mockTransaction)

    expect(data).toEqual(expectedData)
  })
})
