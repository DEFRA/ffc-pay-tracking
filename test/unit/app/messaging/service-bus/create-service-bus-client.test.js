const { ServiceBusClient } = require('@azure/service-bus')
const { DefaultAzureCredential } = require('@azure/identity')

const { createServiceBusClient } = require('../../../../../app/messaging/service-bus/create-service-bus-client')

jest.mock('@azure/service-bus')
jest.mock('@azure/identity')

describe('createServiceBusClient', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('creates client from connection string', () => {
    const config = { connectionString: 'test-connection-string' }

    createServiceBusClient(config)

    expect(ServiceBusClient).toHaveBeenCalledWith('test-connection-string', undefined)
  })

  test('creates client using default credential chain', () => {
    const credential = { name: 'default-credential' }
    DefaultAzureCredential.mockImplementation(() => credential)

    const config = { host: 'test.servicebus.windows.net', useCredentialChain: true }

    createServiceBusClient(config)

    expect(DefaultAzureCredential).toHaveBeenCalledWith()
    expect(ServiceBusClient).toHaveBeenCalledWith('test.servicebus.windows.net', credential, undefined)
  })

  test('creates client using managed identity client id', () => {
    const credential = { name: 'managed-identity-credential' }
    DefaultAzureCredential.mockImplementation(() => credential)

    const config = {
      host: 'test.servicebus.windows.net',
      useCredentialChain: true,
      managedIdentityClientId: 'managed-client-id'
    }

    createServiceBusClient(config)

    expect(DefaultAzureCredential).toHaveBeenCalledWith({ managedIdentityClientId: 'managed-client-id' })
    expect(ServiceBusClient).toHaveBeenCalledWith('test.servicebus.windows.net', credential, undefined)
  })

  test('creates client from shared access signature', () => {
    const config = {
      host: 'test.servicebus.windows.net',
      username: 'RootManageSharedAccessKey',
      password: 'test-key'
    }

    createServiceBusClient(config)

    expect(ServiceBusClient).toHaveBeenCalledWith(
      'Endpoint=sb://test.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=test-key',
      undefined
    )
  })

  test('appends emulator flag when useEmulator is true', () => {
    const config = {
      host: 'test.servicebus.windows.net',
      username: 'RootManageSharedAccessKey',
      password: 'test-key',
      useEmulator: true
    }

    createServiceBusClient(config)

    expect(ServiceBusClient).toHaveBeenCalledWith(
      'Endpoint=sb://test.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=test-key;UseDevelopmentEmulator=true',
      undefined
    )
  })

  test('passes retry options to client', () => {
    const config = {
      connectionString: 'test-connection-string',
      maxRetries: 5,
      retryDelayInMs: 500,
      maxRetryDelayInMs: 30000,
      retryMode: 'Exponential'
    }

    createServiceBusClient(config)

    expect(ServiceBusClient).toHaveBeenCalledWith('test-connection-string', {
      retryOptions: {
        maxRetries: 5,
        retryDelayInMs: 500,
        maxRetryDelayInMs: 30000,
        retryMode: 'Exponential'
      }
    })
  })

  test('passes retry options when only one option is provided', () => {
    const config = {
      connectionString: 'test-connection-string',
      maxRetries: 3
    }

    createServiceBusClient(config)

    expect(ServiceBusClient).toHaveBeenCalledWith('test-connection-string', {
      retryOptions: {
        maxRetries: 3,
        retryDelayInMs: undefined,
        maxRetryDelayInMs: undefined,
        retryMode: undefined
      }
    })
  })

  test('passes retry options when later option is provided', () => {
    const config = {
      connectionString: 'test-connection-string',
      retryMode: 'Fixed'
    }

    createServiceBusClient(config)

    expect(ServiceBusClient).toHaveBeenCalledWith('test-connection-string', {
      retryOptions: {
        maxRetries: undefined,
        retryDelayInMs: undefined,
        maxRetryDelayInMs: undefined,
        retryMode: 'Fixed'
      }
    })
  })

  test('passes retry options when middle option is provided', () => {
    const config = {
      connectionString: 'test-connection-string',
      retryDelayInMs: 1000
    }

    createServiceBusClient(config)

    expect(ServiceBusClient).toHaveBeenCalledWith('test-connection-string', {
      retryOptions: {
        maxRetries: undefined,
        retryDelayInMs: 1000,
        maxRetryDelayInMs: undefined,
        retryMode: undefined
      }
    })
  })

  test('passes retry options when third option is provided', () => {
    const config = {
      connectionString: 'test-connection-string',
      maxRetryDelayInMs: 60000
    }

    createServiceBusClient(config)

    expect(ServiceBusClient).toHaveBeenCalledWith('test-connection-string', {
      retryOptions: {
        maxRetries: undefined,
        retryDelayInMs: undefined,
        maxRetryDelayInMs: 60000,
        retryMode: undefined
      }
    })
  })

  test('does not throw when retry config is missing', () => {
    expect(() => createServiceBusClient()).not.toThrow()
    expect(ServiceBusClient).not.toHaveBeenCalled()
  })

  test('returns undefined when config is null', () => {
    expect(createServiceBusClient(null)).toBeUndefined()
    expect(ServiceBusClient).not.toHaveBeenCalled()
  })

  test('strips null retry options so SDK defaults are used', () => {
    const config = {
      host: 'test.servicebus.windows.net',
      username: 'RootManageSharedAccessKey',
      password: 'test',
      maxRetries: 1,
      retryDelayInMs: null
    }

    createServiceBusClient(config)

    expect(ServiceBusClient).toHaveBeenCalledWith(
      expect.any(String),
      {
        retryOptions: {
          maxRetries: 1
        }
      }
    )
  })
})
