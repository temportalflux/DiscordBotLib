const Secrets = require('../secrets.json');
const Application = require('./Application.js');

class ApplicationSample extends Application
{

	constructor()
	{
		super({
			applicationName: 'sampleapp',
			discordToken: Secrets.token,
			commandPrefix: 'sampleapp',
		});
	}

}

const AppInstance = new ApplicationSample();