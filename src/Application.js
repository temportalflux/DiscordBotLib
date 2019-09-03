const lodash = require('lodash');

class Application
{

	/*
		options: {
			discordToken, commands:{prefix, directory}, applicationName, databaseModels
		}
	*/
	constructor(options)
	{
		const defaults = {
			classes: {
				CommandListener: require('./CommandListener.js'),
				DiscordBot: require('./DiscordBot.js'),
				Database: require('./Database.js'),
			},
			discordToken: 'INVALID_TOKEN',
			applicationName: 'SampleDiscordBot',
			databaseModels: {},
			commands: {
				prefix: 'INVALID_COMMAND_PREFIX',
				directory: '',
			},
			databaseLogging: false,
			logger: {
				info: console.log,
				warn: console.log,
				error: console.error,
			},
		};
		console.log('Creating application with options:', lodash.defaultsDeep({}, options, defaults));
		lodash.defaultsDeep(this, options, defaults);
		this.commandListener = new (this.classes.CommandListener)(this, this.commands);
		this.init(); // async
	}

	async init()
	{
		await this.initDatabase();
		await this.initBot();
	}

	async initDatabase()
	{
		await this.createDatabase(`${this.applicationName}.db`, 'sqlite', this.logger, this.databaseLogging);
	}

	async initBot()
	{
		this.bot = new (this.classes.DiscordBot)({
			application: this,
			token: this.discordToken
		}, this.logger);
		this.onBotPrelogin(this.bot);
		await this.bot.login();
	}

	onBotPrelogin(bot)
	{
		bot.on('ready', this.onBotReady.bind(this));
		bot.on('messageReceived', (msg) => this.commandListener.processMessage(msg));
	}

	async createDatabase(databaseName, dialect, logger, logging=false)
	{
		this.database = new (this.classes.Database)(databaseName, dialect,
			this.databaseModels,
			{
				// The `timestamps` field specify whether or not the `createdAt` and `updatedAt` fields will be created.
				// This was true by default, but now is false by default.
				timestamps: false
			},
			logger,
			logging
		);
		await this.setupDatabase();
		await this.database.init();
		await this.onDatabaseInit();
		await this.database.sync();
		await this.onDatabaseReady();
	}

	async setupDatabase() {}

	async onDatabaseInit() {}

	async onDatabaseReady() {}

	onBotReady() {}

}

module.exports = Application;