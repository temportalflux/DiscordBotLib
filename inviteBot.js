const open = require('open');
console.log(process);
const Secrets = require(process.argv[2]);
// opens the url in the default browser 
open(`https://discordapp.com/oauth2/authorize?client_id=${Secrets.clientId}&scope=bot`);