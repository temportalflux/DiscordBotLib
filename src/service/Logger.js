const EventLogger = require('node-windows').EventLogger;
module.exports = (serviceName) => {
	const log = new EventLogger({
		source: serviceName,
		eventLog: 'Application'
	});
	return {
		info: (message) => {
			console.log(message);
			log.info(message);
		},
		warn: (message) => {
			console.log(message);
			log.warn(message);
		},
		error: (message) => {
			console.error(message);
			log.error(message);
		},
	};
};
