const { plugin } = require('../../../../../app/server/plugins/errors')

const mockServer = {
  ext: jest.fn()
}

const mockH = {
  continue: Symbol('continue')
}

let onPreResponse

beforeAll(() => {
  plugin.register(mockServer)
  onPreResponse = mockServer.ext.mock.calls[0][1]
})

test('errors plugin registers onPreResponse extension', () => {
  expect(mockServer.ext).toHaveBeenCalledWith('onPreResponse', expect.any(Function))
})

test('onPreResponse continues for non-Boom responses', () => {
  const mockRequest = {
    response: {}
  }

  const result = onPreResponse(mockRequest, mockH)

  expect(result).toBe(mockH.continue)
})

test('onPreResponse logs and returns Boom responses', () => {
  const mockRequest = {
    response: {
      isBoom: true,
      output: {
        statusCode: 500
      },
      message: 'Test error',
      data: {
        payload: {
          message: 'Test payload message'
        }
      }
    },
    log: jest.fn()
  }

  const result = onPreResponse(mockRequest, mockH)

  expect(mockRequest.log).toHaveBeenCalledWith('error', {
    statusCode: 500,
    message: 'Test error',
    payloadMessage: 'Test payload message'
  })
  expect(result).toBe(mockRequest.response)
})
