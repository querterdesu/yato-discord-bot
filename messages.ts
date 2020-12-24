import { Guild, GuildMember, Message } from "discord.js";

module.exports = {
	sendSuccess(ref: any, message: string): Message {
		return ref.channel.send(`✅ | ${message}`);
	},
	sendError(ref: any, message: string): Message {
		return ref.channel.send(`❌ | ${message}`);
	},
	sendInfo(ref: any, message: string): Message {
		return ref.channel.send(`❕ | ${message}`);
	},
	sendWarning(ref: any, message: string): Message {
		return ref.channel.send(`⚠️ | ${message}`);
	},
	confirmPrompt(ref: any, waitingTime: number): number {
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
	modlog(ref, message: string): void {
		const modlog = ref.client.channels.cache.get('680019347569377297');
		modlog.send(message);
	},
};
