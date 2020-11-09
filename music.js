const ytdldiscord = require('ytdl-core-discord');
const messageUtil = require('./messages.js');
const play = require('./commands/play.js')
const queue = new Map();

module.exports = {
	async play(song, message) {
		if (song === 'evCLLTkQXSEERqXcEnfNvHrc') {
			if (!message.member.voice.channel) {
				return;
			}
			return message.member.voice.channel.leave();
		}
		const server = message.guild;

		let connection = '';
		if (message.member.voice.channel) {
			connection = await message.member.voice.channel.join();
		}
		else {
			messageUtil.sendError(message, 'You aren\'t in a voice channel!');
		}

		if (!song) {
			connection.channel.leave();
			queue.delete(message.guild.id);
			return messageUtil.sendInfo(message, 'Music queue ended.');
		}

		let stream = null;
		const streamType = song.includes('youtu') ? 'opus' : 'ogg_opus';

		try {
			if (song.includes('youtube.com') || song.includes('youtu.be')) {
				stream = await ytdldiscord(song, { highWaterMark: 20 });
			}
		}
		catch (err) {
			if (queue) {
				queue.songs.shift();
				play.play(queue.songs[0], message);
			}
			console.error(err);
			messageUtil.sendError(message, 'An error has occured.');
		}

		connection.on('disconnect', () => queue.delete(message.guild.id));

		const dispatcher = connection
			.play(stream, { type: streamType })
			.on('finish', () => {
				const lastSong = queue.songs.shift();
				queue.songs.push(lastSong);
				play.play(queue.songs[0], message);
			});
		dispatcher.setVolume(0.2);
	},
};