import feathers from '@feathersjs/feathers'
import socketio from '@feathersjs/socketio-client'
import auth from '@feathersjs/authentication-client'
import io from 'socket.io-client'
import { CookieStorage } from 'cookie-storage'

const socket = io(process.env.HOST_URL_API_SSO, {transports: ['websocket']})

const app = feathers()
  .configure(socketio(socket))
  .configure(auth({ jwtStrategy: 'jwt', cookie: 'feathers-jwt', storage: new CookieStorage({path: '/'}) }))

export default app
