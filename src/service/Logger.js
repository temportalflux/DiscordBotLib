const EventLogger = require('node-windows').EventLogger;

module.exports = (serviceName) => {
	const log = new EventLogger({
		source: serviceName,
		eventLog: 'Application'
	});
	return {
		info: (message) => new Promise((resolve) => {
			log.info(message, () => {
				console.log(message);
				resolve();
			});
		}),
		warn: (message) => new Promise((resolve) => {
			log.warn(message, () => {
				console.warn(message);
				resolve();
			});
		}),
		error: (message) => new Promise((resolve) => {
			log.error(message, () => {
				console.error(message);
				resolve();
			});
		}),
	};
};
