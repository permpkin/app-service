import Cluster from 'cluster'

/**
 * Global logger.
 * @param message log message
 */
export const log = (message: string): void => {
	if (Cluster.isMaster) {
		console.log(`${'[master]'} ${message}`)
	} else {
		console.log(`${`[worker][${Cluster.worker.id}]`} ${message}`)
	}
}