const Discord = require('discord.js');
const lodash = require('lodash');
const events = require('events');

class DiscordBot extends events.EventEmitter
{

	constructor(options, logger)
	{
		super();
		lodash.assignIn(this, options);
		this.logger = logger;
		// https://discord.js.org/#/docs/main/stable/general/welcome
		this.client = new Discord.Client();
		this.onClientCreated();
	}

	onClientCreated()
	{
		this.logger.info("Discord client created");
		this.client.on('ready', this.onClientReady.bind(this));
		this.client.on('message', this.onClientMessage.bind(this));
	}

	async login()
	{
		try
		{
			await this.client.login(this.token);
			this.emit('loginComplete');
		}
		catch (err)
		{
			this.logger.error('Could not log in bot to discord:', err);
		}
	}

	onClientReady()
	{
		this.client.guilds.forEach((guild, guildId) =>
		{
			if (guild.available)
			{
				this.logger.info(`Logged in as ${this.client.user.tag} on guild "${guild.name}"#${guildId}!`);
				this.emit('joinedGuild', guild, this.client);
			}
			// Bot was removed from the guild
			if (guild.deleted)
			{
				this.emit('removedFromGuild', guild);
			}
		});
		this.emit('ready', this.client);
	}

	onClientMessage(msg)
	{
		this.emit('messageReceived', msg);
	}

}

DiscordBot.events = [
	'ready',
	'loginComplete',
	'messageReceived',
	// when a bot tries to join a guild it was removed from
	'removedFromGuild',
	'joinedGuild',
];

module.exports = DiscordBot;