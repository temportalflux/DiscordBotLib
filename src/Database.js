const Sequelize = require('sequelize');
const lodash = require('lodash');

class Database
{

	constructor(fileName, dialect, models, options)
	{
		// https://sequelize.org/master/manual/getting-started.html
		this.db = new Sequelize(
			{
				dialect: dialect,
				storage: fileName,
				define: options,
			}
		);

		this.models = lodash.toPairs(models).reduce(
			(accum, [name, modelInfo]) =>
			{
				accum[name] = this.db.define(name, modelInfo.attributes,
					lodash.assign({}, {
						underscored: true,
					}, modelInfo.options)
				);
				return accum;
			}, {}
		);
	}

	async init()
	{
		try
		{
			await this.db.authenticate();
			console.log('Connection has been established successfully.');
		}
		catch (err)
		{
			console.error('Unable to connect to the database:', err);
		}
	}

	async sync(options)
	{
		try
		{
			await this.db.sync(options);
			console.log('Database models have been synced.');
		}
		catch (err)
		{
			console.error('Unable to sync the database models:', err);
		}
	}

	async listAsText(Model, whereContext, attribs, modelToText, pageCount, pageIndex)
	{
		const {rows, count} = await Model.findAndCountAll({
			where: whereContext,
			attributes: attribs,
			offset: pageCount * pageIndex,
			limit: pageCount,
		});
		if (count <= 0)
		{
			return "There are no entries here";
		}
		return rows
			.map(modelToText)
			.reduce(
				(accum, text) => `${accum}\n- ${text}`,
				`Page ${pageIndex} (${pageIndex * pageCount + 1} - ${(pageIndex + 1) * pageCount}): (${count} total)`
			);
	}

	async export(Model, options)
	{
		const rows = await Model.findAll(options);
		return rows.map((modelInst) => modelInst.toJSON());
	}

	async importWithFilter(Model, data, getFilter, createEntryData)
	{
		const entriesToAdd = [];
		for (const entry of data)
		{
			const instance = await Model.findOne({
				where: getFilter(entry),
				attributes: [],
			});
			if (instance === null)
			{
				entriesToAdd.push(createEntryData(entry));
			}
		}
		if (entriesToAdd.length > 0)
		{
			await Model.bulkCreate(entriesToAdd);
		}
	}

	/*
		changes: {
			field: [oldValue, newValue]
		}
		filter: {
			anotherField: value
		}
	*/
	async replaceField(Model, changes, filter={})
	{
		const getDelta = (deltaIndex) => lodash.mapValues(changes, (delta) => delta[deltaIndex]);
		const createFilter = (deltaIndex) => lodash.mapValues(
			// merge the delta and the filter, overriding the filter using the delta
			lodash.assign({}, filter, getDelta(deltaIndex)),
			// Change total filter object to Sql syntax
			(filterItem) => ({ [Sql.Op.Eq]: filterItem })
		);

		const srcEntry = await Model.findOne({ where: createFilter(0) });
		if (!srcEntry)
		{
			throw new Error(`There is no image with the name "${oldName}".`);
		}

		const destEntry = await Model.findOne({ where: createFilter(1) });
		if (destEntry)
		{
			throw new Error(`There is already an image with the name "${newName}".`);
		}

		const newValues = getDelta(1);
		await srcEntry.update(newValues, { fields: lodash.keys(newValues) });
	}

}

module.exports = Database;