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
	sendWarning(ref, message) {
		return ref.channel.send(`⚠️ | ${message}`);
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
		return -1;
	},
	modlog(ref, message) {
		const modlog = ref.client.channels.cache.get('680019347569377297');
		modlog.send(message);
	},
	verifyTime(time_string) {
		if (time_string == 's') {
			return 1;
		} else if (time_string == 'm') {
			return 60;
		} else if (time_string == 'h') {
			return 3600;
		} else if (time_string == 'd') {
			return 3600 * 24;
		} else if (time_string == 'w') {
			return 3600 * 24 * 7;
		} else if (time_string == 'mo') {
			return 3600 * 24 * 30;
		} else if (time_string == 'y') {
			return 3600 * 24 * 365;
		}
	},
	getUserFromMention(self, mention) {
		const matches = mention.match(/^<@!?(\d+)>$/);
		if (!matches) return;
		const id = matches[0];
		return self.users.cache.get(id);
	}
};
