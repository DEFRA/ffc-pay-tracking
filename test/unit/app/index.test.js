const { processingConfig } = require('../../../app/config')

jest.mock('../../../app/messaging')
const { start: mockStartMessaging } = require('../../../app/messaging')
jest.mock('../../../app/legacy-processing')
const { start: mockStartProcessing } = require('../../../app/legacy-processing')
jest.mock('../../../app/server/server')
const { start: mockStartServer } = require('../../../app/server/server')

const startApp = require('../../../app')

describe('app start', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test.each([
    { service: 'processing', startMock: mockStartProcessing, activeRequired: true },
    { service: 'messaging', startMock: mockStartMessaging, activeRequired: true },
    { service: 'server', startMock: mockStartServer, activeRequired: false }
  ])(
    'should start $service correctly based on processingActive flag',
    async ({ service, startMock, activeRequired }) => {
      processingConfig.processingActive = true
      await startApp()
      expect(startMock).toHaveBeenCalledTimes(1)

      jest.clearAllMocks()
      processingConfig.processingActive = false
      await startApp()
      expect(startMock).toHaveBeenCalledTimes(activeRequired ? 0 : 1)
    }
  )

  test('should log console.info only when processingActive is false', async () => {
    const consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation(() => {})

    processingConfig.processingActive = true
    await startApp()
    expect(consoleInfoSpy).not.toHaveBeenCalled()

    processingConfig.processingActive = false
    await startApp()
    expect(consoleInfoSpy).toHaveBeenCalledWith(
      expect.stringContaining('Processing capabilities are currently not enabled in this environment')
    )

    consoleInfoSpy.mockRestore()
  })
})
