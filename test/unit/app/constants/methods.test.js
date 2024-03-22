const methods = require('../../../../app/constants/methods')

test('methods exports correct methods', () => {
  expect(methods.GET).toBe('GET')
})
