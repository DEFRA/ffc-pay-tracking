const { getYear } = require('../../../../app/legacy-processing/get-year')
const { REVENUE, CAPITAL } = require('../../../../app/constants/cs-types')

describe('get year for migrated payment requests', () => {
  test('should return marketingYear if revenueOrCapital is not REVENUE', () => {
    const paymentRequest = {
      marketingYear: 2023,
      dueDate: '2022-12-01'
    }
    expect(getYear(paymentRequest, CAPITAL)).toBe(2023)
  })

  test('should return year from dueDate if revenueOrCapital is REVENUE', () => {
    const paymentRequest = {
      marketingYear: 2023,
      dueDate: '01/12/2022'
    }
    expect(getYear(paymentRequest, REVENUE)).toBe(2022)
  })
})
