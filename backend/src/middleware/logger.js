/* ===================================
   JANVOICE — HTTP LOGGER MIDDLEWARE
   =================================== */

const morgan = require('morgan')

// Simple logger — no Winston dependency
const httpLogger = morgan('dev', {
  skip: (req) => req.url === '/api/health'
})

module.exports = {
  httpLogger,
  devLogger: httpLogger
}