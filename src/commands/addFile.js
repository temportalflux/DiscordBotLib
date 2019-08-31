const lodash = require('lodash');
const Utils = require('../utils/index.js');

module.exports = (cmdName, modelKey, modifyEntryData) => ({
	command: `${cmdName} [name] [url]`,
	builder: (yargs) => yargs,
	handler: async (argv) =>
	{
		if (!argv.message.guild.available) { return; }

		try
		{
			const data = lodash.assign({
				guild: argv.message.guild.id,
			}, Utils.Messages.getFileUrl(argv));

			const existingEntry = await argv.application.database.at(modelKey).findOne(
				Utils.Sql.createSimpleOptions(lodash.pick(data, ['guild', 'name']))
			);
			
			if (existingEntry)
			{
				await argv.message.reply(`There is already an entry with the name "${data.name}".`);
				return;
			}

			await argv.application.database.createEntry(modelKey,
				modifyEntryData ? modifyEntryData(data) : data	
			);
			await argv.message.reply(`Your entry has been saved as "${data.name}".`);
		}
		catch(e)
		{
			switch(e.error)
			{
				case 'TooManyAttachments':
				case 'MissingAttachment':
					await argv.message.reply(e.message);
				default:
					console.error(e);
					break;
			}
		}
	}
});