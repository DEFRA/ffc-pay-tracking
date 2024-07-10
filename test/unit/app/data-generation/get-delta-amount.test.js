const { getDeltaAmount } = require('../../../../app/data-generation/get-delta-amount')
const { PAYMENT_PROCESSED, PAYMENT_SUBMITTED, PAYMENT_ACKNOWLEDGED, PAYMENT_SETTLED } = require('../../../../app/constants/events')
const { getValue } = require('../../../../app/data-generation')
const { getDataFilter } = require('../../../../app/get-data-filter')

jest.mock('../../../../app/data-generation/get-value')
jest.mock('../../../../app/get-data-filter')

const db = require('../../../../app/data')
jest.mock('../../../../app/data')

describe('check delta amount', () => {
  beforeEach(() => {
    getValue.mockReturnValue(100)
    getDataFilter.mockReturnValue({
      paymentRequestNumber: 1,
      sourceSystem: 'system1',
      frn: 'frn1',
      agreementNumber: 'agreement1'
    })
    db.reportData.findOne.mockResolvedValue({ value: 50 })
  })

  test('getDeltaAmount returns event data value for processed event types', async () => {
    const eventTypes = [PAYMENT_PROCESSED, PAYMENT_SUBMITTED, PAYMENT_ACKNOWLEDGED, PAYMENT_SETTLED]

    for (const type of eventTypes) {
      const event = { type, data: { value: 200 } }
      const transaction = {}

      const result = await getDeltaAmount(event, transaction)

      expect(result).toBe(200)
    }
  })

  test('getDeltaAmount returns output of getValue when requestNumber is 0', async () => {
    const event = { data: { paymentRequestNumber: 0, value: 150 } }
    const transaction = {}

    const result = await getDeltaAmount(event, transaction)

    expect(result).toBe(100)
  })

  test('getDeltaAmount returns output of getValue when it returns null', async () => {
    getValue.mockReturnValue(null)
    const event = { data: { paymentRequestNumber: 0, value: 150 } }
    const transaction = {}

    const result = await getDeltaAmount(event, transaction)

    expect(result).toBeNull()
  })

  test('getDeltaAmount calculates delta amount', async () => {
    const event = { data: { paymentRequestNumber: 2, sourceSystem: 'system1', frn: 'frn1', agreementNumber: 'agreement1' } }
    const transaction = {}

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

  test('getDeltaAmount returns value when no matching database entry is found', async () => {
    db.reportData.findOne.mockResolvedValue(null)

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
})
