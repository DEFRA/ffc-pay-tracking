const db = require('../../../../app/data')
const { getDeltaAmount } = require('../../../../app/data-generation/get-delta-amount')
const getValue = require('../../../../app/data-generation/get-value')

jest.mock('../../../../app/data', () => ({
  reportData: {
    findOne: jest.fn()
  }
}))

jest.mock('../../../../app/data-generation/get-value', () => ({
  getValue: jest.fn()
}))

test('getDeltaAmount', async () => {
  const event = { data: { paymentRequestNumber: 2, sourceSystem: 'system1', frn: 'frn1', agreementNumber: 'agreement1' } }
  const transaction = {}

  getValue.getValue.mockReturnValueOnce(100)
  db.reportData.findOne.mockResolvedValueOnce({ value: 50 })

  const result = await getDeltaAmount(event, transaction)

  expect(result).toBe(50)
  expect(db.reportData.findOne).toHaveBeenCalledWith({
    where: {
      paymentRequestNumber: 1,
      sourceSystem: 'system1',
      frn: 'frn1',
      agreementNumber: 'agreement1'
    },
    transaction
  })
})

test('getDeltaAmount when requestNumber is 1', async () => {
  jest.clearAllMocks()
  const event = { data: { paymentRequestNumber: 1, sourceSystem: 'system1', frn: 'frn1', agreementNumber: 'agreement1' } }
  const transaction = {}
  getValue.getValue.mockReturnValueOnce(100)
  const result = await getDeltaAmount(event, transaction)
  expect(result).toBe(100)
  expect(db.reportData.findOne).not.toHaveBeenCalled()
})

test('getDeltaAmount when value is null', async () => {
  jest.clearAllMocks()
  const event = { data: { paymentRequestNumber: 2, sourceSystem: 'system1', frn: 'frn1', agreementNumber: 'agreement1' } }
  const transaction = {}
  getValue.getValue.mockReturnValueOnce(null)
  const result = await getDeltaAmount(event, transaction)
  expect(result).toBeNull()
  expect(db.reportData.findOne).not.toHaveBeenCalled()
})
