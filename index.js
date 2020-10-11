const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();
const { prefix, token } = require('./config.js');
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const cooldowns = new Discord.Collection();

for (const file of commandFiles) {
	const cmd = require(`./commands/${file}`);
	client.commands.set(cmd.name, cmd);
}

client.once('ready', () => {
	console.log('Ready!');
	client.user.setActivity('any calls', {type: 'LISTENING'});
});

client.on('message', msg => {
	if (!msg.content.startsWith(prefix) || msg.author.bot) return;

	const args = msg.content.slice(prefix.length).trim().split(' ');
	const cmdName = args.shift().toLowerCase();


	const cmd = client.commands.get(cmdName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmdName));

	if (!cmd) return;

	if (cmd.args_required !== args.length) {
		let usage = '';
		if (cmd.usage) {
			usage += `\nCorrect usage of command: \`${prefix}${cmd.name} ${cmd.usage}\``;
		}

		return msg.channel.send(`Incorrect usage!${usage}`);
	}

	if (cmd.guildOnly && msg.channel.type === 'dm') {
		return msg.channel.send('I can\'t use this command inside DMs!');
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
			return msg.channel.send(`Please wait ${timeLeft.toFixed(1)} more second(s) before doing this again!`);
		}
	}

	timestamps.set(msg.author.id, now);
	setTimeout(() => timestamps.delete(msg.author.id), cooldownAmount);

  try {
    cmd.execute(msg, args);
  } catch(error) {
		console.error(error);
		msg.channel.send('There was an error executing that command! \nPlease contact the server administrators.');
	}
});

client.login(token);
