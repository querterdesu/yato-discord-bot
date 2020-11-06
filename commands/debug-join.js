const messageUtil = require('../messages.js');

module.exports = {
	name: 'debug-join',
	description: 'Simulate a person joining the server!',
	aliases: ['join-spoof'],
	usage: '[command name]',
	args_required: 0,
	max_args: 0,
	cooldown: 3,
	guildOnly: true,
	permissions: ['MANAGE_SERVER'],
	execute(message, args) {
		message.client.emit('guildMemberAdd', message.member);
	},
};