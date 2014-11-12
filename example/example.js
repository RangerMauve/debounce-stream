var DebounceStream = require("../"); // Used for debouncing
var IntervalStream = require("interval-stream"); // Used for sending data out with a delay
var StreamArray = require("stream-array"); // Convert an array into a stream of data
var stdout = require("stdout")(); // Output streamed data to console

// Data to output
var data = ["foo\n", "bar\n", "bazz\n", "fizz\n"];

// Duplicate it twice so we have more data to send
data = data.concat(data).concat(data);

StreamArray(data) // Should take all the data in the array,
	.pipe(IntervalStream(1000)) // Send out one item every second,
	.pipe(DebounceStream(2000)) // Ignore about every other chunk
	.pipe(stdout); // Output to the console
