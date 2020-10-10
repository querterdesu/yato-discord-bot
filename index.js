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
});

client.on('message', msg => {
	if (!msg.content.startsWith(prefix) || msg.author.bot) return;

	const args = msg.content.slice(prefix.length).trim().split(' ');
	const cmdName = args.shift().toLowerCase();

	if (!client.commands.has(cmdName)) return;

	const cmd = client.commands.get(cmdName);

	if (cmd.args_required !== args.length) {
		return msg.channel.send(`Incorrect usage! \nCorrect usage: \`${prefix}${cmd.name} ${cmd.usage}\``);
	}

	if (cmd.guildOnly && msg.channel.type === 'dm') {
		return msg.channel.send('I can\'t use this command inside DMs!');
	}

  try {
    cmd.execute(msg, args);
  } catch(error) {
		console.error(error);
		msg.channel.send('There was an error executing that command! \nPlease contact the server administrators.');
	}
});

client.login(token);
