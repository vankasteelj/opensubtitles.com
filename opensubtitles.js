'use strict'

const got = require('got')
const methods = require('./methods.json')

module.exports = class OS {
  constructor(settings = {}) {
    if (!settings.apikey) throw Error('requires an apikey')

    this._authentication = {}
    this._settings = {
      apikey: settings.apikey,
      endpoint: settings.endpoint || 'https://api.opensubtitles.com/api/v1',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*'
      }
    }

    this._construct()
  }

  login(auth) {
    if (!auth.username || !auth.password) {
      throw Error('requires a username and a password')
    }

    return this.user.login(auth).then((response) => {
      this._authentication.user = response.user
      this._authentication.token = response.token
      return response
    })
  }

  logout() {
    if (!this._authentication.token) {
      throw Error('not logged in')
    }

    return this.user.logout().then((response) => {
      this._authentication = {} //reset
      return response
    })
  }

  // Creates methods for all requests
  _construct() {
    for (let url in methods) {
      const urlParts = url.split('/')
      const name = urlParts.pop() // key for function

      let tmp = this
      for (let p = 1; p < urlParts.length; ++p) { // acts like mkdir -p
        tmp = tmp[urlParts[p]] || (tmp[urlParts[p]] = {})
      }

      tmp[name] = (() => {
        const method = methods[url] // closure forces copy
        return (params) => {
          return this._call(method, params)
        }
      })()
    }
  }

  // Parse url before api call
  _parse(method, params = {}) {
    let url = this._settings.endpoint + method.url.split('?')[0]

    // ?Part
    const queryParts = []
    const queryPart = method.url.split('?')[1]
    if (queryPart) {
      const queryParams = queryPart.split('&')
      for (let i in queryParams) {
        const name = queryParams[i].split('=')[0]; // that ; is needed
        (params[name] || params[name] === 0) && queryParts.push(`${name}=${encodeURIComponent(params[name])}`)
      }
    }

    if (queryParts.length) url += '?' + queryParts.join('&')

    return url
  }

  // Parse methods then hit API
  _call(method, params = {}) {
    const url = this._parse(method, params)
    let req = {
      method: method.method,
      headers: Object.assign({}, this._settings.headers)
    }

    // HEADERS Authorization
    if (method.opts && method.opts.auth) {
      const token = this._authentication.token || params.token;
      if (token) req.headers['Authorization'] = 'Bearer ' + token
      if (!token && !this._settings.apikey) throw Error('requires a bearer token, login first')
    }

    // HEADERS Api-Key
    req.headers['Api-Key'] = this._settings.apikey

    // JSON body
    if (req.method !== 'GET') {
      req.body = (method.body ? Object.assign({}, method.body) : {})
      for (let k in params) {
        if (k in req.body) req.body[k] = params[k]
      }
      for (let k in req.body) {
        if (!req.body[k]) delete req.body[k]
      }
      req.body = JSON.stringify(req.body)
    }

    // Actual call
    return got(url, req).then(response => JSON.parse(response.body))
  }
}
