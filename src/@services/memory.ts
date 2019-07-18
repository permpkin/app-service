import Redis from 'redis'
// import { config } from 'node-config-ts'

/**
 * @description Memory service.
 * - handles global in-memory io.
 */
export const MemoryService = Redis.createClient()
