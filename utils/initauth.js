import decode from 'jwt-decode'

const authDefaults = {
  dispatch: undefined,
  commit: undefined,
  req: undefined,
  moduleName: 'auth',
  cookieName: 'feathers-jwt'
}

export const initAuth = function initAuth (options) {
  const { commit, req, moduleName, cookieName } = Object.assign({}, authDefaults, options)

  if (typeof commit !== 'function') {
    throw new Error('You must pass the `commit` function in the `initAuth` function options.')
  }
  if (!req) {
    throw new Error('You must pass the `req` object in the `initAuth` function options.')
  }

  commit(`${moduleName}/setAccessToken`, null)
  commit(`${moduleName}/setPayload`, null)
  console.log('cookie', typeof req.headers.cookie)

  if (req.headers.cookie) {
    const accessToken = readCookie(req.headers.cookie, cookieName)
    const payload = getValidPayloadFromToken(accessToken)
    console.log('payload', payload)

    if (payload) {
      commit(`${moduleName}/setAccessToken`, accessToken)
      commit(`${moduleName}/setPayload`, payload)
    }
    return Promise.resolve(payload)
  }
}

export function getValidPayloadFromToken (token) {
  if (token) {
    try {
      var payload = decode(token)
      return payloadIsValid(payload) ? payload : undefined
    } catch (error) {
      return undefined
    }
  }
  return undefined
}

// Pass a decoded payload and it will return a boolean based on if it hasn't expired.
export function payloadIsValid (payload) {
  return payload && payload.exp * 1000 > new Date().getTime()
}

export function readCookie (cookies, name) {
  if (!cookies) {
    console.log('no cookies found')
    return undefined
  }
  var nameEQ = name + '='
  var ca = cookies.split(';')
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i]
    while (c.charAt(0) === ' ') {
      c = c.substring(1, c.length)
    }
    if (c.indexOf(nameEQ) === 0) {
      return c.substring(nameEQ.length, c.length)
    }
  }
  return null
}
