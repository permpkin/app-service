import SendGrid from '@sendgrid/mail'
import Queue from 'bull'
import { config } from 'node-config-ts'

/**
 * @description Email service.
 * - handles global outbound emails.
 */
export class EmailServiceProvider {

	Queue = new Queue('emailQueue', config.sendgrid.redis)

	constructor() {
		
		SendGrid.setApiKey(config.sendgrid.api_token)

		this.Queue.process((job, done) => {

			SendGrid.send(job.data)
				.then((response) => done())

		})

	}

	sendEmail(message: any) {
		// const msg = {
		// 	to: 'test@example.com',
		// 	from: 'test@example.com',
		// 	subject: 'Sending with Twilio SendGrid is Fun',
		// 	text: 'and easy to do anywhere, even with Node.js',
		// 	html: '<strong>and easy to do anywhere, even with Node.js</strong>',
		// };
		return this.Queue.add(message)
	}

}
