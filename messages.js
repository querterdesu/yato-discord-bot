module.exports = {
	sendSuccess(ref, message) {
		return ref.channel.send(`✅ | ${message}`);
	},
	sendError(ref, message) {
		return ref.channel.send(`❌ | ${message}`);
	},
	sendInfo(ref, message) {
		return ref.channel.send(`❕ | ${message}`);
	},
	confirmPrompt(ref, waitingTime) {
		ref.react('✅').then(() => { ref.react('❌'); });

		const filter = (reaction, user) => {
			return ['✅', '❌'].includes(reaction.emoji.name) && user.id === ref.author.id;
		};

		ref.awaitReactions(filter, { max: 1, time: waitingTime, errors: ['time'] }).then(collected => {
			const reaction = collected.first();

			if (reaction.emoji.name === '✅') {
				return 1;
			}
			else if (reaction.emoji.name === '❌') {
				return 0;
			}

		}).catch(collected => { console.error(`User did not react. ${collected}`); return -1; });
	},
};
