const musicUtil = require('../music.js');

module.exports = {
	name: 'play',
	description: 'Play audio with the command!',
	guildOnly: true,
	args_required: 1,
	max_args: 2,
	args_fail_message: 'You didn\'t provide a file/link to play audio from!',
	async execute(message, args) {
		const serverQueue = musicUtil.queue.get(message.guild.id);
		musicUtil.setup(args, message, serverQueue);
	},
};