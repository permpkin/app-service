import Cluster from 'cluster'
import Net from 'net'
import { config } from 'node-config-ts'
import { log } from './@services/logger'
import { fetchAssignedWorker, CpuCount } from './@services/utils'

import Http from 'http'
import SocketHost from 'socket.io'
import SocketRedis from 'socket.io-redis'
import SocketService from './@services/socket'
import { SocketAuth } from './@classes/socket/auth'
import DatabaseService from './@services/database'

if (Cluster.isMaster) {

	/**
	 * @description array of active workers.
	 */
	const Workers: Array<Cluster.Worker> = []

	/**
	 * @description Fork a worker process for each CPU count.
	 */
  for (let i = 0; i < (config.max_proc < 0 ? CpuCount : config.max_proc); i += 1) {
		
		Workers.push(Cluster.fork())

		Workers[i].on('disconnect', () => log('died'))

		/**
		 * @description Workers pass message data to master.
		 */
		Workers[i].on('message', (msg) => {
			// console.log('msg', msg)
			// if(msg==='newMessage'){
			// 		console.log('master is notified about new message by worker', Workers[i].id);
			// 		// sendNewmessage(msg);
			// }
		})
		
  }

	/**
	 * @description master is notified of worker online status.
	 */
  Cluster.on('online', (Worker: Cluster.Worker) => {
    log(`spawn_worker(${Worker.id})`)
  })

	/**
	 * @description master is notified of worker exit.
	 */
  Cluster.on('exit', (Worker: Cluster.Worker, code: Number, status: String) => {

    if (code === 0 || Worker.exitedAfterDisconnect) {
      log(`Worker ${Worker.id} finished.`)
      return null
    }
		
		log(`EXIT(${code},${status})`)
		
  })

	/**
	 * Passthrough TCP stream service
	 * @description distributes TCP socket connections to allocated worker. 
	 */
	Net.createServer({
		pauseOnConnect: true 
	}, (SocketConnection: Net.Socket) => {

		/**
		 * @description lookup worker from connection.
		 */
		const Worker: Cluster.Worker = Workers[fetchAssignedWorker(SocketConnection)]

		log(`assign → [worker-${Worker.id}]`)

		/**
		 * @description send tcp connection to worker
		 * - worker will continue/resume connection once received.
		 */
		Worker.send('attachSocketWorker', SocketConnection)

	}).listen(config.tcp_port)

	/**
	 * @description cleanup master on destroy.
	 */
	process.on('SIGINT',() => {
		
		log(`clean()`)
		
		process.exit(0)

	})
	
} else if (Cluster.isWorker) {

	log('start')

	const Worker = Cluster.worker

	const Server = Http.createServer()
	
	const IO = SocketHost(Server)
	
	IO.adapter(SocketRedis({ host: 'localhost', port: 6379 }))
	
	IO.use(SocketAuth)
	
	IO.on('connection', ( Socket: SocketHost.Socket ) => new SocketService(Socket))

	/**
	 * @description listen for {SocketStream}
	 * - resume connection once received.
	 */
	Worker.on('message', (method: String, SocketStream: Net.Socket) => {

		switch(method){
		
			case 'attachSocketWorker':
				Server.emit('connection', SocketStream)
				SocketStream.resume()
			break
		
			default: return
		
		}

	})

	/**
	 * Create database connection
	 */
	new DatabaseService()

	/**
	 * @description start listening on specified port.
	 */
	Server.listen(config.ws_port, () => log(`ready`))

	/**
	 * @description cleanup worker on destroy.
	 */
	process.on('SIGINT',() => {
		
		log(`clean()`)
		Server.close()
		process.exit(0)

	})

}
