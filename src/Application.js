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
		lodash.assignIn(this, {
			discordToken: 'INVALID_TOKEN',
			applicationName: 'SampleDiscordBot',
			databaseModels: {},
			commands: {
				prefix: 'INVALID_COMMAND_PREFIX',
				directory: '',
			},
		}, options);
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
		await this.createDatabase(`${this.applicationName}.db`, 'sqlite');
	}

	async initBot()
	{
		this.bot = new DiscordBot({
			application: this,
			token: this.discordToken
		});
		this.onBotPrelogin(this.bot);
		await this.bot.login();
	}

	onBotPrelogin(bot)
	{
		bot.on('messageReceived', (msg) => this.commandListener.processMessage(msg));
	}

	async createDatabase(databaseName, dialect)
	{
		this.database = new Database(databaseName, dialect,
			this.databaseModels,
			{
				// The `timestamps` field specify whether or not the `createdAt` and `updatedAt` fields will be created.
				// This was true by default, but now is false by default.
				timestamps: false
			}
		);
		this.setupDatabase();
		await this.database.init();
		await this.database.sync();
		this.onDatabaseReady();
	}

	setupDatabase() {}

	onDatabaseReady() {}

}

module.exports = Application;