const mockGetReportingDataFilter = jest.fn()

jest.mock('ffc-pay-schemes', () => ({
  getReportingDataFilter: mockGetReportingDataFilter
}))

const { getDataFilter } = require('../../../../app/helpers/get-data-filter')

describe('getDataFilter', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('returns the current payment request filter with reporting fields', () => {
    mockGetReportingDataFilter.mockReturnValue(['agreementNumber', 'schemeYear'])

    const data = {
      paymentRequestNumber: 3,
      sourceSystem: 'SIT',
      frn: 1234567890,
      schemeId: 6,
      agreementNumber: 'AGREEMENT-001',
      schemeYear: 2025,
      ignoredField: 'ignored'
    }

    const result = getDataFilter(data)

    expect(mockGetReportingDataFilter).toHaveBeenCalledWith(6)
    expect(result).toEqual({
      paymentRequestNumber: 3,
      sourceSystem: 'SIT',
      frn: 1234567890,
      agreementNumber: 'AGREEMENT-001',
      schemeYear: 2025
    })
  })

  test('uses the previous payment request number when previous is true', () => {
    mockGetReportingDataFilter.mockReturnValue([])

    const data = {
      paymentRequestNumber: 8,
      sourceSystem: 'SIT',
      frn: 1234567890,
      schemeId: 6
    }

    const result = getDataFilter(data, true)

    expect(result).toEqual({
      paymentRequestNumber: 7,
      sourceSystem: 'SIT',
      frn: 1234567890
    })
  })

  test('does not include fields not returned by getReportingDataFilter', () => {
    mockGetReportingDataFilter.mockReturnValue(['agreementNumber'])

    const data = {
      paymentRequestNumber: 1,
      sourceSystem: 'SIT',
      frn: 1234567890,
      schemeId: 6,
      agreementNumber: 'AGREEMENT-001',
      schemeYear: 2025
    }

    const result = getDataFilter(data)

    expect(result).toEqual({
      paymentRequestNumber: 1,
      sourceSystem: 'SIT',
      frn: 1234567890,
      agreementNumber: 'AGREEMENT-001'
    })
  })
})
