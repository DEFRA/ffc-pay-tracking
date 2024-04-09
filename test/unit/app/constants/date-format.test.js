const dateFormat = require('../../../../app/constants/date-format')

describe('date-format', () => {
  test('should export the correct date format', () => {
    expect(dateFormat.DATE_FORMAT).toBe('DD/MM/YYYY')
  })
})
