const Discord = require('discord.js');
const lodash = require('lodash');
const events = require('events');

class DiscordBot extends events.EventEmitter
{

	constructor(options)
	{
		super();
		lodash.assignIn(this, options);
		// https://discord.js.org/#/docs/main/stable/general/welcome
		this.client = new Discord.Client();
		this.onClientCreated();
	}

	onClientCreated()
	{
		console.log("Discord client created");
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
			console.error('Could not log in bot to discord:', err);
		}
	}

	onClientReady()
	{
		this.emit('ready', this.client);

		this.client.guilds.forEach((guild, guildId) =>
		{
			if (guild.available)
			{
				console.log(`Logged in as ${this.client.user.tag} on guild "${guild.name}"#${guildId}!`);
				this.emit('joinedGuild', guild, this.client);
			}
			// Bot was removed from the guild
			if (guild.deleted)
			{
				this.emit('removedFromGuild', guild);
			}
		});
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