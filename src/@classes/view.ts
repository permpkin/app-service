import { MemoryService } from "../@services/memory"

export default class CommonView {

	viewId: string = ''
	viewData: any = {}
	subscribeTo: Array<string> = []

	constructor() {

		// Store view in memory.
		MemoryService.set(`V-${this.viewId}`, this.viewData)

	}

	/**
	 * Check if a user can access a specified view.
	 * @param viewId viewId to query
	 * @param userId user requesting access
	 */
	canUserView(viewId: string, userId: string): boolean {
		//
		return true
	}

	/**
	 * request viewData using viewId.
	 * @param viewId viewId to query.
	 */
	getViewFromId(viewId: string) {
		//
	}
	
}