const { checkIfRevenueOrCapital } = require('../../../../app/legacy-processing/check-if-revenue-or-capital')
const { REVENUE, CAPITAL } = require('../../../../app/constants/cs-types')
const { CS, SFI } = require('../../../../app/constants/schemes')

describe('checkIfRevenueOrCapital', () => {
  test.each([
    ['scheme not CS returns null', { schemeId: SFI, dueDate: '01/12/2022' }, null],
    ['dueDate 01/12 returns REVENUE', { schemeId: CS, dueDate: '01/12/2022' }, REVENUE],
    ['dueDate 01/01/2016 returns REVENUE', { schemeId: CS, dueDate: '01/01/2016' }, REVENUE],
    ['other dueDate returns CAPITAL', { schemeId: CS, dueDate: '02/12/2022' }, CAPITAL]
  ])('%s', (_, paymentRequest, expected) => {
    expect(checkIfRevenueOrCapital(paymentRequest)).toBe(expected)
  })
})
