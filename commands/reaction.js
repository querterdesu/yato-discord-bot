const messageUtil = require('../messages.js');

module.exports = {
	name: 'reaction',
	description: 'reactions test',
	args_required: 0,
	max_args: 999,
	cooldown: 0,
	execute(message, args) {
		const confirmed = messageUtil.confirmPrompt(message, 60000);
		if (confirmed === 1) {
			messageUtil.sendSuccess(message, 'You accepted the prompt.');
		}
		else if (confirmed === 0) {
			messageUtil.sendError(message, 'You denied the prompt.');
		}
		else {
			messageUtil.sendError(message, 'You didn\'t react in time!');
		}
	},
};
