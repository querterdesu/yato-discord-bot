const ytdldiscord = require('ytdl-core-discord');
const messageUtil = require('./messages.js');
const play = require('./commands/play.js');
const queue = new Map();
module.exports = {
	equeue: queue,
	async setup(args, message, serverQueue) {
		const voiceChannel = message.member.voice.channel;
		let songInfo = 'No song info provided.';
		const song = {
			title: null,
			url: null,
		};
		if (args[0].includes('youtu')) {
			songInfo = await ytdldiscord.getInfo(args[0]);
			song['title'] = songInfo.title;
			song['url'] = songInfo.video_url;
		}
		else {
			song['title'] = 'No title provided.';
			song['url'] = args[0];
		}
		if (serverQueue) {
			serverQueue.songs.push(song);
			console.log(serverQueue.songs);
			return messageUtil.sendSuccess(message, `${song.title} has been added to the queue!`);
		}
		const queueConstruct = {
			textChannel: message.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 5,
			playing: true,
		};

		queue.set(message.guild.id, queueConstruct);
		queueConstruct.songs.push(song);

		try {
			const connection = await voiceChannel.join();
			queueConstruct.connection = connection;
			this.play(message.guild, queueConstruct.songs[0]);
		}
		catch(err) {
			console.error(err);
			queue.delete(message.guild.id);
			return messageUtil.sendError(message, err);
		}
	},
	play(guild, song) {
		const serverQueue = queue.get(guild.id);
		if (!song) {
			serverQueue.voiceChannel.leave();
			queue.delete(guild.id);
			return;
		}
		let playing = '';
		if (song.title !== 'No title provided.') {
			playing = ytdldiscord(song.url);
		}
		else {
			playing = song.url;
		}

		const dispatcher = serverQueue.connection
			.play(playing)
			.on('finish', () => {
				serverQueue.songs.shift();
				this.play(guild, serverQueue.songs[0]);
			})
			.on('disconnect', () => {
				serverQueue.songs = [];
				serverQueue.connection.dispatcher.end();
			})
			.on('error', error => console.error(error));
		dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
		messageUtil.sendInfo(serverQueue.textChannel, `Started playing next song! (${song.title})`);
	},
	skip(message, serverQueue) {
		if (!serverQueue) return messageUtil.sendError(message, 'There is no song to skip!');
		serverQueue.connection.dispatcher.end();
	},
	stop(message, serverQueue) {
		serverQueue.songs = [];
		serverQueue.connection.dispatcher.end();
	},
};