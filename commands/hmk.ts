const Librus = require('librus-api');
let client = new Librus();

module.exports = {
	name: 'hmk',
	description: 'yeh',
	args_required: 0,
	max_args: 0,
	usage: '',
	guildOnly: true,
	cooldown: 0,
	permissions: ['BAN_MEMBERS'],
    execute(message, args, self) {
        let fulls = ''
        client.authorize(process.env.LOGIN, process.env.PASSWORD).then(() => {
            client.homework.listHomework(-1).then((data) => {
                for (const homework of data) {
                    client.homework.getHomework(homework['id']).then((data) => {
                        let status = '-';
                        if (homework['status'] == 'Nie przesłano') {
                            status = 'Nie przesłano';
                        } else if (homework['status'] != '-') {
                            status = 'Przesłano';
                        }
                        fulls += `\n*Zadane przez:* ${homework['user']}\n*Tytuł:* ${data['title']}\n*Treść:* ${data['content']}\n*Data wykonania:* ${data['to']}\nStatus: ${status}`
                    });
                }
            });
        });
        message.channel.send(fulls);
	},
};