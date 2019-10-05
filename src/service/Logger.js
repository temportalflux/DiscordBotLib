const EventLogger = require('node-windows').EventLogger;

module.exports = (serviceName) => {
	const log = new EventLogger({
		source: serviceName,
		eventLog: 'Application'
	});
	return {
		info: (message) => new Promise((resolve) => {
			log.info(message, 1000, () => {
				console.log(message);
				resolve();
			});
		}),
		warn: (message) => new Promise((resolve) => {
			log.warn(message, 1000, () => {
				console.warn(message);
				resolve();
			});
		}),
		error: (message) => new Promise((resolve) => {
			log.error(message, 1000, () => {
				console.error(message);
				resolve();
			});
		}),
	};
};
