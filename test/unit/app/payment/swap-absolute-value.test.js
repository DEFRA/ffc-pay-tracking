const { swapAbsoluteValue } = require('../../../../app/payment/swap-absolute-value')

describe('swapAbsoluteValue', () => {
  test('should return -1 where providesAccountingValues is true, turning a negative value positive', () => {
    const multiplier = swapAbsoluteValue(true)
    expect(-8143 * multiplier).toBe(8143)
  })

  test('should return 1 where providesAccountingValues is false, leaving a negative value unchanged', () => {
    const multiplier = swapAbsoluteValue(false)
    expect(-8143 * multiplier).toBe(-8143)
  })
})
