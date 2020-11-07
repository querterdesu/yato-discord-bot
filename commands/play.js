const messageUtil = require('../messages.js');
const musicUtil = require('../music.js');

module.exports = {
	name: 'play',
	description: 'Play audio with the command!',
	guildOnly: true,
	args_required: 1,
	max_args: 2,
	args_fail_message: 'You didn\'t provide a file/link to play audio from!',
	async execute(message, args) {
		if (message.attachments && args[0] === 'file') {
			musicUtil.play(message.attachments[0].url, message);
		}
		else {
			musicUtil.play(args[0], message);
		}
	},
};