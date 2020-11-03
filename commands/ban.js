const messageUtil = require('../messages.js');

module.exports = {
	name: 'ban',
	description: 'Bans the specified user.',
	args_required: 1,
	max_args: 999,
	usage: '<user to ban> [reason]',
	guildOnly: true,
	cooldown: 0,
	permissions: ['BAN_MEMBERS'],
	async execute(message, args) {
		const userTagged = message.mentions.users.first();
		const misc = args.shift;
		const reason = args.join(' ');
		if (userTagged) {
			const memberTagged = message.guild.member(userTagged);
			if (memberTagged) {
				if (message.member.roles.highest.comparePositionTo(memberTagged.roles.highest) > 0) {
					messageUtil.confirmPrompt(message, 15000).then((confirmed) => {
						if (confirmed) {
							memberTagged.ban({
								days: 7,
								reason: `${reason}`,
							}).catch(err => {
								console.error(err);
								messageUtil.sendError(message, 'Could not ban user!');
							});
							messageUtil.sendSuccess(message, 'Successfully banned the user!');
							messageUtil.modlog(`Banned user ${userTagged} for reason ${reason}.`);
						}
						else {
							messageUtil.sendSuccess(message, 'Successfully cancelled the prompt!');
						}
					});
				}
				else {
					return message.channel.send('You don\'t have sufficent permissions.');
				}
			}
		}
	},
};
