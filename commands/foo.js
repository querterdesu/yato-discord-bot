module.exports = {
	name: 'foo',
	description: 'Foobar!',
	args_required: 0,
	usage: '',
	guildOnly: true,
	cooldown: 5,
	execute(message, args) {
		message.channel.send('bar');
	},
};
