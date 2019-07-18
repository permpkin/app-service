import SocketHost from 'Socket.io'
import HttpStatus from 'http-status-codes'

import SocketService from '../../@services/socket'
import { SubscriberService } from '../../@services/subscriber'

export default class SocketInitClass {

	constructor(SocketInstance: SocketService, Socket: SocketHost.Socket) {

		/**
		 * @description verify user credentials
		 * - user authenticate.
		 * - detach existing user (if logged elsewhere), uses 'config.user.max_connections'.
		 */
		Socket.use((Packet: SocketHost.Packet, Next: any) => {

			// if (packet.doge === true) return next();
			// next(new Error('Not a doge error'));
			// Socket.disconnect(true)
			Next()
		
		})

		Socket.on('disconnect', () => {

			// remove all user subscriptions.
			SubscriberService.removeAll(SocketInstance.User._id)

		})

	}

}
