const { getCrossBorderFlag } = require('../../../../app/data-generation/get-cross-border-flag')
const { BPS, CS } = require('../../../../app/constants/schemes')

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

  test('returns "D2P" when all invoiceLines have deliveryBody as RP00', () => {
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
    expect(result).toBe('D2P')
  })

  test('returns "E2P" when at least one invoiceLine has deliveryBody not as RP00', () => {
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
    expect(result).toBe('E2P')
  })
})
