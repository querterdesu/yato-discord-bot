const musicUtil = require('../music.ts');

module.exports = {
	name: 'stop',
	description: 'Stop audio with the command!',
	guildOnly: true,
	args_required: 0,
	max_args: 0,
	async execute(message, args, self) {
		musicUtil.clear(message);
	},
};