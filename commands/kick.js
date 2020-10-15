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
						message.channel.send('Could not kick user!');
					});
				}
				else {
					return message.channel.send('You don\'t have sufficent permissions.');
				}
			}
		}
	},
};
