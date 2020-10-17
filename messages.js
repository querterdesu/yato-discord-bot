module.exports = {
	sendSuccess(ref, message) {
		ref.channel.send(`✅ | ${message}`);
	},
	sendError(ref, message) {
		ref.channel.send(`❌ | ${message}`);
	},
	sendInfo(ref, message) {
		ref.channel.send(`❕ | ${message}`);
	},
};
