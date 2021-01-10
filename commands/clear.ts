const messageUtil = require('../messages.ts');

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
	async execute(message, args, self) {
		const amount = parseInt(args[0]) + 1;
		if (isNaN(amount)) {
			return messageUtil.sendError(message, 'The argument you provided isn\'t a number.');
		}
		else if (amount < 1 || amount > 99) {
			return messageUtil.sendError(message, 'You input a wrong number, either too small or too large for the command.');
		}
		message.channel.bulkDelete(amount).catch(err => {
			console.error(err);
			messageUtil.sendError(message, 'There was an error trying to clear these messages!');
		});
		await messageUtil.sendSuccess(message, 'Successfully cleared the messages!');
		try {
			await message.channel.bulkDelete(1);
		}
		catch (err) {
			console.error(err);
			messageUtil.sendError(message, 'There was an error.');
		}
	},
};
