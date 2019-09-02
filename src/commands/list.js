const lodash = require('lodash');
const Utils = require('../utils/index.js');

module.exports = {
	builder: {
		count: {
			optional: true,
			type: 'int',
			describe: 'The amount of items per page',
			default: 10,
		},
		page: {
			optional: true,
			type: 'int',
			describe: 'The page offset',
			default: 0,
		},
	},
	funcTemplate: (modelKey, attributes, modelToString, filter={}) => async (argv) =>
	{
		if (!argv.message.guild.available) { return; }
	
		const text = await argv.application.database.listAsText(
			typeof modelKey === 'function' ? modelKey(argv) : modelKey,
			Utils.Sql.createWhereFilter(lodash.assign(
				{ guild: argv.message.guild.id },
				typeof filter === 'function' ? filter(argv) : filter
			)),
			attributes, modelToString, argv.count, argv.page
		);
	
		await argv.message.channel.send(text);
	}
};