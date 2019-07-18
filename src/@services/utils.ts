import OS from 'os'
import { config } from 'node-config-ts'

export const FP32 = require('farmhash')

export const CpuCount = (config.max_proc < 0 ? OS.cpus().length : config.max_proc)

/**
 * Map device ip to worker using hash methods.
 * @param connection SocketService connection
 */
export const fetchAssignedWorker = (connection: any): any => {
	// using fingerprint as key, check redis for existing map
	return FP32.fingerprint32(connection.remoteAddress) % CpuCount
}
