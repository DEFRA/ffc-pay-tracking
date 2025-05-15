jest.mock('@azure/storage-blob')
jest.mock('@azure/identity')

describe('storage', () => {
  let storage
  const mockUploadStream = jest.fn().mockResolvedValue()
  const mockBlockBlobClient = {
    uploadStream: mockUploadStream
  }

  const mockContainerClient = {
    createIfNotExists: jest.fn(),
    getBlockBlobClient: jest.fn(() => mockBlockBlobClient)
  }

  const mockBlobServiceClient = {
    getContainerClient: jest.fn(() => mockContainerClient)
  }

  const mockStorageConfig = {
    useConnectionStr: true,
    connectionStr: 'UseDevelopmentStorage=true',
    createContainers: true,
    storageAccount: 'fakestorageaccount',
    managedIdentityClientId: 'fake-client-id',
    dataRequestContainer: 'test-container'
  }

  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()

    jest.doMock('../../app/config', () => ({
      storageConfig: mockStorageConfig
    }))

    require('@azure/storage-blob').BlobServiceClient.fromConnectionString = jest
      .fn()
      .mockReturnValue(mockBlobServiceClient)

    require('@azure/storage-blob').BlobServiceClient.mockImplementation(() => mockBlobServiceClient)

    require('@azure/identity').DefaultAzureCredential.mockImplementation(() => ({}))

    jest.spyOn(console, 'log').mockImplementation(() => {})
    jest.spyOn(console, 'debug').mockImplementation(() => {})
    jest.spyOn(console, 'error').mockImplementation(() => {})

    storage = require('../../app/storage')
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  test('uses connection string when config.useConnectionStr is true', () => {
    expect(require('@azure/storage-blob').BlobServiceClient.fromConnectionString)
      .toHaveBeenCalledWith(mockStorageConfig.connectionStr)
    expect(console.log).toHaveBeenCalledWith('Using connection string for BlobServiceClient')
  })

  test('uses DefaultAzureCredential when config.useConnectionStr is false', () => {
    mockStorageConfig.useConnectionStr = false
    jest.resetModules()

    jest.doMock('../../app/config', () => ({
      storageConfig: mockStorageConfig
    }))

    storage = require('../../app/storage')

    expect(require('@azure/identity').DefaultAzureCredential).toHaveBeenCalledWith({
      managedIdentityClientId: mockStorageConfig.managedIdentityClientId
    })

    expect(require('@azure/storage-blob').BlobServiceClient).toHaveBeenCalledWith(
      `https://${mockStorageConfig.storageAccount}.blob.core.windows.net`,
      expect.any(Object)
    )
    expect(console.log).toHaveBeenCalledWith('Using DefaultAzureCredential for BlobServiceClient')
  })

  test('initialises containers when createContainers is true', async () => {
    await storage.saveReportFile('test.json', require('stream').Readable.from([]))
    expect(mockContainerClient.createIfNotExists).toHaveBeenCalled()
  })

  test('does not reinitialise containers after first time', async () => {
    await storage.saveReportFile('first.json', require('stream').Readable.from([]))
    await storage.saveReportFile('second.json', require('stream').Readable.from([]))
    expect(mockContainerClient.createIfNotExists).toHaveBeenCalledTimes(1)
  })

  test('saves report file using uploadStream', async () => {
    const stream = require('stream').Readable.from(['{"foo":"bar"}'])
    await storage.saveReportFile('myfile.json', stream)

    expect(mockContainerClient.getBlockBlobClient).toHaveBeenCalledWith('myfile.json')
    expect(mockBlockBlobClient.uploadStream).toHaveBeenCalled()
  })

  test('throws error and logs when upload fails', async () => {
    mockUploadStream.mockRejectedValueOnce(new Error('upload failed'))

    const stream = require('stream').Readable.from(['{"fail":"yes"}'])

    await expect(storage.saveReportFile('badfile.json', stream)).rejects.toThrow('upload failed')
    expect(console.error).toHaveBeenCalledWith('[STORAGE] Error saving report file:', expect.any(Error))
  })
})
