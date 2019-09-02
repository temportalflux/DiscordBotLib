const path = require('path');
const fetch = require('node-fetch');
const lodash = require('lodash');
const Utils = require('../utils/index.js');

module.exports = {
	builder: {
		url: {
			optional: true,
		},
	},
	funcTemplate: (modelKey, {
		mapJsonToEntries = ((object) => object),
		getFilterFromJson,
		createEntryFromJson,
	}) => async (argv) =>
	{
		if (!argv.message.guild.available) { return; }

		try
		{
			const fileInfo = Utils.Messages.getFileUrl(argv, requiresName = false);

			const extension = path.extname(fileInfo.url);
			if (extension !== '.json')
			{
				await argv.message.reply("The provided file must be a json file.");
				return;
			}

			const result = await fetch(fileInfo.url, { method: 'GET' });
			const data = await result.json();

			await argv.application.database.importWithFilter(
				modelKey, mapJsonToEntries(data),
				(entry) => Utils.Sql.createWhereFilter(
					lodash.assign(
						{ guild: argv.message.guild.id },
						getFilterFromJson(entry)
					)
				),
				(entry) => lodash.assign(
					{ guild: argv.message.guild.id },
					createEntryFromJson(entry)
				)
			);
		}
		catch (e)
		{
			switch (e.error)
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
};