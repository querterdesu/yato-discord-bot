const messageUtil = require('../messages.js');

module.exports = {
	name: 'reaction',
	description: 'reactions test',
	args_required: 0,
	max_args: 999,
	cooldown: 0,
	async execute(message, args) {
		const sMsg = message.channel.send('✅ | Reacting to this message')
			.then((sentMessage) => { sentMessage.react('✅'); sentMessage.react('❌'); });
		const filter = (reaction, user) => {
			return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id;
		};

		sMsg.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] }).then(collected => {
			const reaction = collected.first();

			if (reaction.emoji.name === '✅') {
				messageUtil.sendInfo(message, 'You reacted with ✅.');
			}
			else if (reaction.emoji.name === '❌') {
				messageUtil.sendInfo(message, 'You reacted with ❌.');
			}

		}).catch(() => messageUtil.sendError(message, 'You didn\'t react with anything.'));

	},
};
