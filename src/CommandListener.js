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
		this.parser = this.parser
			.scriptName(this.getScriptName())
			.help('help');
	}

	getScriptName()
	{
		return `!${this.prefix}`;
	}

	async parseCommand(text, msg)
	{
		return new Promise((resolve, reject) =>
		{
			this.parser.parse(text, { application: this.application, message: msg }, (err, argv, output) =>
			{
				if (err) reject({ err: err, argv: argv, output: output });
				else resolve({ argv: argv, output: output });
			});
		});
	}

	async processMessage(msg)
	{
		const match = msg.content.match(new RegExp(`${this.getScriptName()} (.+)`));
		if (match !== null)
		{
			try
			{
				const {argv, output} = await this.parseCommand(match[1], msg);
				if (output)
				{
					await msg.reply(output);
				}
			}
			catch (error)
			{
				await msg.reply(error.message);
			}
		}
	}

}

module.exports = CommandListener;