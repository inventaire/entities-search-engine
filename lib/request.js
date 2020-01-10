const fetch = require('node-fetch')
const httpAgent = new require('http').Agent({ keepAlive: true })
const httpsAgent = new require('https').Agent({ keepAlive: true })

// See https://github.com/node-fetch/node-fetch#custom-agent
const agent = _parsedURL => {
  if (_parsedURL.protocol === 'http:') return httpAgent
  else return httpsAgent
}

const request = method => async ({ url, headers, body }) => {
  const res = await fetch(url, {
    method,
    body,
    headers,
    agent
  })
  if (res.status >= 400) throw formatError(res, method, url, body)
  else return res
}

const post = request('post')

module.exports = {
  get: url => fetch(url, { agent }),

  post,

  postJson: (url, body) => {
    return post({
      url,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
  },

  put: request('put'),

  delete: request('delete')
}

const formatError = (res, method, url, body) => {
  const err = new Error('request error')
  err.statusCode = res.status
  err.context = { method, url, body }
  return err
}
