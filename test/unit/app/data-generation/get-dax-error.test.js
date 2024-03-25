const { getDAXError } = require('../../../../app/data-generation/get-dax-error')
const { PAYMENT_DAX_REJECTED, PAYMENT_INVALID_BANK } = require('../../../../app/constants/warnings')

test('getDAXError', () => {
  const event1 = { type: PAYMENT_DAX_REJECTED, data: { message: 'Error message' }, source: 'source1' }
  expect(getDAXError(event1)).toBe('Error message')

  const event2 = { type: PAYMENT_INVALID_BANK, data: {}, source: 'source2' }
  expect(getDAXError(event2)).toBe('An undetermined error occurred at source2')

  const event3 = { type: 'OTHER_EVENT', data: { message: 'Error message' }, source: 'source3' }
  expect(getDAXError(event3)).toBeNull()
})
