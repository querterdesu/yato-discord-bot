const ytdl = require('ytdl-core');
const messageUtil = require('./messages.ts');
const queue = new Map();
let runTime = 0;

const init = async (args, msg) => {
	runTime++;
	const voiceChannel = msg.member.voice.channel;
	// check if member is in VC
	if (!voiceChannel) return messageUtil.sendError(msg, 'You aren\'t in a voice channel!');
	const connector = await voiceChannel.join()
		.catch(err => console.error(err));
	console.log('q');
	const queueConstructor = {
		connector: connector,
		voiceChannel: voiceChannel,
		songs: [],
		volume: 0.5,
	};
	queue.set('queue', queueConstructor);
	const serverQueue = queue.get('queue');
	console.log('check');
	let song = '';
	if (msg.attachments && args[0] === 'file') {
		song = msg.attachments[0];
	}
	else if (args[0].includes('youtu.be') || args[0].includes('youtube')) {
		song = await ytdl(args[0], { filter: 'audioonly' });
	}
	else {
		song = args[0];
	}
	serverQueue.songs += (song);
	console.log(song);
	if (runTime === 1) { play(song, msg); }
	else { console.log('already found'); }
};

const play = async (song, msg) => {
	const serverQueue = queue.get('queue');
	console.log('join');
	if (!song) {
		serverQueue.voiceChannel.leave();
		queue.delete('queue');
		runTime = 0;
		return;
	}
	console.log('start song');
	const dispatcher = serverQueue.connector
		.play(song)
		.on('finish', () => {
			play(serverQueue.songs[1], msg);
			serverQueue.songs.shift();
			console.log('finished song');
		})
		.on('error', err => console.error(err));

	dispatcher.setVolume(serverQueue.volume);
	messageUtil.sendInfo(msg, 'Started playing next song!');
};

const skip = (msg) => {
	const serverQueue = queue.get('queue');
	if (!msg.member.voice.channel) return messageUtil.sendError(msg, 'You must be in a voice channel to skip audio!');
	serverQueue.connector.dispatcher.destroy();
};

const clear = (msg) => {
	if (!msg.member.voice.channel) return messageUtil.sendError(msg, 'You must be in a voice channel to stop audio!');
	const serverQueue = queue.get('queue');
	serverQueue.connector.dispatcher.destroy();
	serverQueue.voiceChannel.leave();
	queue.delete('queue');
	runTime = 0;
};

exports.init = init;
exports.play = play;
exports.skip = skip;
exports.clear = clear;
exports.queue = queue;