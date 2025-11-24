const { SFI, BPS } = require('../../../../app/constants/schemes')
const { checkCrossBorderType } = require('../../../../app/legacy-processing/check-cross-border-type')

describe('checkCrossBorderType', () => {
  test.each([
    ['scheme not BPS returns null', { schemeId: SFI, invoiceLines: [{ deliveryBody: 'RP00' }] }, null],
    ['any invoice line not RP00 returns D2P', { schemeId: BPS, invoiceLines: [{ deliveryBody: 'RP00' }, { deliveryBody: 'RP01' }] }, 'D2P'],
    ['all invoice lines RP00 returns E2P', { schemeId: BPS, invoiceLines: [{ deliveryBody: 'RP00' }, { deliveryBody: 'RP00' }] }, 'E2P'],
    ['no invoice lines returns E2P', { schemeId: BPS, invoiceLines: [] }, 'E2P']
  ])('%s', (_, paymentRequest, expected) => {
    expect(checkCrossBorderType(paymentRequest)).toBe(expected)
  })
})
