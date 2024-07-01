const { SFI, BPS } = require('../../../../app/constants/schemes')
const { checkCrossBorderType } = require('../../../../app/legacy-processing/check-cross-border-type')

describe('check cross border type for migrated data', () => {
  test('should return null if schemeId is not BPS', () => {
    const paymentRequest = {
      schemeId: SFI,
      invoiceLines: [{ deliveryBody: 'RP00' }]
    }
    expect(checkCrossBorderType(paymentRequest)).toBeNull()
  })

  test('should return "D2P" if any invoice line has a delivery body other than "RP00"', () => {
    const paymentRequest = {
      schemeId: BPS,
      invoiceLines: [
        { deliveryBody: 'RP00' },
        { deliveryBody: 'RP01' }
      ]
    }
    expect(checkCrossBorderType(paymentRequest)).toBe('D2P')
  })

  test('should return "E2P" if all invoice lines have delivery body "RP00"', () => {
    const paymentRequest = {
      schemeId: BPS,
      invoiceLines: [
        { deliveryBody: 'RP00' },
        { deliveryBody: 'RP00' }
      ]
    }
    expect(checkCrossBorderType(paymentRequest)).toBe('E2P')
  })

  test('should return "E2P" if there are no invoice lines', () => {
    const paymentRequest = {
      schemeId: BPS,
      invoiceLines: []
    }
    expect(checkCrossBorderType(paymentRequest)).toBe('E2P')
  })
})
