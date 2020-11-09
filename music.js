const ytdl = require('ytdl-core-discord');
const messageUtil = require('./messages.js');
const queue = new Map();

const init = async (args, msg) => {
	const voiceChannel = msg.member.voice.channel;
	// check if member is in VC
	if (!voiceChannel) return messageUtil.sendError(msg, 'You aren\'t in a voice channel!');
	console.log('q');
	const queueConstructor = {
		connector: null,
		voiceChannel: voiceChannel,
		songs: [],
		volume: 0.5,
	};
	queue.set('queue', queueConstructor);

	console.log('check');
	let song = '';
	if (msg.attachments && args[0] === 'file') {
		song = msg.attachments[0];
	}
	else if (args[0].includes('youtu.be') || args[0].includes('youtube')) {
		song = await ytdl(args[0]);
	}
	else {
		song = args[0];
	}
	console.log(song);
	play(song, msg);
};

const play = (song, msg) => {
	const serverQueue = queue.get('queue');
	console.log('join')
	msg.member.voice.channel.join()
		.catch(err => console.error(err));
	if (!song) {
		serverQueue.voiceChannel.leave();
		queue.delete('queue');
		return;
	}
	console.log('start song');
	const dispatcher = serverQueue.connector
		.play(song)
		.on('finish', () => {
			serverQueue.songs.shift();
			console.log('finished song');
			play(serverQueue.songs[0], msg);
		})
		.on('error', err => console.error(err));

	dispatcher.setVolume(serverQueue.volume);
	messageUtil.sendInfo(msg, 'Started playing next song!');
};

const skip = (msg) => {
	const serverQueue = queue.get(queue);
	if (!msg.member.voice.channel) return messageUtil.sendError(msg, 'You must be in a voice channel to skip audio!');
	serverQueue.connector.dispatcher.end();
};

const clear = (msg) => {
	const serverQueue = queue.get(queue);
	serverQueue.songs = [];
	serverQueue.connector.dispatcher.end();
};

exports.init = init;
exports.play = play;
exports.skip = skip;
exports.clear = clear;
exports.queue = queue;