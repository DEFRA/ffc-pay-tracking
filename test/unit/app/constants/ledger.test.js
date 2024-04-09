const ledgers = require('../../../../app/constants/ledgers')

test('ledgers exports correct ledgers', () => {
  expect(ledgers.AP).toBe('AP')
  expect(ledgers.AR).toBe('AR')
})
