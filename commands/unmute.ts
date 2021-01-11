const messageUtil = require('../messages.ts');

module.exports = {
	name: 'unmute',
	description: 'Unmutes the specified user.',
	args_required: 1,
	max_args: 999,
	usage: '<user to unmute> <reason>',
	guildOnly: true,
	cooldown: 0,
	permissions: ['MANAGE_MESSAGES'],
	execute(message, args, self) {
        const userTagged = message.mentions.users.first();
        const reason = args.slice(1).join(' ');
        if (!userTagged) messageUtil.sendError('Could not retrieve user from message!');
        const memberTagged = message.guild.member(userTagged);
        if (!memberTagged) messageUtil.sendError('The user exists, but isn\'t in this server!');
        memberTagged.roles.remove(message.guild.roles.cache.find(role => role.id === '687419099109916716'));
        self.emit('unmuteMember', message.member, memberTagged, reason);
	},
};