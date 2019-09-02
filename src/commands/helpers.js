const lodash = require('lodash');

function builderToOptions(params)
{
	return lodash.keys(params).map(
		(paramName) => params[paramName].optional ? `[${paramName}]` : `<${paramName}>`
	);
}

function createCommand(commandName, builder)
{
	const builderOptionArray = builderToOptions(builder);
	return `${commandName}${builderOptionArray.reduce((accum, option) => `${accum} ${option}`, '')}`;
}

module.exports = {
	builderToOptions: builderToOptions,
	createCommand: createCommand,
};