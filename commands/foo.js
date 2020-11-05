const Discord = require('discord.js');

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
		const kickEmbed = new Discord.MessageEmbed()
			.setColor("#ff8800")
			.setTitle('Kicked user!');
		message.channel.send(kickEmbed);
	},
};
