const messageUtil = require('../messages.js');

module.exports = {
	name: 'reaction',
	description: 'reactions test',
	args_required: 0,
	max_args: 999,
	cooldown: 0,
	async execute(message, args) {
		message.channel.send('✅ | Reacting to this message').then(sentMessage => {
			sentMessage.react('✅').then(() => sentMessage.react('❌'));
		});
		const filter = (reaction, user) => {
			return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id;
		};

		try {
			const collected = await message.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] });
			const reaction = collected.first();

			if (reaction.emoji.name === '✅') {
				messageUtil.sendInfo('You reacted with ✅.');
			}
			else if (reaction.emoji.name === '❌') {
				messageUtil.sendInfo('You reacted with ❌.');
			}
		}
		catch (collected) {
			console.log('You did not react with a check or an X.');
		}

	},
};
