module.exports = {
	name: 'reload',
	description: 'Reload any command!',
	aliases: ['refresh'],
	usage: '<command name>',
	permissions: ['MANAGE_GUILD'],
	args_required: 1,
	max_args: 1,
	args_fail_message: 'You didn\'t provide a command to reload!',
	cooldown: 5,
	execute(message, args, self) {
		const commandName = args[0].toLowerCase();
		const command = message.client.commands.get(commandName) || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

		if (!command) return message.channel.send('Could not find the command you wanted to reload!');

		delete require.cache[require.resolve(`./${command.name}.js`)];

		try {
			const newCommand = require(`./${command.name}.js`);
			message.client.commands.set(newCommand.name, newCommand);
			message.channel.send(`Command ${command.name} was successfully reloaded!`);
		}
		catch (error) {
			console.error(error);
			message.channel.send('There was an error reloading that command!\nPlease contact the server administrators!');
		}

	},
};
