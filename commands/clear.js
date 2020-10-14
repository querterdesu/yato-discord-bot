module.exports = {
	name: 'clear',
	description: 'Clear messages up to 100!',
	aliases: ['clean', 'prune'],
	args_required: 1,
	max_args: 1,
	usage: '<# of messages to clear>',
	guildOnly: true,
	cooldown: 5,
	permissions: ['MANAGE_MESSAGES'],
	execute(message, args) {
		const amount = parseInt(args[0]) + 1;
		if (isNaN(amount)) {
			return message.channel.send('The argument you provided isn\'t a number.');
		}
		else if (amount < 1 || amount > 99) {
			return message.channel.send('You input a wrong number, either too small or too large for the command.');
		}
		message.channel.bulkDelete(amount).catch(err => {
			console.error(err);
			message.channel.send('There was an error trying to clear these messages!');
		});
		message.channel.send('Successfully cleared the messages!');
		message.channel.send(`Messages cleared: ${amount}`);
		setTimeout(() =>
			message.channel.bulkDelete(1).catch(err => {
				console.error(err);
				message.channel.send('There was an error.');
			}),
		2500);
	},
};
