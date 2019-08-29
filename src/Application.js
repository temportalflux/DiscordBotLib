const lodash = require('lodash');
const DiscordBot = require('./DiscordBot.js');
const CommandListener = require('./CommandListener.js');
const Database = require('./Database.js');

class Application
{

	/*
		options: {
			discordToken, commandPrefix, applicationName, databaseModels
		}
	*/
	constructor(options)
	{
		lodash.assignIn(this, {
			discordToken: 'INVALID_TOKEN',
			commandPrefix: 'INVALID_COMMAND_PREFIX',
			applicationName: 'SampleDiscordBot',
			databaseModels: {},
		}, options);
		this.commandListener = new CommandListener({
			application: this,
			prefix: this.commandPrefix,
		});
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

		this.bot.on('messageReceived', (msg) => this.commandListener.processMessage(msg));

		await this.bot.login();
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