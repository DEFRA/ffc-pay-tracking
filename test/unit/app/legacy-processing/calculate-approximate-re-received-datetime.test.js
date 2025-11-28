const { CS, BPS } = require('../../../../app/constants/source-systems')
const { calculateApproximateREReceivedDateTime } = require('../../../../app/legacy-processing/calculate-approximate-re-received-datetime')

describe('calculateApproximateREReceivedDateTime', () => {
  const received = '2023-01-02T00:00:00Z'
  const basePR = (overrides = {}) => ({
    paymentRequestNumber: 2,
    ...overrides
  })
  const wrapper = (primary, paymentRequest) =>
    calculateApproximateREReceivedDateTime(primary, paymentRequest)

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test.each([
    ['PRN < 2 returns null', basePR({ paymentRequestNumber: 1, debtType: 'irr', submitted: '2023-01-01T00:00:00Z' })],
    ['sourceSystem is CS returns null', basePR({ sourceSystem: CS, debtType: 'irr', submitted: '2023-01-01T00:00:00Z' })],
    ['sourceSystem is BPS returns null', basePR({ sourceSystem: BPS, debtType: 'irr', submitted: '2023-01-01T00:00:00Z' })]
  ])('%s', (_, primary) => {
    const paymentRequest = { completedPaymentRequests: [primary], received }
    expect(wrapper(primary, paymentRequest)).toBe(null)
  })

  test('returns submitted date when debtType present, completed exists, submitted < received', () => {
    const primary = basePR({ debtType: 'irr', submitted: '2023-01-01T00:00:00Z' })
    const paymentRequest = {
      completedPaymentRequests: [{ debtType: 'irr', submitted: primary.submitted }],
      received
    }
    expect(wrapper(primary, paymentRequest)).toBe(primary.submitted)
  })

  test('returns received date when debtType present, completed exists, submitted > received', () => {
    const primary = basePR({ debtType: 'irr', submitted: '2023-01-03T00:00:00Z' })
    const paymentRequest = {
      completedPaymentRequests: [{ debtType: 'irr', submitted: primary.submitted }],
      received
    }
    expect(wrapper(primary, paymentRequest)).toBe(received)
  })

  test.each([
    ['has debtType and no completed payment requests', basePR({ debtType: 'irr' }), []],
    ['no debtType and no completed payment requests', basePR(), []],
    ['no debtType and completed undefined', basePR(), undefined],
    ['no debtType and completed null', basePR(), null]
  ])('returns received when %s', (_, primary, completed) => {
    const paymentRequest = { completedPaymentRequests: completed, received }
    expect(wrapper(primary, paymentRequest)).toBe(received)
  })
})
