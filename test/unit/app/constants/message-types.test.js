const messageTypes = require('../../../../app/constants/message-types')

test('message-types exports correct types', () => {
  expect(messageTypes.ACKNOWLEDGEMENT).toBe('ACKNOWLEDGEMENT')
  expect(messageTypes.PROCESSING).toBe('PROCESSING')
  expect(messageTypes.RETURN).toBe('RETURN')
  expect(messageTypes.SUBMIT).toBe('SUBMIT')
})
