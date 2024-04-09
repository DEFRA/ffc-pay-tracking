const { getPHError } = require('../../../../app/data-generation/get-ph-error')
const { PAYMENT_DAX_REJECTED, PAYMENT_INVALID_BANK } = require('../../../../app/constants/warnings')

test('getPHError', () => {
  const event1 = { type: PAYMENT_DAX_REJECTED, data: { message: 'Error message' }, source: 'source1' }
  expect(getPHError(event1)).toBeNull()

  const event2 = { type: PAYMENT_INVALID_BANK, data: {}, source: 'source2' }
  expect(getPHError(event2)).toBeNull()

  const event3 = { type: 'OTHER_EVENT', data: { message: 'Error message' }, source: 'source3' }
  expect(getPHError(event3)).toBe('Error message')

  const event4 = { type: 'OTHER_EVENT', data: {}, source: 'source4' }
  expect(getPHError(event4)).toBe('An undetermined error occurred at source4')
})
