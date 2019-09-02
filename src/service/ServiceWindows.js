const Service = require('node-windows').Service;

module.exports = ({ serviceName, description }, script) =>
{
	// Create a new service object
	const svc = new Service({
		name: serviceName,
		description: description,
		script: script,
		nodeOptions: []
	});

	// Listen for the "install" event, which indicates the
	// process is available as a service.
	svc.on('install', () =>
	{
		console.log('Starting service.');
		svc.start();
	});
	svc.on('alreadyinstalled', () =>
	{
		console.log('Service is already installed.');
	});

	// Listen for the "uninstall" event so we know when it's done.
	svc.on('uninstall', () =>
	{
		console.log('Uninstall complete.');
	});
	svc.on('alreadyuninstalled', () =>
	{
		console.log('Service is not installed.');
	});

	return svc;
};