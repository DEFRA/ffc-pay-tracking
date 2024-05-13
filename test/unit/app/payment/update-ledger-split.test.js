const { updateLedgerSplit } = require('../../../../app/payment/update-ledger-split')

describe('updateLedgerSplit', () => {
  test('should update ledgerSplit to "Y" when apValue and arValue are present', async () => {
    const mockData = {
      apValue: 'mockApValue',
      arValue: 'mockArValue',
      update: jest.fn()
    }

    await updateLedgerSplit(mockData)

    expect(mockData.update).toHaveBeenCalledWith({ ledgerSplit: 'Y' })
  })

  test('should update ledgerSplit to "N" when apValue or arValue is not present', async () => {
    const mockData = {
      apValue: 'mockApValue',
      update: jest.fn()
    }

    await updateLedgerSplit(mockData)

    expect(mockData.update).toHaveBeenCalledWith({ ledgerSplit: 'N' })
  })
})
