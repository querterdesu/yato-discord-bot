const { prefix } = require ('../config.ts');
const messageUtil = require('../messages.ts');

module.exports = {
	name: 'help',
	description: 'Get help on commands!',
	aliases: ['cmds', 'commands', 'command', 'cmd'],
	usage: '[command name]',
	args_required: 0,
	max_args: 1,
	cooldown: 1,
	execute(message, args, self) {
		const data = [];
		const { commands } = message.client;

		if (!args.length) {
			data.push('Here\'s a list of all of my commands:');
			data.push(commands.map(command => command.name).join(', '));
			return message.author.send(data, { split:true })
				.then(() => {
					if (message.channel.type === 'dm') return;
					message.react('👍');
				})
				.catch(error => {
					console.error(`Could not send commands to ${message.author.tag}.\n`, error);
					messageUtil.sendError(message, 'I could not DM you! Perhaps you have messages disabled?');
				});
		}

		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

		if (!command) {
			return messageUtil.sendError(message, 'Could not find the command you were looking for!');
		}

		data.push(`**Name:** ${command.name}`);

		if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
		if (command.description) data.push(`**Description:** ${command.description}`);
		if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);
		if (command.args_required) data.push(`**Required arguments:** ${command.args_required}`);

		data.push(`**Cooldown:** ${command.cooldown || 0} second(s)`);

		message.channel.send(data, { split:true });
	},
};
