const appInsights = require('applicationinsights')
const { setup } = require('../../../app/insights')

jest.mock('applicationinsights', () => ({
  setup: jest.fn().mockReturnThis(),
  start: jest.fn(),
  defaultClient: {
    context: {
      keys: {
        cloudRole: 'cloudRoleKey'
      },
      tags: {}
    }
  }
}))

describe('insights', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should setup App Insights if connection string is provided', () => {
    process.env.APPINSIGHTS_CONNECTIONSTRING = 'TestConnectionString'
    process.env.APPINSIGHTS_CLOUDROLE = 'TestAppName'

    setup()

    expect(appInsights.setup).toHaveBeenCalledWith('TestConnectionString')
    expect(appInsights.start).toHaveBeenCalled()
    expect(appInsights.defaultClient.context.tags.cloudRoleKey).toBe('TestAppName')
  })

  test('should not setup App Insights if connection string is not provided', () => {
    delete process.env.APPINSIGHTS_CONNECTIONSTRING

    setup()

    expect(appInsights.setup).not.toHaveBeenCalled()
    expect(appInsights.start).not.toHaveBeenCalled()
  })
})
