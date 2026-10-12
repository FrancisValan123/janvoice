/* ===================================
   JANVOICE — SANITIZE MIDDLEWARE
   =================================== */

const sanitizeMongo = (req, res, next) => {
  const clean = (obj) => {
    if (!obj || typeof obj !== 'object') return obj
    Object.keys(obj).forEach((key) => {
      if (key.startsWith('$') || key.includes('.')) {
        delete obj[key]
      } else if (typeof obj[key] === 'object') {
        clean(obj[key])
      }
    })
    return obj
  }

  if (req.body) clean(req.body)
  if (req.params) clean(req.params)
  if (req.query) clean(req.query)

  next()
}

const sanitizeXSS = (req, res, next) => {
  const clean = (str) => {
    if (typeof str !== 'string') return str
    return str
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/\son\w+\s*=\s*["'][^"']*["']/gi, '')
  }

  const walk = (obj) => {
    if (typeof obj === 'string') return clean(obj)
    if (Array.isArray(obj)) return obj.map(walk)
    if (obj && typeof obj === 'object') {
      Object.keys(obj).forEach((k) => {
        obj[k] = walk(obj[k])
      })
    }
    return obj
  }

  if (req.body) req.body = walk(req.body)
  next()
}

const preventHPP = (req, res, next) => {
  // Simple HTTP Parameter Pollution prevention
  if (req.query) {
    Object.keys(req.query).forEach((key) => {
      if (Array.isArray(req.query[key])) {
        req.query[key] = req.query[key][req.query[key].length - 1]
      }
    })
  }
  next()
}

const trimStrings = (req, res, next) => {
  const trim = (obj) => {
    if (typeof obj === 'string') return obj.trim()
    if (Array.isArray(obj)) return obj.map(trim)
    if (obj && typeof obj === 'object') {
      Object.keys(obj).forEach((k) => {
        obj[k] = trim(obj[k])
      })
    }
    return obj
  }

  if (req.body) req.body = trim(req.body)
  if (req.query) req.query = trim(req.query)

  next()
}

module.exports = {
  sanitizeMongo,
  sanitizeXSS,
  preventHPP,
  trimStrings,
  stripDangerousTags: sanitizeXSS,
  removeNullBytes: trimStrings,
  sanitizeAll: [sanitizeMongo, sanitizeXSS, preventHPP, trimStrings]
}