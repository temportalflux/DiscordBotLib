module.exports = {
	builder: {
		nameOld: {
			optional: false,
		},
		nameNew: {
			optional: false,
		},
	},
	funcTemplate: (modelKey) => (async (argv) =>
	{
		if (!argv.message.guild.available) { return; }

		if (!argv.nameOld || !argv.nameNew)
		{
			await argv.message.reply("Please provide an valid names so I can modify the correct entry.");
			return;
		}

		const oldName = `${argv.nameOld}`.trim().replace(' ', '-');
		const newName = `${argv.nameNew}`.trim().replace(' ', '-');
		
		try
		{
			await argv.application.database.replaceField(
				modelKey,
				{ name: [oldName, newName] },
				{ guild: argv.message.guild.id }
			);
		}
		catch(e)
		{
			switch (e.error)
			{
				case 'InvalidSourceEntry':
					await argv.message.reply(e.message);
					break;
				case 'DestinationEntryAlreadyExists':
					await argv.message.reply(e.message);
					break;
				default:
					console.error(e);
					break;
			}
			return;
		}
		
		await argv.message.reply(`The image formerly named "${oldName}" is now named "${newName}".`);
	}),
};