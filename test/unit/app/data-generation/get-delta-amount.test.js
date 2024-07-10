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

const mockFindOne = jest.fn().mockResolvedValue({ value: 50 })
jest.mock('../../../../app/data', () => ({
  reportData: {
    findOne: mockFindOne
  }
}))

const { getDeltaAmount } = require('../../../../app/data-generation/get-delta-amount')
const { PAYMENT_PROCESSED, PAYMENT_SUBMITTED, PAYMENT_ACKNOWLEDGED, PAYMENT_SETTLED } = require('../../../../app/constants/events')

test('getDeltaAmount returns event data value for processed event types', async () => {
  const eventTypes = [PAYMENT_PROCESSED, PAYMENT_SUBMITTED, PAYMENT_ACKNOWLEDGED, PAYMENT_SETTLED]

  for (const type of eventTypes) {
    const event = { type, data: { value: 200 } }
    const transaction = {}

    const result = await getDeltaAmount(event, transaction)

    expect(result).toBe(200)
  }
})

test('getDeltaAmount returns value when requestNumber is 0', async () => {
  const event = { data: { paymentRequestNumber: 0, value: 150 } }
  const transaction = {}

  const result = await getDeltaAmount(event, transaction)

  expect(result).toBe(150)
})

test('getDeltaAmount returns null when value is null', async () => {
  const event = { data: { paymentRequestNumber: 1, value: null } }
  const transaction = {}

  jest.mock('../../../../app/data-generation/get-value', () => ({
    getValue: jest.fn().mockReturnValue(null)
  }))

  const result = await getDeltaAmount(event, transaction)

  expect(result).toBeNull()
})

test('getDeltaAmount calculates delta amount', async () => {
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

test('getDeltaAmount returns value when no matching database entry is found', async () => {
  mockFindOne.mockResolvedValueOnce(null)

  const event = { data: { paymentRequestNumber: 2, sourceSystem: 'system1', frn: 'frn1', agreementNumber: 'agreement1' } }
  const transaction = {}

  const result = await getDeltaAmount(event, transaction)

  expect(result).toBe(100)
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
