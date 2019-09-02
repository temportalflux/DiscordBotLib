const lodash = require('lodash');
const Discord = require('discord.js');
const Utils = require('../utils/index.js');

module.exports = {
	builder: {},
	funcTemplate: (modelKey, exportedProperties, createFileName, getFilter = ((argv) => ({}))) =>
		async (argv) =>
		{
			if (!argv.message.guild.available) { return; }

			const exportedObject = await argv.application.database.export(
				typeof modelKey === 'function' ? modelKey(argv) : modelKey,
				{
					where: Utils.Sql.createWhereFilter(lodash.assign(
						{ guild: argv.message.guild.id },
						getFilter(argv)
					)),
					attributes: exportedProperties,
				}
			);
			await argv.message.reply("Here is your exported data file", {
				files: [
					new Discord.Attachment(
						Buffer.from(JSON.stringify(exportedObject)),
						`${createFileName(argv)}.json`
					)
				]
			});
		}
};