const db = require('../../../../app/data')
jest.mock('../../../../app/data')

const { updateLedgerSplit } = require('../../../../app/payment/update-ledger-split')

const mockTransaction = {}

describe('updateLedgerSplit', () => {
  test('should update ledgerSplit to "Y" when apValue and arValue are present', async () => {
    const mockData = {
      reportDataId: 1,
      apValue: 'mockApValue',
      arValue: 'mockArValue',
      update: jest.fn()
    }

    db.reportData.update.mockResolvedValue()

    await updateLedgerSplit(mockData, mockTransaction)

    expect(db.reportData.update).toHaveBeenCalledWith({ ledgerSplit: 'Y' }, { where: { reportDataId: mockData.reportDataId }, transaction: mockTransaction })
  })

  test('should update ledgerSplit to "N" when apValue or arValue is not present', async () => {
    const mockData = {
      reportDataId: 1,
      apValue: 'mockApValue',
      update: jest.fn()
    }

    await updateLedgerSplit(mockData, mockTransaction)

    expect(db.reportData.update).toHaveBeenCalledWith({ ledgerSplit: 'N' }, { where: { reportDataId: mockData.reportDataId }, transaction: mockTransaction })
  })
})
