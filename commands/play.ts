const musicUtil = require('../music.ts');

module.exports = {
	name: 'play',
	description: 'Play audio with the command!',
	guildOnly: true,
	args_required: 1,
	max_args: 1,
	args_fail_message: 'You didn\'t provide a file/link to play audio from!',
	async execute(message, args, self) {
		console.log(args[0]);
		musicUtil.init(args, message);
	},
};