const lodash = require('lodash');
const yargs = require('yargs');

class CommandListener
{

	constructor(options)
	{
		lodash.assignIn(this, options);
		this.parser = yargs;
		if (this.commandDir)
		{
			this.parser = this.parser.commandDir(this.commandDir);
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
		const match = msg.content.match(new RegExp(`!${this.prefix} (.+)`));
		if (match !== null)
		{
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