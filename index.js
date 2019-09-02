module.exports = {
	Application: require('./src/Application.js'),
	Utils: require('./src/utils/index.js'),
	TemplateCommands: require('./src/commands/index.js'),
	Service: {
		CreateWindowsService: require('./src/service/ServiceWindows.js'),
	},
};