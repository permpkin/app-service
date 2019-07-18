import { MemoryService } from './memory'

/**
 * @description global object subscriber class, handles user->object subscriptions.
 * - purely an in memory implementation.
 */
export class SubscriberServiceClass {

	/**
	 * Add subscription to object(s) for a single user.
	 * @param objects array of object ids
	 * @param userId target user id
	 * @returns Promise<void>
	 */
	add(objects: Array<string>, userId: string): Promise<void> {

		return new Promise((resolve, reject) => {

			MemoryService.get(`U-${userId}`, (UserResponse: any) => {

				const Subscriptions = UserResponse.subscriptions

				const NewSubscriptions: Array<string> = []

				objects.map((objectId) => {

					if (Subscriptions.indexOf(objectId) < 0) {
						Subscriptions.push(objectId)
						NewSubscriptions.push(objectId)
					}

				})

				// if new changes, update object subscribers.
				if (NewSubscriptions.length > 0) {

					NewSubscriptions.map((objectId) => {

						MemoryService.get(`O-${objectId}`, (Response: any) => {
							
							if (Response.subscribers.indexOf(userId) < 0)
								Response.subscribers.push(userId)

							// update subscription entry.
							MemoryService.set(`O-${userId}`, Response)

						})

					})

					// remove objectId from user subscriptions.
					MemoryService.set(`U-${userId}`, Subscriptions)

				}

				resolve()

			})

		})

	}

	/**
	 * Remove single subscription to an object for a single user.
	 * @param objectId the target object.
	 * @returns Promise<void>
	 */
	remove(objectId: string, userId: string, updateObject: boolean = true): Promise<void> {

		return new Promise((resolve, reject) => {

			MemoryService.get(`U-${userId}`, (UserResponse: any) => {

				if (!UserResponse) return reject()

				// remove objectId from user subscriptions.
				MemoryService.set(`U-${userId}`, UserResponse.subscriptions.filter((value: string) => {

					return objectId !== value
					
				}))

				// if flagged, update subscribed object subscriber list.
				if (updateObject)
					MemoryService.get(`O-${objectId}`, (Response: any) => {
						// remove user from subscriber list
						Response.subscribers = Response.subscribers.filter((value: string) => {

							return userId !== value
							
						})
						// update subscription entry.
						MemoryService.set(`O-${userId}`, Response)
					})

				resolve()

			})

		})

	}

	/**
	 * Remove all subscriptions to objects for a single user.
	 * @param userId the user id.
	 * @returns Promise<void>
	 */
	removeAll(UserId: string): Promise<void[]> | void {

		const Subscriptions: Array<string> = [] // get user subs

		if (Subscriptions.length == 0) return

		return Promise.all(Subscriptions.map((SubId: string) => {

			return this.remove(SubId, UserId)

		}))

	}

	/**
	 * Remove all subscriptions to an object id.
	 * - generally used if target object is destroyed.
	 * @param objectId the target object.
	 * @returns Promise<void>
	 */
	removeAttached(objectId: string): Promise<void> | void {

		return new Promise((resolve, reject) => {

			MemoryService.get(`O-${objectId}`, (Response: any) => {

				// if subscriber base exists, loop through subscribers/
				if (Response)
					Promise.all(Response.subscribers.map((uid: string) => {

						// remove user subscription.
						return this.remove(objectId, uid, false)

					})).then((response) => {
						MemoryService.del(`O-${objectId}`)
					})
				else
					// delete subscription entry.
					MemoryService.del(`O-${objectId}`)

			})

		})

	}

}

export const SubscriberService = new SubscriberServiceClass()
