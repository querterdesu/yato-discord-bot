const messageUtil = require('../messages.ts');

module.exports = {
	name: 'mute',
	description: 'Mutes the specified user.',
	args_required: 1,
	max_args: 999,
	usage: '<user to mute> <duration> <time unit> <reason>',
	guildOnly: true,
	cooldown: 0,
	permissions: ['MANAGE_MESSAGES'],
    execute(message, args, self) {
        const [misc, duration, misc2, ...reasonA] = args
        const userTagged = message.mentions.users.first();
        const durationMod = messageUtil.verifyTime(args[2]);
        const reason = reasonA.join(' ');
        if (!userTagged) messageUtil.sendError('Could not retrieve user from message!');
        const memberTagged = message.guild.member(userTagged);
        if (!memberTagged) messageUtil.sendError('The user exists, but isn\'t in this server!');
        memberTagged.roles.add(message.guild.roles.cache.find(role => role.id === '687419099109916716'))
        self.emit('muteMember', message.member, memberTagged, duration * durationMod, reason)
        setTimeout(() => {
            if (memberTagged.roles.cache.find(role => role.id === '687419099109916716')) {
                memberTagged.roles.remove(message.guild.roles.cache.find(role => role.id === '687419099109916716'));
                self.emit('unmuteMember', message.member, memberTagged, reason)
            }
        }, parseInt(duration) * durationMod);
	},
};

