const musicUtil = require('../music.ts');

module.exports = {
	name: 'skip',
	description: 'Skip audio with the command!',
	guildOnly: true,
	args_required: 0,
	max_args: 0,
	async execute(message, args) {
		musicUtil.skip(message);
	},
};
