const { getFileName } = require('../../../../app/data-generation/get-file-name')
const { PAYMENT_SUBMITTED } = require('../../../../app/constants/events')

test('getFileName', () => {
  const event1 = { type: PAYMENT_SUBMITTED, subject: 'filename1' }
  expect(getFileName(event1)).toBe('filename1')

  const event2 = { type: 'OTHER_EVENT', subject: 'filename2' }
  expect(getFileName(event2)).toBeNull()
})
