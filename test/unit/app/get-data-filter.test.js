const { BPS, FDMR, CS } = require('../../../app/constants/schemes')
const { getDataFilter } = require('../../../app/helpers/get-data-filter')

describe('getDataFilter', () => {
  test('should return correct filter for BPS scheme', () => {
    const data = {
      schemeId: BPS,
      sourceSystem: 'system1',
      frn: 'frn1',
      marketingYear: '2022',
      paymentRequestNumber: 2
    }
    const result = getDataFilter(data)

    expect(result).toEqual({
      paymentRequestNumber: 2,
      sourceSystem: 'system1',
      frn: 'frn1',
      marketingYear: '2022'
    })
  })

  test('should return correct filter for BPS scheme if previous', () => {
    const data = {
      schemeId: BPS,
      sourceSystem: 'system1',
      frn: 'frn1',
      marketingYear: '2022',
      paymentRequestNumber: 2
    }
    const result = getDataFilter(data, true)

    expect(result).toEqual({
      paymentRequestNumber: 1,
      sourceSystem: 'system1',
      frn: 'frn1',
      marketingYear: '2022'
    })
  })

  test('should return correct filter for FDMR scheme', () => {
    const data = {
      schemeId: FDMR,
      sourceSystem: 'system1',
      frn: 'frn1',
      paymentRequestNumber: 2,
      invoiceLines: [{ schemeCode: 'SOS270' }]
    }
    const result = getDataFilter(data)

    expect(result).toEqual({
      paymentRequestNumber: 2,
      sourceSystem: 'system1',
      frn: 'frn1',
      fdmrSchemeCode: 'SOS270'
    })
  })

  test('should return correct filter for FDMR scheme if previous', () => {
    const data = {
      schemeId: FDMR,
      sourceSystem: 'system1',
      frn: 'frn1',
      paymentRequestNumber: 2,
      invoiceLines: [{ schemeCode: 'SOS270' }]
    }
    const result = getDataFilter(data, true)

    expect(result).toEqual({
      paymentRequestNumber: 1,
      sourceSystem: 'system1',
      frn: 'frn1',
      fdmrSchemeCode: 'SOS270'
    })
  })

  test('should return correct filter for CS scheme', () => {
    const data = {
      schemeId: CS,
      sourceSystem: 'system1',
      frn: 'frn1',
      contractNumber: 'contract1',
      paymentRequestNumber: 2
    }

    const result = getDataFilter(data)

    expect(result).toEqual({
      paymentRequestNumber: 2,
      sourceSystem: 'system1',
      frn: 'frn1',
      claimNumber: 'contract1'
    })
  })

  test('should return correct filter for CS scheme if previous', () => {
    const data = {
      schemeId: CS,
      sourceSystem: 'system1',
      frn: 'frn1',
      contractNumber: 'contract1',
      paymentRequestNumber: 2
    }

    const result = getDataFilter(data, true)

    expect(result).toEqual({
      paymentRequestNumber: 1,
      sourceSystem: 'system1',
      frn: 'frn1',
      claimNumber: 'contract1'
    })
  })

  test('should return correct filter for any other scheme', () => {
    const data = {
      schemeId: 'UNKNOWN',
      sourceSystem: 'system1',
      frn: 'frn1',
      marketingYear: '2022',
      agreementNumber: 'agreement1',
      paymentRequestNumber: 2
    }

    const result = getDataFilter(data)

    expect(result).toEqual({
      paymentRequestNumber: 2,
      sourceSystem: 'system1',
      frn: 'frn1',
      marketingYear: '2022',
      agreementNumber: 'agreement1'
    })
  })

  test('should return correct filter for any other scheme if previous', () => {
    const data = {
      schemeId: 'UNKNOWN',
      sourceSystem: 'system1',
      frn: 'frn1',
      marketingYear: '2022',
      agreementNumber: 'agreement1',
      paymentRequestNumber: 2
    }

    const result = getDataFilter(data, true)

    expect(result).toEqual({
      paymentRequestNumber: 1,
      sourceSystem: 'system1',
      frn: 'frn1',
      marketingYear: '2022',
      agreementNumber: 'agreement1'
    })
  })
})
