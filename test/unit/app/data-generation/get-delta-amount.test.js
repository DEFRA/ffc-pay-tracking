jest.mock('../../../../app/data-generation/get-value', () => ({
  getValue: jest.fn().mockReturnValue(100)
}))

jest.mock('../../../../app/get-data-filter', () => ({
  getDataFilter: jest.fn().mockReturnValue({
    paymentRequestNumber: 1,
    sourceSystem: 'system1',
    frn: 'frn1',
    agreementNumber: 'agreement1'
  })
}))

jest.mock('../../../../app/data', () => ({
  reportData: {
    findOne: jest.fn().mockResolvedValue({ value: 50 })
  }
}))

const { getDeltaAmount } = require('../../../../app/data-generation/get-delta-amount')

test('getDeltaAmount', async () => {
  const event = { data: { paymentRequestNumber: 2, sourceSystem: 'system1', frn: 'frn1', agreementNumber: 'agreement1' } }
  const transaction = {}

  const result = await getDeltaAmount(event, transaction)

  expect(result).toBe(50)
  expect(require('../../../../app/data').reportData.findOne).toHaveBeenCalledWith({
    where: {
      paymentRequestNumber: 1,
      sourceSystem: 'system1',
      frn: 'frn1',
      agreementNumber: 'agreement1'
    },
    transaction
  })
})
