const { BPS, CS } = require('../../../app/constants/schemes')
const { getDataFilter } = require('../../../app/helpers/get-data-filter')

describe('getDataFilter', () => {
  test.each([
    {
      schemeId: BPS,
      description: 'BPS scheme',
      input: { schemeId: BPS, sourceSystem: 'system1', frn: 'frn1', marketingYear: '2022', paymentRequestNumber: 2 },
      expected: { paymentRequestNumber: 2, sourceSystem: 'system1', frn: 'frn1', marketingYear: '2022' },
      expectedPrevious: { paymentRequestNumber: 1, sourceSystem: 'system1', frn: 'frn1', marketingYear: '2022' }
    },
    {
      schemeId: CS,
      description: 'CS scheme',
      input: { schemeId: CS, sourceSystem: 'system1', frn: 'frn1', contractNumber: 'contract1', paymentRequestNumber: 2 },
      expected: { paymentRequestNumber: 2, sourceSystem: 'system1', frn: 'frn1', claimNumber: 'contract1' },
      expectedPrevious: { paymentRequestNumber: 1, sourceSystem: 'system1', frn: 'frn1', claimNumber: 'contract1' }
    },
    {
      schemeId: 'UNKNOWN',
      description: 'any other scheme',
      input: { schemeId: 'UNKNOWN', sourceSystem: 'system1', frn: 'frn1', marketingYear: '2022', agreementNumber: 'agreement1', paymentRequestNumber: 2 },
      expected: { paymentRequestNumber: 2, sourceSystem: 'system1', frn: 'frn1', marketingYear: '2022', agreementNumber: 'agreement1' },
      expectedPrevious: { paymentRequestNumber: 1, sourceSystem: 'system1', frn: 'frn1', marketingYear: '2022', agreementNumber: 'agreement1' }
    }
  ])('should return correct filter for $description', ({ input, expected, expectedPrevious }) => {
    expect(getDataFilter(input)).toEqual(expected)
    expect(getDataFilter(input, true)).toEqual(expectedPrevious)
  })
})
