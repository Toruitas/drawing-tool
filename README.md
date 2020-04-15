# drawing-tool
Final project for Msc Creative Coding 2. This project uses ReactJS as an interface for a WebGL and WebAssembly-based drawing tool, and Bulma as CSS framework. It's very impressive how fast using WebGL is. 


This just a first step in a tool I'd like to build which can design
1) Layout
2) Components
3) Freeform

## Project journal:

This project originally envisioned relying to a much heavier degree to WebAssembly, either using [Emscripten](https://emscripten.org/) to transpile C/C++ to WebAssembly or Rust's (wasm-pack and wasm-bindgen)[https://rustwasm.github.io/]. I managed to get some very simple C transpiled into WASM with Emscripten, merely add and subtract, as test cases to see how to import them into a React project.

The default packer for a JS project is Webpack, currently on version 4. It does not support importing `.wasm` files. 

Luckily, Webpack 5 does support it. To install it was simple enough, `npm install webpack@beta`. Afterwards, in a single, vanilla JS module, I could use something like `import await { add, subtract } from "./math.js"` and it would work. Great. [Sourcecode](https://github.com/Toruitas/webpack5wasm)

But it was not so easy, since while Webpack 5 does support it, `babel` does not. Babel is a critical dependency for React. Simply using Webpack 5 and the same code as before doesn't work in a React project, like this: [source](https://github.com/Toruitas/react-wasm-exp/blob/master/src/app/features/counter/counterSlice.js). Babel throws errors when it sees `await` in `import await` as it is such new syntax, and Webpack won't import without the `await`. An immovable object meets an unstoppable force.

I decided to fork Babel and convince its parser to allow `await` after `import`. Babel is an insanely complicated package, but I succeeded! The [babel source is here](https://github.com/Toruitas/babel) and [babel-parser here](https://github.com/Toruitas/babel/tree/master/packages/babel-parser). Originally I had intended to submit a pull request and have this included in production Babel, but following this success, Webpack started telling me that I had to convert EVERYTHING to `import await` all the way up to the root `index.js`, which I suspected would break things in how React gets compiled. 

I abandoned using Webpack, despite all the work I had put into forking and adding the new feature to the `babel-parser`. Instead, the current version of the project uses [Parcel](https://parceljs.org/), which *just works.* At this point I also switched from Emscripten and C/C++ to the Rust WASM ecosystem. 

To explore using `wasm-bindgen` and Rust, I followed [this tutorial](https://rustwasm.github.io/docs/book/) and recreated Conway's Game of Life. [RIP John Conway.](https://arstechnica.com/science/2020/04/john-conway-inventor-of-the-game-of-life-has-died-of-covid-19/) Fantastic tutorial. Fun, informative. Even learned about profiling, as I did all the challenges at the bottom of each page, except for the WebGL one. Unfortunately, the very day after I completed it, my computer's HDD crashed, and I never pushed to GitHub! I also lost the rest of this class's labwork. Rust's own GitHub repo without the challenges [lives here](https://github.com/rustwasm/wasm_game_of_life). It's a shame, since some of the challenges were diffcult indeed. 

I also lost one day of work on the project, but that didn't take long to re-create and push to the repo this README belongs to. I used a 10-year old Dell laptop for the 15 days it took to get a replacement drive to get my proper MSI work machine back in action. Major kudos to Microsoft. VSCode is so lightweight that on a 10-year old laptop it still runs smooth as butter.

I've shifted the plan from most WebGL code in WASM to putting it in JS, after discovering that no matter whether I use Rust or C-based WASM, it has no direct interface with WebGL. It must go through JS to interface in both cases. 

The structure of the project is a simple React-Redux project. The Toolbox component on the side is a component which contains Tools. Each tool is a component which connects to the Redux store to let the entire project know which tool is being selected and how many vertices that tool should be used to draw. 

The Canvas component can read the Redux state, and behave appropriately when a user clicks on the canvas.

It was a struggle to comprehend how to draw multiple user-drawn shapes with WebGL. What it came down to is that the ENTIRE WebGL program has to be re-initialized and re-rendered every single time the state updates. This is very very fast, so it's really not a problem at all.

The math behind drawing a line and circle at a given (x,y) was non-obvious. Drawing with triangles! Especially drawing a LINE was far, far more complicated than expected. The WebGL API's lineWidth setting doesn't function cross-platform, so I had to turn line-drawing into a fancy rectangle-drawing tool. Trigonometry, amazing stuff! This was before getting into the pencil tool.

The pencil tool is not as fast as I would like. I attempted 2 approaches. 
1) Take the array of positions, build a new array based on that array, and put this new array which is ~4x the length of the original directly into WebGL to draw all at once. Surprisingly, this was very slow! I thought that it was better to put a lot of coordinates into WebGL all at once. 
2) I take the original array, and draw a chunk of it as a time as I loop through it. This was faster, but not fast enough. Using this approach it's at a usable 30FPS, but React isn't passing through the coordinates quickly enough onMouseMove, as a result of its own rendering process, so with a swiftly moving mouse, vertices can be quite far apart. 

This math will all go into Rust/WASM for faster execution.

I've certainly grown a deeper appreciation for the complexity of drawing tools like Figma and Photoshop. No wonder the web versions of Photoshop and Illustrator are taking so long to come out.

The most ridiculous part of the project so far? I spent an entire day trying to figure out how to copy a string from Redux state into local state, only to realize the bug was elsewhere, and there was never a problem copying the string in the first place.

Please see my package.json to see which packages I used, pretty ordinary React with Redux project packages. The only "feature" package I used was `react-color` for an out-of-the-box color picker, which I could easily connect to the application state. I would like to go back later and roll my own version with more emphasis on palettes. 

Credit for a lot of my WebGL learning goes to the following resources:
* https://github.com/jonathanrydholm/webgl-boilerplate
* https://webglfundamentals.org & https://webgl2fundamentals.org 

And the following for Rust/WASM:
* https://rustwasm.github.io/docs/book/game-of-life/introduction.html 
* https://doc.rust-lang.org/book/ 
* https://github.com/maxbittker/sandspiel 