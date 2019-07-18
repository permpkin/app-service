import Mongo from 'mongoose'
import { config } from 'node-config-ts'

/**
 * @description Database service.
 * - handles global database io.
 */
export default class DatabaseService {

	constructor() {

		Mongo.connect(config.mongo.host, {
			useNewUrlParser: true,
			autoIndex: false
		})

		console.log('connected')

	}

}
