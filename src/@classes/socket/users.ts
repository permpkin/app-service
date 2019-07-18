import SocketHost from 'Socket.io'
import HttpStatus from 'http-status-codes'

import { User } from '../../@models/user'
import SocketService from '../../@services/socket'
import { config } from 'node-config-ts';

/**
 * user methods
 * @description socket methods for userclass.
 */
export default class SocketUserClass {

	constructor(SocketInstance: SocketService, Socket: SocketHost.Socket) {

		Socket.on('cmd__get_users', (request, respond) => {

			const params = {...{ filters: {}, page: 1, limit: config.doc_limit }, request}

			// prevent document limit higher than hard limit.
			params.limit = Math.min(params.limit, config.doc_limit_max)

			console.log(request)

			User.find(
				request.filters,
				null,
				{ skip: request.limit * request.page, limit: request.limit },
				(err, users) => {

					console.log(users)

					if (err)
						return respond({ code: HttpStatus.BAD_REQUEST, errors: [err] })
				
					respond({ code: HttpStatus.OK, users: users })

			})

		})

		Socket.on('cmd__get_user', (request, respond) => {

			const params = {...{ id: null }, request}

			if (params.id == null)
				return respond({ code: HttpStatus.BAD_REQUEST, errors: ['invalid id'] })

			User.findOne(
				request.id,
				(err, user) => {

					if (err)
						return respond({ code: HttpStatus.BAD_REQUEST, errors: [err] })
				
					respond({ code: HttpStatus.OK, user: user })

			})

		})

	}

}
