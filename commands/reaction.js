const messageUtil = require('../messages.js');

module.exports = {
	name: 'reaction',
	description: 'reactions test',
	args_required: 0,
	max_args: 999,
	cooldown: 0,
	execute(message, args) {
		message.react('✅').then(() => { message.react('❌'); });

		const filter = (reaction, user) => {
			return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id;
		};

		message.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] }).then(collected => {
			const reaction = collected.first();

			if (reaction.emoji.name === '✅') {
				messageUtil.sendSuccess(message, 'You confirmed the message.');
			}
			else if (reaction.emoji.name === '❌') {
				messageUtil.sendError(message, 'You denied the message.');
			}

		}).catch(collected => { messageUtil.sendError(message, 'You didn\'t react with anything.'); });

	},
};
