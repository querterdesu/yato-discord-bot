const musicUtil = require('../music.js');

module.exports = {
	name: 'skip',
	description: 'Skip audio with the command!',
	guildOnly: true,
	args_required: 0,
	max_args: 0,
	async execute(message, args) {
		const serverQueue = musicUtil.equeue.get(message.guild.id);
		musicUtil.skip(message, serverQueue);
	},
};
