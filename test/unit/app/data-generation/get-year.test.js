const { getSchemeIds } = require('ffc-pay-schemes')
const { getYear } = require('../../../../app/data-generation/get-year')
const { REVENUE } = require('../../../../app/constants/cs-types')
const { getRevenue } = require('../../../../app/data-generation/get-revenue')

jest.mock('ffc-pay-schemes', () => ({
  getSchemeIds: jest.fn(() => ({ CS: 5 }))
}))

jest.mock('../../../../app/data-generation/get-revenue', () => ({
  getRevenue: jest.fn()
}))

test('getYear', () => {
  const { CS } = getSchemeIds()

  getRevenue.mockReturnValueOnce(REVENUE)
  const event1 = { data: { schemeId: CS, dueDate: '2022-12-01', marketingYear: 2021 } }
  expect(getYear(event1)).toBe(2022)

  getRevenue.mockReturnValueOnce('OTHER_REVENUE')
  const event2 = { data: { schemeId: CS, dueDate: '2022-12-01', marketingYear: 2021 } }
  expect(getYear(event2)).toBe(2021)

  const event3 = { data: { schemeId: 'OTHER_SCHEME', dueDate: '2022-12-01', marketingYear: 2021 } }
  expect(getYear(event3)).toBe(2021)
})
