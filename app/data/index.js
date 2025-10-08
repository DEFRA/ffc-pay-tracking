const path = require('node:path')
const { databaseConfig: dbConfig } = require('../config')
const modelPath = path.join(__dirname, 'models')
const { Database } = require('ffc-database')

const database = new Database({ ...dbConfig, modelPath })
const db = database.connect()

module.exports = db
