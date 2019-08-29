const path = require('path');
const Secrets = require(path.join(process.cwd(), process.argv[2]));

const open = require('open');
// opens the url in the default browser 
open(`https://discordapp.com/oauth2/authorize?client_id=${Secrets.clientId}&scope=bot`);