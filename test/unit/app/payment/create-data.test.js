const moment = require('moment')
const { createData } = require('../../../../app/payment/create-data')
const {
  getARAmount,
  getDebtType,
  getFileName,
  getBatch,
  getBatchExportDate,
  getStatus,
  getValue,
  getRevenue,
  getYear,
  routedToRequestEditor,
  getDeltaAmount,
  getAPAmount,
  isImported,
  getSettledValue,
  getOriginalInvoiceNumber,
  getRequestEditorDate,
  isEnriched,
  getRequestEditorReleased,
  checkDAXPRN,
  checkDAXValue,
  getOverallStatus,
  getCrossBorderFlag
} = require('../../../../app/data-generation')
const { swapAbsoluteValue } = require('../../../../app/payment/swap-absolute-value')
const {
  PAYMENT_EXTRACTED,
  PAYMENT_ACKNOWLEDGED
} = require('../../../../app/constants/events')

jest.mock('../../../../app/data-generation/index')
jest.mock('../../../../app/payment/swap-absolute-value')

const FPTT = 'FPTT'
const SFI23 = 'SFIA'

const createEvent = (dataOverrides = {}, eventOverrides = {}) => ({
  type: PAYMENT_EXTRACTED,
  data: {
    correlationId: 'correlation-id',
    frn: 1234567890,
    contractNumber: 'contract-number',
    agreementNumber: 'agreement-number',
    marketingYear: 2023,
    invoiceNumber: 'invoice-number',
    currency: 'GBP',
    paymentRequestNumber: 2,
    sourceSystem: SFI23,
    ...dataOverrides
  },
  time: new Date('2026-01-01T12:00:00.000Z'),
  ...eventOverrides
})

describe('createData', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    getValue.mockResolvedValue(2500)
    getDeltaAmount.mockResolvedValue(500)
    getOriginalInvoiceNumber.mockReturnValue('original-invoice-number')
    getBatch.mockReturnValue('batch')
    getBatchExportDate.mockReturnValue('batch-export-date')
    getStatus.mockReturnValue('status')
    getRevenue.mockReturnValue('revenue')
    getYear.mockReturnValue(2022)
    routedToRequestEditor.mockReturnValue(false)
    getAPAmount.mockReturnValue(500)
    getARAmount.mockReturnValue(0)
    getDebtType.mockReturnValue('debt-type')
    getFileName.mockReturnValue('file-name')
    isImported.mockReturnValue(false)
    getSettledValue.mockReturnValue(2500)
    getRequestEditorDate.mockReturnValue(null)
    isEnriched.mockReturnValue(false)
    getRequestEditorReleased.mockReturnValue(null)
    checkDAXPRN.mockResolvedValue(1)
    checkDAXValue.mockResolvedValue(2000)
    getOverallStatus.mockReturnValue('status')
    getCrossBorderFlag.mockReturnValue(false)
    swapAbsoluteValue.mockReturnValue(1)
  })

  test('creates the expected payment data', async () => {
    const event = createEvent()
    const transaction = {}

    const result = await createData(event, transaction)

    expect(result).toEqual({
      correlationId: 'correlation-id',
      frn: 1234567890,
      contractNumber: 'contract-number',
      agreementNumber: 'agreement-number',
      marketingYear: 2023,
      originalInvoiceNumber: 'original-invoice-number',
      invoiceNumber: 'invoice-number',
      currency: 'GBP',
      paymentRequestNumber: 2,
      value: 2500,
      batch: 'batch',
      sourceSystem: SFI23,
      batchExportDate: 'batch-export-date',
      status: 'status',
      lastUpdated: moment(event.time).format(),
      revenueOrCapital: 'revenue',
      year: 2022,
      routedToRequestEditor: false,
      deltaAmount: 500,
      apValue: 500,
      arValue: 0,
      debtType: 'debt-type',
      daxFileName: 'file-name',
      daxImported: false,
      settledValue: 2500,
      receivedInRequestEditor: undefined,
      enriched: false,
      releasedFromRequestEditor: undefined,
      daxPaymentRequestNumber: 1,
      daxValue: 2000,
      overallStatus: 'status',
      crossBorderFlag: false,
      valueStillToProcess: 500,
      prStillToProcess: 1,
      phError: null,
      daxError: null
    })
  })

  test('passes the event to the dependent functions', async () => {
    const event = createEvent()
    const transaction = {}

    await createData(event, transaction)

    expect(getValue).toHaveBeenCalledWith(event)
    expect(getDeltaAmount).toHaveBeenCalledWith(event, transaction)
    expect(checkDAXPRN).toHaveBeenCalledWith(event, transaction)
    expect(checkDAXValue).toHaveBeenCalledWith(event, transaction)
    expect(getOriginalInvoiceNumber).toHaveBeenCalledWith(event)
    expect(getOverallStatus).toHaveBeenCalledWith(2500, 2000, 2, 1)
  })

  test('swaps the value for a fresh upstream event', async () => {
    const event = createEvent(
      {
        sourceSystem: FPTT,
        providesAccountingValues: true
      },
      {
        type: PAYMENT_EXTRACTED
      }
    )

    swapAbsoluteValue.mockReturnValue(-1)

    const result = await createData(event, {})

    expect(swapAbsoluteValue).toHaveBeenCalledWith(true)
    expect(result.value).toBe(-2500)
  })

  test('does not swap the value for a non-fresh upstream event', async () => {
    const event = createEvent(
      {
        sourceSystem: SFI23,
        providesAccountingValues: false
      },
      {
        type: PAYMENT_ACKNOWLEDGED
      }
    )

    swapAbsoluteValue.mockReturnValue(-1)

    const result = await createData(event, {})

    expect(result.value).toBe(2500)
  })

  test('sets valueStillToProcess to null when value is zero', async () => {
    getValue.mockResolvedValue(0)

    const result = await createData(createEvent(), {})

    expect(result.valueStillToProcess).toBeUndefined()
  })

  test('omits nullable fields from the result', async () => {
    getDeltaAmount.mockResolvedValue(null)
    getValue.mockResolvedValue(null)
    getRequestEditorDate.mockReturnValue(null)
    getRequestEditorReleased.mockReturnValue(null)

    const result = await createData(createEvent(), {})

    expect(result).not.toHaveProperty('deltaAmount')
    expect(result).not.toHaveProperty('value')
    expect(result).not.toHaveProperty('valueStillToProcess')
    expect(result).not.toHaveProperty('receivedInRequestEditor')
    expect(result).not.toHaveProperty('releasedFromRequestEditor')
  })

  test('sets valueStillToProcess using the DAX value', async () => {
    getValue.mockResolvedValue(1000)
    checkDAXValue.mockResolvedValue(250)

    const result = await createData(createEvent(), {})

    expect(result.valueStillToProcess).toBe(750)
  })
})
