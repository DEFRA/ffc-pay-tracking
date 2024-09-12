const { convertToPence, convertToPounds } = require('../../../app/helpers/currency-convert')

describe('Currency Convert', () => {
  describe('convertToPence', () => {
    test('should convert pounds to pence correctly', () => {
      expect(convertToPence('1.23')).toBe(123)
      expect(convertToPence('10')).toBe(1000)
      expect(convertToPence('0.01')).toBe(1)
      expect(convertToPence('0')).toBe(0)
    })

    test('should return undefined for invalid input', () => {
      expect(convertToPence('abc')).toBeUndefined()
    })
  })

  describe('convertToPounds', () => {
    test('should convert pence to pounds correctly', () => {
      expect(convertToPounds(123)).toBe('1.23')
      expect(convertToPounds(1000)).toBe('10.00')
      expect(convertToPounds(1)).toBe('0.01')
      expect(convertToPounds(0)).toBe('0.00')
    })
  })
})
