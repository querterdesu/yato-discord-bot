const messageUtil = require('../messages.ts');

module.exports = {
	name: 'spoof',
	description: 'Spoof an event happening!',
	aliases: ['simulate'],
	usage: '[command name]',
	args_required: 1,
	max_args: 1,
	cooldown: 3,
	guildOnly: true,
	permissions: ['MANAGE_SERVER'],
	execute(message, args, self) {
		message.client.emit(args[0], message.member);
	},
};