const csTypes = require('../../../../app/constants/cs-types')

describe('cs-types', () => {
  test('should export the correct constants', () => {
    expect(csTypes.REVENUE).toBe('Revenue')
    expect(csTypes.CAPITAL).toBe('Capital')
  })
})
