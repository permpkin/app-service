import SocketHost from 'Socket.io'
import SocketInitClass from '../@classes/socket/init'
import { User } from '../@models/user'
import { Document } from 'mongoose'
import SocketUserClass from '../@classes/socket/users'

/**
 * @description Socket service.
 * - default socket connection initialization.
 */
export default class SocketService {

	User: Document

	/**
	 * @param IO websocket server/host
	 * @param Socket websocket connection
	 */
	constructor(Socket: SocketHost.Socket) {

		this.User = new User()

		// Base class init methods.
		new SocketInitClass(this, Socket)

		// Add additional classes here.
		new SocketUserClass(this, Socket)

	}

}
