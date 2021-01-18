const Librus = require('librus-api');
const Discord = require('discord.js');
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
                        const hwEmbed = new Discord.MessageEmbed()
                            .setColor('#bbbbbb')
                            .setAuthor(`${homework['user']}`, '', '')
                            .setTitle(`${data['title']}`)
                            .setDescription(`${data['content']}`)
                            .addFields(
                                { name: 'Termin', value: `${data['to']}` },
                                { name: 'Status', value: `${status}`},
                            )
                            .setFooter(`AID: ${message.member.id}`, '');
                        message.channel.send(hwEmbed);
                    });
                }
            });
        });
	},
};