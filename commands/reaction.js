const messageUtil = require('../messages.js');

module.exports = {
	name: 'reaction',
	description: 'reactions test',
	args_required: 0,
	max_args: 999,
	cooldown: 0,
	execute(message, args) {
		messageUtil.confirmPrompt(message, 60000);
	},
};
