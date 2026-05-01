const { FPTT, SFI } = require('../../../../app/constants/schemes')
const { swapAbsoluteValue } = require('../../../../app/payment/swap-absolute-value')

describe('swapAbsoluteValue', () => {
  test('should return 1 for FPTT scheme, turning a negative value positive', () => {
    const multiplier = swapAbsoluteValue(FPTT)
    expect(-8143 * multiplier).toBe(8143)
  })

  test('should return -1 for SFI scheme, leaving a negative value unchanged', () => {
    const multiplier = swapAbsoluteValue(SFI)
    expect(-8143 * multiplier).toBe(-8143)
  })
})
