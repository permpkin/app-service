import SocketHost from 'Socket.io'
import HttpStatus from 'http-status-codes'

import { User } from '../../@models/user'
import SocketService from '../../@services/socket'
import { SubscriberService } from '../../@services/subscriber'

/**
 * View state manager
 * @description user requests view, views contain layout information and subscriber settings.
 * - object subscriptions are determined by the view itself.
 * - service determines whether user can access view before returning.
 */
export default class SocketViewClass {

	constructor(SocketInstance: SocketService, Socket: SocketHost.Socket) {

		Socket.on('cmd__view', (request, respond) => {

			// get view from view id + path + params
			// const View = new View(request.view)

			const View = {}

			// if user is in trip, called when app has initialised.
			respond({ code: HttpStatus.OK, response: View })

		})

	}

}
