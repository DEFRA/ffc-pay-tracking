const { DefaultAzureCredential } = require('@azure/identity')
const { BlobServiceClient } = require('@azure/storage-blob')
const config = require('./config').storageConfig
let blobServiceClient
let containersInitialised
const BUFFER_SIZE = 4 * 1024 * 1024 // 4 MB
const MAX_CONCURRENCY = 5

if (config.useConnectionStr) {
  console.log('Using connection string for BlobServiceClient')
  blobServiceClient = BlobServiceClient.fromConnectionString(config.connectionStr)
} else {
  console.log('Using DefaultAzureCredential for BlobServiceClient')
  const uri = `https://${config.storageAccount}.blob.core.windows.net`
  blobServiceClient = new BlobServiceClient(uri, new DefaultAzureCredential({ managedIdentityClientId: config.managedIdentityClientId }))
}

const container = blobServiceClient.getContainerClient(config.dataRequestContainer)

const initialiseContainers = async () => {
  if (config.createContainers) {
    console.log('Making sure blob containers exist')
    await container.createIfNotExists()
  }
  containersInitialised = true
}

const saveReportFile = async (filename, readableStream) => {
  try {
    console.debug('[STORAGE] Starting report file save:', filename)
    containersInitialised ?? await initialiseContainers()

    const client = container.getBlockBlobClient(`${filename}`)
    const options = {
      blobHTTPHeaders: {
        blobContentType: 'text/json'
      }
    }

    return new Promise((resolve, reject) => {
      readableStream.on('error', (err) => {
        reject(err)
      })

      client.uploadStream(
        readableStream,
        BUFFER_SIZE,
        MAX_CONCURRENCY,
        options
      )
        .then(() => {
          console.debug('[STORAGE] Upload completed')
          resolve()
        })
        .catch(reject)
    })
  } catch (error) {
    console.error('[STORAGE] Error saving report file:', error)
    throw error
  }
}

module.exports = {
  blobServiceClient,
  saveReportFile
}
