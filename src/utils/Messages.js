const lodash = require('lodash');
const path = require('path');

module.exports = {
	getFileUrl: (argv, requiresName=true) =>
	{
		const attachmentList = lodash.toPairs(argv.message.attachments);
		// Cannot have more than 1 image in an upload
		if (attachmentList.length > 1)
		{
			throw {
				error: 'TooManyAttachments',
				message: 'Please only link 1 url or attack 1 file.'
			};
		}
		// No attachment, must have link
		else if (attachmentList.length <= 0)
		{
			if ((requiresName && !argv.name) || !argv.url)
			{
				throw {
					error: 'MissingAttachment',
					message: 'If no attachment is supplied, please include a name and url.'
				};
			}
			return {
				name: requiresName ? argv.name.trim().replace(' ', '-') : undefined,
				url: argv.url,
			};
		}
		// 1 attachment, use it
		else
		{
			const attachment = attachmentList.shift()[1];
			const extension = path.extname(attachment.filename);
			return {
				name: attachment.filename.slice(0, extension.length),
				url: attachment.url,
			};
		}
	},
};