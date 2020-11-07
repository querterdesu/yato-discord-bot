const ytdldiscord = require('ytdl-core-discord');
const messageUtil = require('./messages.js');
const play = require('./commands/play.js')

module.exports = {
	async play(song, message) {
		let connection = '';
		if (message.member.voice.channel) {
			connection = await message.member.voice.channel.join();
		}
		else {
			messageUtil.sendError(message, 'You aren\'t in a voice channel!');
		}

		const queue = message.client.queue.get(message.guild.id);

		if (!song) {
			connection.channel.leave();
			message.client.queue.delete(message.guild.id);
			return messageUtil.sendInfo(message, 'Music queue ended.');
		}

		let stream = null;
		const streamType = song.url.includes('youtu') ? 'opus' : 'ogg_opus';

		try {
			if (song.url.includes('youtube.com') || song.url.includes('youtu.be')) {
				stream = await ytdldiscord(song.url, { highWaterMark: 20 });
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

		queue.connection.on('disconnect', () => message.client.queue.delete(message.guild.id));

		const dispatcher = queue.connection
			.play(stream, { type: streamType })
			.on('finish', () => {
				const lastSong = queue.songs.shift();
				queue.songs.push(lastSong);
				play.play(queue.songs[0], message);
			});
		dispatcher.setVolumeLogarithmic(1);
	},
};