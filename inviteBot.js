const open = require('open');
const Secrets = require(process.argv[2]);
console.log(process);
// opens the url in the default browser 
open(`https://discordapp.com/oauth2/authorize?client_id=${Secrets.clientId}&scope=bot`);