const db = require('../../../../app/data')
const { updateExistingRecord } = require('../../../../app/payment/update-existing-record')

jest.mock('../../../../app/data')

describe('update existing record', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should update record with all valid data', async () => {
    const mockNewData = {
      status: 'PROCESSED',
      apValue: 100,
      arValue: 50,
      daxFileName: 'test_AP_file.csv',
      daxImported: true,
      settledValue: 150,
      daxPaymentRequestNumber: 'PR123',
      daxValue: 100,
      overallStatus: 'COMPLETE',
      valueStillToProcess: 0,
      prStillToProcess: 0,
      lastUpdated: '2026-01-29'
    }
    const mockInvoiceNumber = 'INV123'
    const mockTransaction = {}

    db.reportData.update.mockResolvedValue()

    await updateExistingRecord(mockNewData, mockInvoiceNumber, mockTransaction)

    expect(db.reportData.update).toHaveBeenCalledWith({
      status: 'PROCESSED',
      apValue: 100,
      arValue: 50,
      daxFileName: 'test_AP_file.csv',
      daxImported: true,
      settledValue: 150,
      ledgerSplit: 'Y',
      daxPaymentRequestNumber: 'PR123',
      daxValue: 100,
      overallStatus: 'COMPLETE',
      valueStillToProcess: 0,
      prStillToProcess: 0,
      lastUpdated: '2026-01-29'
    }, {
      where: { invoiceNumber: mockInvoiceNumber },
      transaction: mockTransaction
    })
  })

  test('should exclude daxFileName if it does not contain _AP_', async () => {
    const mockNewData = {
      status: 'PROCESSED',
      apValue: 100,
      arValue: 50,
      daxFileName: 'test_file.csv',
      daxImported: true,
      settledValue: 150,
      daxPaymentRequestNumber: 'PR123',
      daxValue: 100,
      overallStatus: 'COMPLETE',
      valueStillToProcess: 0,
      prStillToProcess: 0,
      lastUpdated: '2026-01-29'
    }
    const mockInvoiceNumber = 'INV123'
    const mockTransaction = {}

    db.reportData.update.mockResolvedValue()

    await updateExistingRecord(mockNewData, mockInvoiceNumber, mockTransaction)

    expect(db.reportData.update).toHaveBeenCalledWith({
      status: 'PROCESSED',
      apValue: 100,
      arValue: 50,
      daxImported: true,
      settledValue: 150,
      ledgerSplit: 'Y',
      daxPaymentRequestNumber: 'PR123',
      daxValue: 100,
      overallStatus: 'COMPLETE',
      valueStillToProcess: 0,
      prStillToProcess: 0,
      lastUpdated: '2026-01-29'
    }, {
      where: { invoiceNumber: mockInvoiceNumber },
      transaction: mockTransaction
    })
  })

  test('should remove null and undefined values from update data', async () => {
    const mockNewData = {
      status: 'PROCESSED',
      apValue: 100,
      arValue: null,
      daxFileName: undefined,
      daxImported: true,
      settledValue: 150,
      daxPaymentRequestNumber: null,
      daxValue: 100,
      overallStatus: 'COMPLETE',
      valueStillToProcess: 0,
      prStillToProcess: undefined,
      lastUpdated: '2026-01-29'
    }
    const mockInvoiceNumber = 'INV123'
    const mockTransaction = {}

    db.reportData.update.mockResolvedValue()

    await updateExistingRecord(mockNewData, mockInvoiceNumber, mockTransaction)

    expect(db.reportData.update).toHaveBeenCalledWith({
      status: 'PROCESSED',
      apValue: 100,
      daxImported: true,
      settledValue: 150,
      ledgerSplit: 'Y',
      daxValue: 100,
      overallStatus: 'COMPLETE',
      valueStillToProcess: 0,
      lastUpdated: '2026-01-29'
    }, {
      where: { invoiceNumber: mockInvoiceNumber },
      transaction: mockTransaction
    })
  })

  test('should always set ledgerSplit to Y', async () => {
    const mockNewData = {
      status: 'PROCESSED',
      apValue: 100,
      arValue: 50,
      daxFileName: 'test_AP_file.csv',
      daxImported: true,
      settledValue: 150,
      daxPaymentRequestNumber: 'PR123',
      daxValue: 100,
      overallStatus: 'COMPLETE',
      valueStillToProcess: 0,
      prStillToProcess: 0,
      lastUpdated: '2026-01-29'
    }
    const mockInvoiceNumber = 'INV123'
    const mockTransaction = {}

    db.reportData.update.mockResolvedValue()

    await updateExistingRecord(mockNewData, mockInvoiceNumber, mockTransaction)

    const callArgs = db.reportData.update.mock.calls[0][0]
    expect(callArgs.ledgerSplit).toBe('Y')
  })
})
