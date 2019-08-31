const Utils = require('../utils/index.js');

module.exports = (command, modelKey, attributes, modelToString) => ({
	command: `${command.name} ${command.options} [count] [page]`,
	builder: {
		...command.builderBlock,
		count: {
			type: 'int',
			describe: 'The amount of items per page',
			default: 10,
		},
		page: {
			type: 'int',
			describe: 'The page offset',
			default: 0,
		},
	},
	handler: async (argv) =>
	{
		if (!argv.message.guild.available) { return; }

		const text = await argv.application.database.listAsText(
			typeof modelKey === 'function' ? modelKey(argv) : modelKey,
			Utils.Sql.createWhereFilter({ guild: argv.message.guild.id }),
			attributes, modelToString, argv.count, argv.page
		);

		await argv.message.channel.send(text);
	}
});