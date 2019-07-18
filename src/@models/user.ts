import Mongo from 'mongoose'

/**
 * User Schema
 */
export const Schema: Mongo.Schema = new Mongo.Schema({
  name: {
		first: String,
		last: String
	},
	email: String,
	phone: String,
	password: String,
	session_id: String,
	socket_id: String,
	verified: {
		phone: Boolean,
		email: Boolean
	},
	last_view: {
		path: String,
		params: Object
	},
	updatedAt: Date,
	createdAt: Date,
	lastLoginAt: Date,
	disconnectedAt: Date
})

Schema.methods.notifySubs = function (): void {
	// const Subscribers = DatabaseService.redis.get(`SUB_${this._id}`)
	// if (Subscribers) {
	// 	Subscribers.split(',').map(id => {
	//  SocketService.send(id, `_update_${this._id}`, this.toObject())
	// })
	// }
}

export const User = Mongo.model('Users', Schema)
