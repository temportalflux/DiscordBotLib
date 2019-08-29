const lodash = require('lodash');
const yargs = require('yargs');

class CommandListener
{

	constructor(application, options)
	{
		this.application = application;
		lodash.assignIn(this, options);
		this.parser = yargs;
		if (this.directory)
		{
			this.parser = this.parser.commandDir(this.directory);
		}
	}

	async parseCommand(text, msg)
	{
		return new Promise((resolve, reject) =>
		{
			this.parser.parse(text, { application: this.application, message: msg }, (err, argv, output) =>
			{
				if (err) reject(err, argv, output);
				else resolve(argv, output);
			});
		});
	}

	async processMessage(msg)
	{
		console.log('Received message:', msg.content);
		const match = msg.content.match(new RegExp(`!${this.prefix} (.+)`));
		if (match !== null)
		{
			console.log(match);
			try
			{
				const result = await this.parseCommand(match[1], msg);
			}
			catch (error)
			{
				msg.reply(error.message);
			}
		}
	}

}

module.exports = CommandListener;