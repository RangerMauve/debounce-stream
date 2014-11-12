var Transform = require("stream").Transform;

module.exports = DebounceStream;

function DebounceStream(interval, options) {
	if (!interval || interval <= 0)
		throw new Error("Must specify an interval greater than 0 milliseconds")
	options = options || {};

	var stream = new Transform(options);
	var timeout = null;
	var paused = false;
	var last_value = null;
	var has_value = false;

	stream._transform = function (data, encoding, callback) {
		last_value = data;
		has_value = true;
		if (paused) callback();
		else {
			has_value = false;
			pause();
			callback(null, last_value);
		}
	}

	stream._flush = function (callback) {
		clearTimeout(timeout);
		if (has_value) this.push(last_value);
		callback();
	}

	function pause() {
		paused = true;
		clearTimeout(timeout);
		timeout = setTimeout(unpause, interval);
	}

	function unpause() {
		paused = false;
		if (has_value) {
			has_value = false;
			stream.push(last_value);
			pause();
		}
	}

	return stream
}
