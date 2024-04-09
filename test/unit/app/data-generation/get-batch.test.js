const { getBatch } = require('../../../../app/data-generation/get-batch')
const { PAYMENT_ACKNOWLEDGED, PAYMENT_SETTLED } = require('../../../../app/constants/events')

test('getBatch should return the batch if event type is not PAYMENT_ACKNOWLEDGED or PAYMENT_SETTLED', () => {
  const event = { type: 'OTHER_EVENT', data: { batch: 'batch1' } }
  expect(getBatch(event)).toBe('batch1')
})

test('getBatch should return null if event type is PAYMENT_ACKNOWLEDGED', () => {
  const event = { type: PAYMENT_ACKNOWLEDGED, data: { batch: 'batch1' } }
  expect(getBatch(event)).toBeNull()
})

test('getBatch should return null if event type is PAYMENT_SETTLED', () => {
  const event = { type: PAYMENT_SETTLED, data: { batch: 'batch1' } }
  expect(getBatch(event)).toBeNull()
})
