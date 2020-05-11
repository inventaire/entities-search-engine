const fetch = require('node-fetch')
const httpAgent = new require('http').Agent({ keepAlive: true })
const httpsAgent = new require('https').Agent({ keepAlive: true })
// Using a custom agent to set keepAlive=true
// https://nodejs.org/api/http.html#http_class_http_agent
// https://github.com/bitinn/node-fetch#custom-agent
const agent = ({ protocol }) => protocol === 'http:' ? httpAgent : httpsAgent

const request = method => async ({ url, headers, body }) => {
  const res = await fetch(url, {
    method,
    body,
    headers,
    agent
  })

  if (res.status >= 400) return throwError(res, method, url, body)
  else return res
}

const get = request('get')
const post = request('post')

module.exports = {
  get: url => get({ url }),

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

const throwError = async (res, method, url, body) => {
  const err = new Error('request error')
  let resBody = await res.text()
  if (resBody[0] === '{') resBody = JSON.parse(resBody)
  err.statusCode = res.status
  err.context = { method, url, reqBody: body, resBody }
  throw err
}
