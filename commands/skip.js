const musicUtil = require('../music.js');
const messageUtil = require('../messages.js');

module.exports = {
	name: 'skip',
	description: 'Skip audio with the command!',
	guildOnly: true,
	args_required: 0,
	max_args: 0,
	async execute(message, args) {
		musicUtil.play('evCLLTkQXSEERqXcEnfNvHrc', message);
		messageUtil.sendSuccess(message, 'Successfully skipped the song!');
	},
};
