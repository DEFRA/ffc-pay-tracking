const wreck = require('@hapi/wreck')
const processingConfig = require('./config')

const get = async (url, token) => {
  return wreck.get(`${processingConfig.paymentsEndpoint}${url}`, getConfiguration(token))
}

const getConfiguration = (token) => {
  return {
    headers: {
      Authorization: token ?? ''
    },
    json: true
  }
}

module.exports = {
  get
}
