var DebounceStream = require("../");
var IntervalStream = require("interval-stream");
var StreamArray = require("stream-array");
var stdout = require("stdout")();

// Data to output
var data = ["foo\n", "bar\n", "bazz\n", "fizz\n"];

// Duplicate it twice so we have more data to send
data = data.concat(data).concat(data);

// Should take all the data int he array,
// Send out one every second,
// Ignore about every other chunk
StreamArray(data)
	.pipe(IntervalStream(1000))
	.pipe(DebounceStream(2000))
	.pipe(stdout);
