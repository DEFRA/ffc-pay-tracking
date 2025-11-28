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
jest.mock('../../../../app/legacy-processing/get-status-dax-imported')
jest.mock('../../../../app/legacy-processing/get-year')
jest.mock('../../../../app/legacy-processing/calculate-dax-prn')
jest.mock('../../../../app/legacy-processing/calculate-dax-value')
jest.mock('../../../../app/data-generation')
jest.mock('../../../../app/legacy-processing/check-cross-border-type')
jest.mock('../../../../app/legacy-processing/update-report-data')

describe('processLegacyPaymentRequest', () => {
  const basePaymentRequest = {
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

  const setupMocks = () => {
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
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should call updateReportData correctly for SFI completed payment request', async () => {
    setupMocks()
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
      apValue: 500,
      arValue: 500,
      debtType: 'Irregular',
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
      prStillToProcess: 1,
      fdmrSchemeCode: null
    }

    await processLegacyPaymentRequest(basePaymentRequest)
    expect(updateReportData).toHaveBeenCalledWith(expectedData, SFI)
  })

  test('should include fdmrSchemeCode for FDMR scheme', async () => {
    setupMocks()
    const paymentRequest = {
      ...basePaymentRequest,
      schemeId: FDMR,
      invoiceLines: [{ schemeCode: 'SOS270' }]
    }

    const expectedData = expect.objectContaining({
      fdmrSchemeCode: 'SOS270',
      debtType: 'Irregular'
    })

    await processLegacyPaymentRequest(paymentRequest)
    expect(updateReportData).toHaveBeenCalledWith(expectedData, FDMR)
  })

  describe('releasedFromRequestEditor logic', () => {
    test.each([
      [CS, null],
      [BPS, null],
      ['otherSystem', '2023-01-01T00:00:00Z']
    ])('sourceSystem %s sets releasedFromRequestEditor to %s', async (sourceSystem, expectedReleased) => {
      setupMocks()
      const paymentRequest = {
        ...basePaymentRequest,
        completedPaymentRequests: [{ ...basePaymentRequest.completedPaymentRequests[0], sourceSystem }]
      }

      await processLegacyPaymentRequest(paymentRequest)
      expect(updateReportData).toHaveBeenCalledWith(
        expect.objectContaining({ releasedFromRequestEditor: expectedReleased }),
        SFI
      )
    })
  })
})
