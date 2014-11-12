var Transform = require("stream").Transform;

module.exports = DebounceStream;

/**
 * Creates a stream that only outputs data once in a given interval
 * @param {Number} interval The interval in milliseconds between data output
 * @param {Object} options  Optional options to pass to the stream constructor
 */
function DebounceStream(interval, options) {
	if (!interval || !(interval > 0)) // Ensure interval is a number that is > 0
		throw new Error("Must specify an interval greater than 0 milliseconds")
	options = options || {}; // Specify empty object for options by default

	// Construct the transform stream
	var stream = new Transform(options);

	// Track the reference retruned by setTimeout
	var timeout = null;

	// Whether the state is paused or not
	var paused = false;

	// The last value sent down the stream
	var last_value = null;

	// Whether there was new data since the last time something was emitted
	var has_value = false;

	// Define the transform function
	stream._transform = function (data, encoding, callback) {
		// Save the new chunk of data as the last value
		last_value = data;

		// Flag that there is a value to output
		has_value = true;
		// If paused just ignore outputting it for now
		if (paused) callback();
		else {
			// If we aren't paused, say that there is no value
			has_value = false;
			// Pause
			pause();
			// Pass the data down the stream
			callback(null, last_value);
		}
	}

	// When the stream ends, clear any pause timeout and pass the last value
	stream._flush = function (callback) {
		clearTimeout(timeout);
		if (has_value) this.push(last_value);
		callback();
	}

	// Function for pausing output
	function pause() {
		// Set a flag
		paused = true;
		// Clear any previous timeout, just in case
		clearTimeout(timeout);
		// Set a new timeout to unpause after the given interval
		timeout = setTimeout(unpause, interval);
	}

	// Function for unpausing and outputting the last value if it exists
	function unpause() {
		// Unpause
		paused = false;
		// If a new value has come in since we've paused
		if (has_value) {
			// Push that value down the stream
			has_value = false;
			stream.push(last_value);
			// Pause again
			pause();
		}
	}

	return stream
}
