import SocketHost from 'socket.io'
import { config } from 'node-config-ts'
import { log } from '../../@services/logger'
import JWT from 'jwt-simple'
import Mongo from 'mongoose'
import { User } from '../../@models/user'

/**
 * @description base connection checks
 * - verify jwt token
 */
export const SocketAuth = (SocketStream: SocketHost.Socket, Next: Function) => {

	try {

		const Token = JWT.decode(SocketStream.handshake.query.token, config.jwt.secret)

		log(`find → ${Token.uid}`)

		User.findById(Token.uid, (err: any, UserDoc: any) => {

			if (err || UserDoc == null) {
				console.log('err', err)
				SocketStream.emit('auth_error', 'user not found')
				SocketStream.disconnect()
				return
			}
			
			log(`socket → auth()`)
			
			Next()

		})

	} catch (e) {

		log(e.message)
		SocketStream.disconnect()

	}

}
