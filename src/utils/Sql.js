const lodash = require('lodash');
const Sql = rquire('sequelize');

function createWhereFilter(fields)
{
	return lodash.mapValues(fields,
		(item) => ({ [Sql.Op.eq]: item })
	);
}

function createSimpleOptions(fields)
{
	return {
		where: createWhereFilter(fields),
	};
}

module.exports = {
	createWhereFilter: createWhereFilter,
	createSimpleOptions: createSimpleOptions,
};