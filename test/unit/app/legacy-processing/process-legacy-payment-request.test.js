const { processLegacyPaymentRequest } = require('../../../../app/legacy-processing/process-legacy-payment-request')
const { calculateApproximateREReceivedDateTime } = require('../../../../app/legacy-processing/calculate-approximate-re-received-datetime')
const { calculateDeltaAmount } = require('../../../../app/legacy-processing/calculate-delta-amount')
const { calculateLedgerValue } = require('../../../../app/legacy-processing/calculate-ledger-value')
const { checkIfRevenueOrCapital } = require('../../../../app/legacy-processing/check-if-revenue-or-capital')
const { getLastUpdatedDate } = require('../../../../app/legacy-processing/get-last-updated-date')
const { getStatusDaxImported } = require('../../../../app/legacy-processing/get-status-dax-imported')
const { getYear } = require('../../../../app/legacy-processing/get-year')
const { calculateDAXPRN } = require('../../../../app/legacy-processing/calculate-dax-prn')
const { calculateDAXValue } = require('../../../../app/legacy-processing/calculate-dax-value')
const { getOverallStatus } = require('../../../../app/data-generation')
const { checkCrossBorderType } = require('../../../../app/legacy-processing/check-cross-border-type')
const { updateReportData } = require('../../../../app/legacy-processing/update-report-data')
const { REVENUE } = require('../../../../app/constants/cs-types')
const { SFI, FDMR } = require('../../../../app/constants/schemes')
const { CS, BPS } = require('../../../../app/constants/source-systems')

jest.mock('../../../../app/legacy-processing/calculate-approximate-re-received-datetime')
jest.mock('../../../../app/legacy-processing/calculate-delta-amount')
jest.mock('../../../../app/legacy-processing/calculate-ledger-value')
jest.mock('../../../../app/legacy-processing/check-if-revenue-or-capital')
jest.mock('../../../../app/legacy-processing/get-last-updated-date')
jest.mock('../../../../app/legacy-processing/get-status-dax-imported') // Updated to mock the correct function
jest.mock('../../../../app/legacy-processing/get-year')
jest.mock('../../../../app/legacy-processing/calculate-dax-prn')
jest.mock('../../../../app/legacy-processing/calculate-dax-value')
jest.mock('../../../../app/data-generation')
jest.mock('../../../../app/legacy-processing/check-cross-border-type')
jest.mock('../../../../app/legacy-processing/update-report-data')

describe('process legacy payment requests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should call updateReportData with correct data for completed payment requests', async () => {
    const paymentRequest = {
      correlationId: 'correlationId',
      schemeId: SFI,
      completedPaymentRequests: [
        {
          frn: 1234567890,
          contractNumber: 'contractNumber',
          agreementNumber: 'agreementNumber',
          marketingYear: 2023,
          invoiceNumber: 'invoiceNumber',
          currency: 'GBP',
          paymentRequestNumber: 3,
          batch: 'batch.csv',
          sourceSystem: 'sourceSystem',
          debtType: 'irr',
          acknowledged: true,
          settledValue: 1000,
          submitted: '2023-01-01T00:00:00Z'
        }
      ],
      value: 1000
    }

    calculateLedgerValue.mockReturnValueOnce(500).mockReturnValueOnce(500)
    calculateDAXValue.mockReturnValue(200)
    calculateDAXPRN.mockReturnValue(2)
    calculateDeltaAmount.mockReturnValue(300)
    getStatusDaxImported.mockReturnValue({ status: 'Settled by payment ledger', daxImported: 'Y' }) // Adjusted mock return value
    getLastUpdatedDate.mockReturnValue('2023-01-01T00:00:00Z')
    checkIfRevenueOrCapital.mockReturnValue(REVENUE)
    getYear.mockReturnValue(2023)
    calculateApproximateREReceivedDateTime.mockReturnValue('2023-01-01T00:00:00Z')
    getOverallStatus.mockReturnValue('overallStatus')
    checkCrossBorderType.mockReturnValue('N')

    const expectedData = {
      correlationId: 'correlationId',
      frn: 1234567890,
      claimNumber: 'contractNumber',
      agreementNumber: 'agreementNumber',
      marketingYear: 2023,
      originalInvoiceNumber: null,
      invoiceNumber: 'invoiceNumber',
      currency: 'GBP',
      paymentRequestNumber: 3,
      value: 1000,
      batch: 'batch.csv',
      sourceSystem: 'sourceSystem',
      batchExportDate: null,
      status: 'Settled by payment ledger', // Updated expected value
      lastUpdated: '2023-01-01T00:00:00Z',
      revenueOrCapital: REVENUE,
      year: 2023,
      routedToRequestEditor: 'Y',
      deltaAmount: 300,
      apValue: 500,
      arValue: 500,
      debtType: 'Irregular',
      daxFileName: null,
      daxImported: 'Y', // Updated expected value
      settledValue: 1000,
      phError: null,
      daxError: null,
      receivedInRequestEditor: '2023-01-01T00:00:00Z',
      enriched: 'Y',
      ledgerSplit: 'Y',
      releasedFromRequestEditor: '2023-01-01T00:00:00Z',
      daxPaymentRequestNumber: 2,
      daxValue: 200,
      overallStatus: 'overallStatus',
      crossBorderFlag: 'N',
      valueStillToProcess: 800,
      prStillToProcess: 1,
      fdmrSchemeCode: null
    }

    await processLegacyPaymentRequest(paymentRequest)
    expect(updateReportData).toHaveBeenCalledWith(expectedData, SFI)
  })

  test('should call updateReportData with correct data for FDMR scheme including fdmrSchemeCode', async () => {
    const paymentRequest = {
      correlationId: 'correlationId',
      schemeId: FDMR,
      completedPaymentRequests: [
        {
          frn: 1234567890,
          contractNumber: 'contractNumber',
          agreementNumber: 'agreementNumber',
          marketingYear: 2023,
          invoiceNumber: 'invoiceNumber',
          currency: 'GBP',
          paymentRequestNumber: 3,
          batch: 'batch.csv',
          sourceSystem: 'sourceSystem',
          debtType: 'adm',
          acknowledged: true,
          settledValue: 1000,
          submitted: '2023-01-01T00:00:00Z'
        }
      ],
      invoiceLines: [{
        schemeCode: 'SOS270'
      }],
      value: 1000
    }

    calculateLedgerValue.mockReturnValueOnce(500).mockReturnValueOnce(500)
    calculateDAXValue.mockReturnValue(200)
    calculateDAXPRN.mockReturnValue(2)
    calculateDeltaAmount.mockReturnValue(300)
    getStatusDaxImported.mockReturnValue({ status: 'Settled by payment ledger', daxImported: 'Y' })
    getLastUpdatedDate.mockReturnValue('2023-01-01T00:00:00Z')
    checkIfRevenueOrCapital.mockReturnValue(REVENUE)
    getYear.mockReturnValue(2023)
    calculateApproximateREReceivedDateTime.mockReturnValue('2023-01-01T00:00:00Z')
    getOverallStatus.mockReturnValue('overallStatus')
    checkCrossBorderType.mockReturnValue('N')

    const expectedData = {
      correlationId: 'correlationId',
      frn: 1234567890,
      claimNumber: 'contractNumber',
      agreementNumber: 'agreementNumber',
      fdmrSchemeCode: 'SOS270',
      marketingYear: 2023,
      originalInvoiceNumber: null,
      invoiceNumber: 'invoiceNumber',
      currency: 'GBP',
      paymentRequestNumber: 3,
      value: 1000,
      batch: 'batch.csv',
      sourceSystem: 'sourceSystem',
      batchExportDate: null,
      status: 'Settled by payment ledger',
      lastUpdated: '2023-01-01T00:00:00Z',
      revenueOrCapital: REVENUE,
      year: 2023,
      routedToRequestEditor: 'Y',
      deltaAmount: 300,
      apValue: 500,
      arValue: 500,
      debtType: 'Administrative',
      daxFileName: null,
      daxImported: 'Y',
      settledValue: 1000,
      phError: null,
      daxError: null,
      receivedInRequestEditor: '2023-01-01T00:00:00Z',
      enriched: 'Y',
      ledgerSplit: 'Y',
      releasedFromRequestEditor: '2023-01-01T00:00:00Z',
      daxPaymentRequestNumber: 2,
      daxValue: 200,
      overallStatus: 'overallStatus',
      crossBorderFlag: 'N',
      valueStillToProcess: 800,
      prStillToProcess: 1
    }

    await processLegacyPaymentRequest(paymentRequest)
    expect(updateReportData).toHaveBeenCalledWith(expectedData, FDMR)
  })

  test('should set ledgerSplit to "Y" when apValue and arValue are non-zero', async () => {
    const paymentRequest = {
      correlationId: 'correlationId',
      schemeId: SFI,
      completedPaymentRequests: [
        {
          frn: 1234567890,
          contractNumber: 'contractNumber',
          agreementNumber: 'agreementNumber',
          marketingYear: 2023,
          invoiceNumber: 'invoiceNumber',
          currency: 'GBP',
          paymentRequestNumber: 3,
          batch: 'batch.csv',
          sourceSystem: 'sourceSystem',
          debtType: 'unk',
          acknowledged: true,
          settledValue: 1000,
          submitted: '2023-01-01T00:00:00Z'
        }
      ],
      value: 1000
    }

    calculateLedgerValue.mockReturnValueOnce(300).mockReturnValueOnce(400)
    calculateDAXValue.mockReturnValue(200)
    calculateDAXPRN.mockReturnValue(2)
    calculateDeltaAmount.mockReturnValue(300)
    getStatusDaxImported.mockReturnValue({ status: 'Settled by payment ledger', daxImported: 'Y' })
    getLastUpdatedDate.mockReturnValue('2023-01-01T00:00:00Z')
    checkIfRevenueOrCapital.mockReturnValue(REVENUE)
    getYear.mockReturnValue(2023)
    calculateApproximateREReceivedDateTime.mockReturnValue('2023-01-01T00:00:00Z')
    getOverallStatus.mockReturnValue('overallStatus')
    checkCrossBorderType.mockReturnValue('N')

    const expectedData = {
      correlationId: 'correlationId',
      frn: 1234567890,
      claimNumber: 'contractNumber',
      agreementNumber: 'agreementNumber',
      marketingYear: 2023,
      originalInvoiceNumber: null,
      invoiceNumber: 'invoiceNumber',
      currency: 'GBP',
      paymentRequestNumber: 3,
      value: 1000,
      batch: 'batch.csv',
      sourceSystem: 'sourceSystem',
      batchExportDate: null,
      status: 'Settled by payment ledger',
      lastUpdated: '2023-01-01T00:00:00Z',
      revenueOrCapital: REVENUE,
      year: 2023,
      routedToRequestEditor: 'Y',
      deltaAmount: 300,
      apValue: 300,
      arValue: 400,
      debtType: null,
      daxFileName: null,
      daxImported: 'Y',
      settledValue: 1000,
      phError: null,
      daxError: null,
      receivedInRequestEditor: '2023-01-01T00:00:00Z',
      enriched: 'Y',
      ledgerSplit: 'Y', // apValue and arValue are non-zero, so ledgerSplit is 'Y'
      releasedFromRequestEditor: '2023-01-01T00:00:00Z',
      daxPaymentRequestNumber: 2,
      daxValue: 200,
      overallStatus: 'overallStatus',
      crossBorderFlag: 'N',
      valueStillToProcess: 800,
      prStillToProcess: 1,
      fdmrSchemeCode: null
    }

    await processLegacyPaymentRequest(paymentRequest)
    expect(updateReportData).toHaveBeenCalledWith(expectedData, SFI)
  })

  test('should call updateReportData with primary paymentRequest when no completedPaymentRequests are provided', async () => {
    const paymentRequest = {
      correlationId: 'correlationId',
      schemeId: SFI,
      frn: 1234567890,
      contractNumber: 'contractNumber',
      agreementNumber: 'agreementNumber',
      marketingYear: 2023,
      invoiceNumber: 'invoiceNumber',
      currency: 'GBP',
      paymentRequestNumber: 1,
      batch: 'batch.csv',
      sourceSystem: 'sourceSystem',
      value: 1000,
      settledValue: 1000
    }

    calculateLedgerValue.mockReturnValueOnce(500).mockReturnValueOnce(500)
    calculateDAXValue.mockReturnValue(200)
    calculateDAXPRN.mockReturnValue(1)
    calculateDeltaAmount.mockReturnValue(300)
    getStatusDaxImported.mockReturnValue({ status: 'Settled by payment ledger', daxImported: 'N' }) // Updated mock return value
    getLastUpdatedDate.mockReturnValue('2023-01-01T00:00:00Z')
    checkIfRevenueOrCapital.mockReturnValue(REVENUE)
    getYear.mockReturnValue(2023)
    calculateApproximateREReceivedDateTime.mockReturnValue('2023-01-01T00:00:00Z')
    getOverallStatus.mockReturnValue('overallStatus')
    checkCrossBorderType.mockReturnValue('N')

    const expectedData = {
      correlationId: 'correlationId',
      frn: 1234567890,
      claimNumber: 'contractNumber',
      agreementNumber: 'agreementNumber',
      marketingYear: 2023,
      originalInvoiceNumber: null,
      invoiceNumber: 'invoiceNumber',
      currency: 'GBP',
      paymentRequestNumber: 1,
      value: 1000,
      batch: 'batch.csv',
      sourceSystem: 'sourceSystem',
      batchExportDate: null,
      status: 'Settled by payment ledger', // Updated expected value
      lastUpdated: '2023-01-01T00:00:00Z',
      revenueOrCapital: REVENUE,
      year: 2023,
      routedToRequestEditor: 'N',
      deltaAmount: 300,
      apValue: 500,
      arValue: 500,
      debtType: null,
      daxFileName: null,
      daxImported: 'N', // Updated expected value
      settledValue: 1000,
      phError: null,
      daxError: null,
      receivedInRequestEditor: '2023-01-01T00:00:00Z',
      enriched: null,
      ledgerSplit: 'Y',
      releasedFromRequestEditor: null,
      daxPaymentRequestNumber: 1,
      daxValue: 200,
      overallStatus: 'overallStatus',
      crossBorderFlag: 'N',
      valueStillToProcess: 800,
      prStillToProcess: 0,
      fdmrSchemeCode: null
    }

    await processLegacyPaymentRequest(paymentRequest)
    expect(updateReportData).toHaveBeenCalledWith(expectedData, SFI)
  })

  test('should set enriched to "N" when debtType is missing and routedToRequestEditor is "Y"', async () => {
    const paymentRequest = {
      correlationId: 'correlationId',
      schemeId: SFI,
      frn: 1234567890,
      contractNumber: 'contractNumber',
      agreementNumber: 'agreementNumber',
      marketingYear: 2023,
      invoiceNumber: 'invoiceNumber',
      currency: 'GBP',
      paymentRequestNumber: 3,
      batch: 'batch.csv',
      sourceSystem: 'sourceSystem',
      acknowledged: true,
      settledValue: 1000,
      submitted: '2023-01-01T00:00:00Z',
      completedPaymentRequests: [],
      value: 1000
    }

    calculateLedgerValue.mockReturnValueOnce(500).mockReturnValueOnce(500)
    calculateDAXValue.mockReturnValue(200)
    calculateDAXPRN.mockReturnValue(2)
    calculateDeltaAmount.mockReturnValue(300)
    getStatusDaxImported.mockReturnValue({ status: 'Settled by payment ledger', daxImported: 'N' }) // Updated mock return value
    getLastUpdatedDate.mockReturnValue('2023-01-01T00:00:00Z')
    checkIfRevenueOrCapital.mockReturnValue(REVENUE)
    getYear.mockReturnValue(2023)
    calculateApproximateREReceivedDateTime.mockReturnValue('2023-01-01T00:00:00Z')
    getOverallStatus.mockReturnValue('overallStatus')
    checkCrossBorderType.mockReturnValue('N')

    const expectedData = {
      correlationId: 'correlationId',
      frn: 1234567890,
      claimNumber: 'contractNumber',
      agreementNumber: 'agreementNumber',
      marketingYear: 2023,
      originalInvoiceNumber: null,
      invoiceNumber: 'invoiceNumber',
      currency: 'GBP',
      paymentRequestNumber: 3,
      value: 1000,
      batch: 'batch.csv',
      sourceSystem: 'sourceSystem',
      batchExportDate: null,
      status: 'Settled by payment ledger', // Updated expected value
      lastUpdated: '2023-01-01T00:00:00Z',
      revenueOrCapital: REVENUE,
      year: 2023,
      routedToRequestEditor: 'Y',
      deltaAmount: 300,
      apValue: 500,
      arValue: 500,
      debtType: null,
      daxFileName: null,
      daxImported: 'N',
      settledValue: 1000,
      phError: null,
      daxError: null,
      receivedInRequestEditor: '2023-01-01T00:00:00Z',
      enriched: 'N', // Updated expected value
      ledgerSplit: 'Y',
      releasedFromRequestEditor: undefined,
      daxPaymentRequestNumber: 2,
      daxValue: 200,
      overallStatus: 'overallStatus',
      crossBorderFlag: 'N',
      valueStillToProcess: 800,
      prStillToProcess: 1,
      fdmrSchemeCode: null
    }

    await processLegacyPaymentRequest(paymentRequest)
    expect(updateReportData).toHaveBeenCalledWith(expectedData, SFI)
  })

  // Additional tests for 'releasedFromRequestEditor'
  test('should set releasedFromRequestEditor to null if sourceSystem is CS', async () => {
    const paymentRequest = {
      correlationId: 'correlationId',
      schemeId: SFI,
      completedPaymentRequests: [
        {
          frn: 1234567890,
          contractNumber: 'contractNumber',
          agreementNumber: 'agreementNumber',
          marketingYear: 2023,
          invoiceNumber: 'invoiceNumber',
          currency: 'GBP',
          paymentRequestNumber: 3,
          batch: 'batch.csv',
          sourceSystem: CS,
          debtType: 'irr',
          acknowledged: true,
          settledValue: 1000,
          submitted: '2023-01-01T00:00:00Z'
        }
      ],
      value: 1000
    }

    calculateLedgerValue.mockReturnValueOnce(500).mockReturnValueOnce(500)
    calculateDAXValue.mockReturnValue(200)
    calculateDAXPRN.mockReturnValue(2)
    calculateDeltaAmount.mockReturnValue(300)
    getStatusDaxImported.mockReturnValue({ status: 'Settled by payment ledger', daxImported: 'Y' })
    getLastUpdatedDate.mockReturnValue('2023-01-01T00:00:00Z')
    checkIfRevenueOrCapital.mockReturnValue(REVENUE)
    getYear.mockReturnValue(2023)
    calculateApproximateREReceivedDateTime.mockReturnValue('2023-01-01T00:00:00Z')
    getOverallStatus.mockReturnValue('overallStatus')
    checkCrossBorderType.mockReturnValue('N')

    await processLegacyPaymentRequest(paymentRequest)

    expect(updateReportData).toHaveBeenCalledWith(expect.objectContaining({
      releasedFromRequestEditor: null
    }), SFI)
  })

  test('should set releasedFromRequestEditor to null if sourceSystem is BPS', async () => {
    const paymentRequest = {
      correlationId: 'correlationId',
      schemeId: SFI,
      completedPaymentRequests: [
        {
          frn: 1234567890,
          contractNumber: 'contractNumber',
          agreementNumber: 'agreementNumber',
          marketingYear: 2023,
          invoiceNumber: 'invoiceNumber',
          currency: 'GBP',
          paymentRequestNumber: 3,
          batch: 'batch.csv',
          sourceSystem: BPS,
          debtType: 'irr',
          acknowledged: true,
          settledValue: 1000,
          submitted: '2023-01-01T00:00:00Z'
        }
      ],
      value: 1000
    }

    calculateLedgerValue.mockReturnValueOnce(500).mockReturnValueOnce(500)
    calculateDAXValue.mockReturnValue(200)
    calculateDAXPRN.mockReturnValue(2)
    calculateDeltaAmount.mockReturnValue(300)
    getStatusDaxImported.mockReturnValue({ status: 'Settled by payment ledger', daxImported: 'Y' })
    getLastUpdatedDate.mockReturnValue('2023-01-01T00:00:00Z')
    checkIfRevenueOrCapital.mockReturnValue(REVENUE)
    getYear.mockReturnValue(2023)
    calculateApproximateREReceivedDateTime.mockReturnValue('2023-01-01T00:00:00Z')
    getOverallStatus.mockReturnValue('overallStatus')
    checkCrossBorderType.mockReturnValue('N')

    await processLegacyPaymentRequest(paymentRequest)

    expect(updateReportData).toHaveBeenCalledWith(expect.objectContaining({
      releasedFromRequestEditor: null
    }), SFI)
  })

  test('should set releasedFromRequestEditor to submitted date when routedToRequestEditor is "Y" and sourceSystem is not CS or BPS', async () => {
    const paymentRequest = {
      correlationId: 'correlationId',
      schemeId: SFI,
      completedPaymentRequests: [
        {
          frn: 1234567890,
          contractNumber: 'contractNumber',
          agreementNumber: 'agreementNumber',
          marketingYear: 2023,
          invoiceNumber: 'invoiceNumber',
          currency: 'GBP',
          paymentRequestNumber: 3,
          batch: 'batch.csv',
          sourceSystem: 'otherSystem',
          debtType: 'irr',
          acknowledged: true,
          settledValue: 1000,
          submitted: '2023-01-01T00:00:00Z'
        }
      ],
      value: 1000
    }

    calculateLedgerValue.mockReturnValueOnce(500).mockReturnValueOnce(500)
    calculateDAXValue.mockReturnValue(200)
    calculateDAXPRN.mockReturnValue(2)
    calculateDeltaAmount.mockReturnValue(300)
    getStatusDaxImported.mockReturnValue({ status: 'Settled by payment ledger', daxImported: 'Y' })
    getLastUpdatedDate.mockReturnValue('2023-01-01T00:00:00Z')
    checkIfRevenueOrCapital.mockReturnValue(REVENUE)
    getYear.mockReturnValue(2023)
    calculateApproximateREReceivedDateTime.mockReturnValue('2023-01-01T00:00:00Z')
    getOverallStatus.mockReturnValue('overallStatus')
    checkCrossBorderType.mockReturnValue('N')

    await processLegacyPaymentRequest(paymentRequest)

    expect(updateReportData).toHaveBeenCalledWith(expect.objectContaining({
      releasedFromRequestEditor: '2023-01-01T00:00:00Z'
    }), SFI)
  })

  test('should set releasedFromRequestEditor to null if routedToRequestEditor is "N"', async () => {
    const paymentRequest = {
      correlationId: 'correlationId',
      schemeId: SFI,
      completedPaymentRequests: [
        {
          frn: 1234567890,
          contractNumber: 'contractNumber',
          agreementNumber: 'agreementNumber',
          marketingYear: 2023,
          invoiceNumber: 'invoiceNumber',
          currency: 'GBP',
          paymentRequestNumber: 1,
          batch: 'batch.csv',
          sourceSystem: 'otherSystem',
          debtType: null,
          acknowledged: true,
          settledValue: 1000,
          submitted: '2023-01-01T00:00:00Z'
        }
      ],
      value: 1000
    }

    calculateLedgerValue.mockReturnValueOnce(500).mockReturnValueOnce(500)
    calculateDAXValue.mockReturnValue(200)
    calculateDAXPRN.mockReturnValue(1)
    calculateDeltaAmount.mockReturnValue(300)
    getStatusDaxImported.mockReturnValue({ status: 'Settled by payment ledger', daxImported: 'Y' })
    getLastUpdatedDate.mockReturnValue('2023-01-01T00:00:00Z')
    checkIfRevenueOrCapital.mockReturnValue(REVENUE)
    getYear.mockReturnValue(2023)
    calculateApproximateREReceivedDateTime.mockReturnValue('2023-01-01T00:00:00Z')
    getOverallStatus.mockReturnValue('overallStatus')
    checkCrossBorderType.mockReturnValue('N')

    await processLegacyPaymentRequest(paymentRequest)

    expect(updateReportData).toHaveBeenCalledWith(expect.objectContaining({
      releasedFromRequestEditor: null
    }), SFI)
  })
})
