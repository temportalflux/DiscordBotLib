module.exports = {
	Application: require('./src/Application.js'),
	CommandListener: require('./src/CommandListener.js'),
	DiscordBot: require('./src/DiscordBot.js'),
	Database: require('./src/Database.js'),

	Utils: require('./src/utils/index.js'),
	TemplateCommands: require('./src/commands/index.js'),
	Service: {
		CreateWindowsService: require('./src/service/ServiceWindows.js'),
		Logger: require('./src/service/Logger.js'),
	},
};