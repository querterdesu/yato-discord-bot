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
			.setAuthor('Invoked by <admin>', `${message.author.displayAvatarURL({ format: "png", dynamic: true })}`, '')
			.setTitle('👢 Kicked user <user>')
			.setThumbnail(`${message.author.displayAvatarURL({ format: "png", dynamic: true })}`)
			.addFields(
				{ name: 'Reason', value: '<reason>' },
			)
			.setFooter('AID: <admin id>, VID: <victim id>', '');
		message.channel.send(kickEmbed);
	},
};
