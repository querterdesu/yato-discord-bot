const musicUtil = require('../music.js');

module.exports = {
	name: 'stop',
	description: 'Stop audio with the command!',
	guildOnly: true,
	args_required: 0,
	max_args: 0,
	async execute(message, args) {
		musicUtil.clear(message);
	},
};