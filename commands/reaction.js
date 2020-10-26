const messageUtil = require('../messages.js');

module.exports = {
	name: 'reaction',
	description: 'reactions test',
	args_required: 0,
	max_args: 999,
	cooldown: 0,
	async execute(message, args) {
		const output = message.channel.send(`✅ | Reacting to this message`);
		try {
			await output.react('✅');
			await output.react('❌');
		}
		catch(err) {
			console.error(err);
			messageUtil.sendError(message, 'Could not react to the message!');
		}
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
