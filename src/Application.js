const lodash = require('lodash');
const DiscordBot = require('./DiscordBot.js');
const CommandListener = require('./CommandListener.js');
const Database = require('./Database.js');

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
		lodash.assignIn(this, options);
		lodash.keys(defaults).forEach((key) => {
			if (this[key] === undefined)
				this[key] = defaults[key];
		});
		this.commandListener = new CommandListener(this, this.commands);
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
		this.bot = new DiscordBot({
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
		this.database = new Database(databaseName, dialect,
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