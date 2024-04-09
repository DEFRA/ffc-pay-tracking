const { getDataFilter } = require('../../../app/get-data-filter')

describe('getDataFilter', () => {
  test('should return correct filter for BPS scheme', () => {
    const data = {
      schemeId: 'BPS',
      sourceSystem: 'system1',
      frn: 'frn1',
      marketingYear: '2022'
    }
    const requestNumber = 2

    const result = getDataFilter(data, requestNumber)

    expect(result).toEqual({
      paymentRequestNumber: 1,
      sourceSystem: 'system1',
      frn: 'frn1',
      marketingYear: '2022'
    })
  })

  test('should return correct filter for FDMR scheme', () => {
    const data = {
      schemeId: 'FDMR',
      sourceSystem: 'system1',
      frn: 'frn1'
    }
    const requestNumber = 2

    const result = getDataFilter(data, requestNumber)

    expect(result).toEqual({
      paymentRequestNumber: 1,
      sourceSystem: 'system1',
      frn: 'frn1'
    })
  })

  test('should return correct filter for CS scheme', () => {
    const data = {
      schemeId: 'CS',
      sourceSystem: 'system1',
      frn: 'frn1',
      contractNumber: 'contract1'
    }
    const requestNumber = 2

    const result = getDataFilter(data, requestNumber)

    expect(result).toEqual({
      paymentRequestNumber: 1,
      sourceSystem: 'system1',
      frn: 'frn1',
      claimNumber: 'contract1'
    })
  })

  test('should return correct filter for unknown scheme', () => {
    const data = {
      schemeId: 'UNKNOWN',
      sourceSystem: 'system1',
      frn: 'frn1',
      marketingYear: '2022',
      agreementNumber: 'agreement1'
    }
    const requestNumber = 2

    const result = getDataFilter(data, requestNumber)

    expect(result).toEqual({
      paymentRequestNumber: 1,
      sourceSystem: 'system1',
      frn: 'frn1',
      marketingYear: '2022',
      agreementNumber: 'agreement1'
    })
  })
})
