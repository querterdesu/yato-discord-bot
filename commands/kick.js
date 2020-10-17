const messageUtil = require('../messages.js');

module.exports = {
	name: 'kick',
	description: 'Kicks the specified user.',
	args_required: 1,
	max_args: 999,
	usage: '<user to kick> [reason]',
	guildOnly: true,
	cooldown: 0,
	permissions: ['KICK_MEMBERS'],
	execute(message, args) {
		const userTagged = message.mentions.users.first();
		const misc = args.shift;
		const reason = args.join(' ');
		if (userTagged) {
			const memberTagged = message.guild.member(userTagged);
			if (memberTagged) {
				if (message.member.roles.highest.comparePositionTo(memberTagged.roles.highest) > 0) {
					memberTagged.kick(reason).catch(err => {
						console.error(err);
						messageUtil.sendError(message, 'Could not kick user!');
					});
					messageUtil.sendSuccess(message, 'Successfully kicked the user!');
				}
				else {
					return messageUtil.sendError(message, 'You don\'t have sufficent permissions.');
				}
			}
		}
	},
};
