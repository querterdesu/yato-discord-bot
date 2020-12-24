const fs = require('fs');

module.exports = {
    name: 'warn',
    description: 'Adds a warning to the mentioned user.',
    args_required: 2,
    max_args: 999,
    usage: '<user to warn> <warning>',
    guildOnly: true,
    cooldown: 0,
    permissions: ['MANAGE_MESSAGES'],
    execute(msg, args) {
        const userTagged = msg.mentions.users.first();
        const reason = args.slice(1, -1).join(' ');
        if (userTagged) {
            const memberTagged = msg.guild.member(userTagged);
            if (memberTagged) {
                if (msg.member.roles.highest.comparePositionTo(memberTagged.roles.highest) > 0) {
                    const warning = {
                        id: `${memberTagged.id}`,
                        reason: `${reason}`,
                    };
                    let data = JSON.parse( fs.readFileSync('../warnings.json') );
                    data.warnings.push(warning);
                    fs.writeFileSync('../warnings.json', JSON.stringify(data, null, 2));
                }
            }
        }
    }
};