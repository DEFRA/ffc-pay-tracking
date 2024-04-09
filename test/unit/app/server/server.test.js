const { start } = require('../../../../app/server/server')
const { createServer, mockStart } = require('../../../../app/server/create-server')

jest.mock('../../../../app/server/create-server', () => {
  const mockStart = jest.fn()
  const mockServer = {
    start: mockStart
  }
  return {
    createServer: jest.fn().mockResolvedValue(mockServer),
    mockStart
  }
})

test('start starts the server', async () => {
  await start()
  expect(createServer).toHaveBeenCalled()
  expect(mockStart).toHaveBeenCalled()
})
