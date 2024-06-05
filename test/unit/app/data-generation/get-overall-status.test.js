const { getOverallStatus } = require('../../../../app/data-generation/get-overall-status')

describe('get overall status', () => {
  test('returns "Complete" when value and daxValue are equal, and prn and daxPRN are equal', () => {
    const value = 1000
    const daxValue = 1000
    const prn = 2
    const daxPRN = 2

    const result = getOverallStatus(value, daxValue, prn, daxPRN)
    expect(result).toBe('Complete')
  })

  test('returns "Incomplete" when value and daxValue are not equal', () => {
    const value = 1000
    const daxValue = 1500
    const prn = 2
    const daxPRN = 2

    const result = getOverallStatus(value, daxValue, prn, daxPRN)
    expect(result).toBe('Incomplete')
  })

  test('returns "Incomplete" when prn and daxPRN are not equal', () => {
    const value = 1000
    const daxValue = 1000
    const prn = 2
    const daxPRN = 3

    const result = getOverallStatus(value, daxValue, prn, daxPRN)
    expect(result).toBe('Incomplete')
  })

  test('returns "Incomplete" when both value/daxValue and prn/daxPRN are not equal', () => {
    const value = 1000
    const daxValue = 1500
    const prn = 2
    const daxPRN = 3

    const result = getOverallStatus(value, daxValue, prn, daxPRN)
    expect(result).toBe('Incomplete')
  })
})
