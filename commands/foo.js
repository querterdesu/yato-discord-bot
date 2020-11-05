module.exports = {
	name: 'foo',
	description: 'Foobar!',
	aliases: ['fo', 'foobar'],
	args_required: 0,
	max_args: 0,
	usage: '',
	guildOnly: true,
	cooldown: 5,
	execute(message, args) {
		messageUtil.sendSuccess(message, 'Successfully kicked the user!');
					const kickEmbed = new Discord.MessageEmbed()
						.setColor("#ff8800")
						.setTitle(`Kicked user ${userTagged}`);
		messageUtil.modlog(kickEmbed);
	},
};
