module.exports = {
	sendSuccess(ref, message) {
		return ref.channel.send(`✅ | ${message}`);
	},
	sendError(ref, message) {
		return ref.channel.send(`❌ | ${message}`);
	},
	sendInfo(ref, message) {
		return ref.channel.send(`❕ | ${message}`);
	},
};
