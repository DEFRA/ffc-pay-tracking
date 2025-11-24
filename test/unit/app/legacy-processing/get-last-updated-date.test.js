const { getLastUpdatedDate } = require('../../../../app/legacy-processing/get-last-updated-date')

describe('getLastUpdatedDate', () => {
  test.each([
    ['lastSettlement exists returns lastSettlement', { completedPaymentRequests: [{ lastSettlement: '2023-01-01', submitted: '2022-12-01' }], received: '2022-11-01' }, '2023-01-01'],
    ['no lastSettlement returns submitted', { completedPaymentRequests: [{ submitted: '2022-12-01' }], received: '2022-11-01' }, '2022-12-01'],
    ['empty completed requests returns received', { completedPaymentRequests: [], received: '2022-11-01' }, '2022-11-01'],
    ['completed undefined returns received', { received: '2022-11-01' }, '2022-11-01'],
    ['completed null returns received', { completedPaymentRequests: null, received: '2022-11-01' }, '2022-11-01']
  ])('%s', (_, paymentRequest, expected) => {
    expect(getLastUpdatedDate(paymentRequest)).toBe(expected)
  })
})
