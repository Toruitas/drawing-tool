// The Rust file is used to convert pixel positions to what needs to be rendered in WASM.
// Perhaps also determines if the location that is clicked is within the clickable area?

// IMPORTANT: Sometimes the WebGL work will be done here in Rust. Other times in JS, 
// Depending upon whether or not the task at hand requires more power.

// Hot damn, rounded lines are just a bunch of short straight segments. Segment size.
// Refer to https://github.com/lykhouzov/rust-wasm-webgl/tree/master/src
// https://github.com/lloydmeta/gol-rs