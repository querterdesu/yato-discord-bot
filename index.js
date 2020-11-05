const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();
const { prefix, token } = require('./config.js');
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const cooldowns = new Discord.Collection();
const messageUtil = require('./messages.js');
const { modlog } = require('./messages.js');

for (const file of commandFiles) {
	const cmd = require(`./commands/${file}`);
	client.commands.set(cmd.name, cmd);
}

client.once('ready', () => {
	console.log('Ready!');
	client.user.setActivity('any calls', { type: 'LISTENING' });
});

const getUserFromMention = (mention) => {
	const matches = mention.match(/^<@!?(\d+)>$/);
	if (!matches) return;
	const id = matches[1];
	return client.users.cache.get(id);
};

client.on('message', msg => {
	if (!msg.content.startsWith(prefix) || msg.author.bot) return;

	const args = msg.content.slice(prefix.length).trim().split(' ');
	const cmdName = args.shift().toLowerCase();


	const cmd = client.commands.get(cmdName) || client.commands.find(command => command.aliases && command.aliases.includes(cmdName));

	if (!cmd) return;

	if (cmd.args_required) {
		let usage = '';
		if (cmd.args_required > args.length || cmd.max_args < args.length) {
			if (cmd.usage) {
				usage += `\nCorrect usage of command: \`${prefix}${cmd.name} ${cmd.usage}\``;
			}
			if (cmd.args_fail_message) {
				return messageUtil.sendError(msg, `${cmd.args_fail_message}${usage}`);
			}
			return messageUtil.sendError(msg, `Incorrect usage!${usage}`);
		}
	}

	if (cmd.guildOnly && msg.channel.type === 'dm') {
		return messageUtil.sendError(msg, 'I can\'t use this command inside DMs!');
	}

	if (cmd.permissions != '') {
		if (!msg.member.hasPermission(cmd.permissions)) {
			return messageUtil.sendError(msg, 'You don\'t have the sufficient permissions to use this command!');
		}
	}

	if (!cooldowns.has(cmd.name)) {
		cooldowns.set(cmd.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(cmd.name);
	const cooldownAmount = (cmd.cooldown || 0) * 1000;

	if (timestamps.has(msg.author.id)) {
		const expirationTime = timestamps.get(msg.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return messageUtil.sendError(msg, `Please wait ${timeLeft.toFixed(1)} more second(s) before doing this again!`);
		}
	}

	timestamps.set(msg.author.id, now);
	setTimeout(() => timestamps.delete(msg.author.id), cooldownAmount);

	try {
		cmd.execute(msg, args);
	}
	catch(error) {
		console.error(error);
		messageUtil.sendError(msg, 'There was an error executing that command! \nPlease contact the server administrators.');
	}
});

client.on('guildMemberRemove', async member => {
	const fetchLogs = await member.guild.fetchAuditLogs({
		limit: 1,
		type: 'MEMBER_KICK',
	});
	const kickLog = fetchLogs.entries.first();
	if (!kickLog) return console.log(`${member.user.tag} left the guild. Why?`);

	const { executor, target, reason } = kickLog;
	if (target.id === member.id) {
		const kickEmbed = new Discord.MessageEmbed()
			.setColor('#ff8800')
			.setAuthor(`Invoked by ${executor.user.discriminator}`, `${executor.displayAvatarURL({ format: "png", dynamic: true })}`, '')
			.setTitle(`👢 Kicked user ${target.user.discriminator}`)
			.setThumbnail(`${target.displayAvatarURL({ format: "png", dynamic: true })}`)
			.addFields(
				{ name: 'Reason', value: `${reason}` },
			)
			.setFooter(`AID: ${executor}, VID: ${target.id}`, '');
		messageUtil.modlog(kickEmbed);
	} else {
		console.log('Member left.');
	}
});

client.login(token);
