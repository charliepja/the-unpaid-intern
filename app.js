require('dotenv').config()
require('module-alias/register')
global.__basedir = __dirname

const Client = require('./src/Client')
const client = new Client()

client.start()