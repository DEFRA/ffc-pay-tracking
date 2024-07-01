const { checkIfRevenueOrCapital } = require('../../../../app/legacy-processing/check-if-revenue-or-capital')
const { REVENUE, CAPITAL } = require('../../../../app/constants/cs-types')
const { CS, SFI } = require('../../../../app/constants/schemes')

describe('check if revenue or capital for migrated data', () => {
  test('should return null if schemeId is not CS', () => {
    const paymentRequest = {
      schemeId: SFI,
      dueDate: '01/12/2022'
    }
    expect(checkIfRevenueOrCapital(paymentRequest)).toBeNull()
  })

  test('should return REVENUE if dueDate is 01/12', () => {
    const paymentRequest = {
      schemeId: CS,
      dueDate: '01/12/2022'
    }
    expect(checkIfRevenueOrCapital(paymentRequest)).toBe(REVENUE)
  })

  test('should return REVENUE if dueDate is 01/01/2016', () => {
    const paymentRequest = {
      schemeId: CS,
      dueDate: '01/01/2016'
    }
    expect(checkIfRevenueOrCapital(paymentRequest)).toBe(REVENUE)
  })

  test('should return CAPITAL if dueDate is not 01/12 or 01/01/2016', () => {
    const paymentRequest = {
      schemeId: CS,
      dueDate: '02/12/2022'
    }
    expect(checkIfRevenueOrCapital(paymentRequest)).toBe(CAPITAL)
  })
})
