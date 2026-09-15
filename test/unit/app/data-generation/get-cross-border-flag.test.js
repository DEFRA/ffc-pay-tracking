jest.mock('ffc-pay-schemes', () => ({
  getSchemeIds: () => ({
    CS: 5,
    BPS: 6
  })
}))
const { getSchemeIds } = require('ffc-pay-schemes')

const { getCrossBorderFlag } = require('../../../../app/data-generation/get-cross-border-flag')

const { BPS, CS } = getSchemeIds()

describe('getCrossBorderFlag', () => {
  test('returns null when schemeId is not BPS', () => {
    const event = {
      data: {
        schemeId: CS,
        invoiceLines: []
      }
    }

    const result = getCrossBorderFlag(event)
    expect(result).toBeNull()
  })

  test('returns "E2P" when all invoiceLines have deliveryBody as RP00', () => {
    const event = {
      data: {
        schemeId: BPS,
        invoiceLines: [
          { deliveryBody: 'RP00' },
          { deliveryBody: 'RP00' }
        ]
      }
    }

    const result = getCrossBorderFlag(event)
    expect(result).toBe('E2P')
  })

  test('returns "D2P" when at least one invoiceLine has deliveryBody not as RP00', () => {
    const event = {
      data: {
        schemeId: BPS,
        invoiceLines: [
          { deliveryBody: 'RP00' },
          { deliveryBody: 'Other' }
        ]
      }
    }

    const result = getCrossBorderFlag(event)
    expect(result).toBe('D2P')
  })
})
