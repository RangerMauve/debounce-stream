# debounce-stream

This stream takes in events of data and only passes the event on once in a given interval.
Once the interval is over, it outputs the last value that was passed in

## Installing

``` bash
npm install --save debounce-stream
```

## API

### `DebounceStream(interval,[options])`

#### Arguments
* `interval` (Number): Interval for how frequently to output data
* `[options]` (Object): Options that get passed to a stream constructor (In case you want `objectMode`)

#### Returns
(DuplexStream): Pipe stuff into it, and it'll come out debounced

## Example

``` javascript
var DebounceStream = require("../");
var IntervalStream = require("interval-stream");
var StreamArray = require("stream-array");
var stdout = require("stdout")();

// Data to output
var data = ["foo\n", "bar\n", "bazz\n", "fizz\n"];

// Duplicate it twice so we have more data to send
data = data.concat(data).concat(data);

StreamArray(data) // Should take all the data in the array,
  .pipe(IntervalStream(1000)) // Send out one item every second,
  .pipe(DebounceStream(2000)) // Ignore about every other chunk
  .pipe(stdout); // Output to the console
```
