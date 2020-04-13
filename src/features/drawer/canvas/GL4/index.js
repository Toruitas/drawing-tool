import {webglUtils} from "./webgl-utils";

export default class WglRunner{
    constructor(gl, stateToRender){
        this.gl = gl;
        this.stateToRender = stateToRender;
        this.vertexShaderSource = `#version 300 es

        // an attribute is an input (in) to a vertex shader.
        // It will receive data from a buffer
        in vec2 a_position;

        // Used to pass in the resolution of the canvas
        uniform vec2 u_resolution;

        // all shaders have a main function
        void main() {

            // convert the position from pixels to 0.0 to 1.0
            vec2 zeroToOne = a_position / u_resolution;

            gl_Position = vec4(zeroToOne, 0, 1);
        }
        `;

        this.fragmentShaderSource = `#version 300 es

        precision mediump float;

        uniform vec4 u_color;

        // we need to declare an output for the fragment shader
        out vec4 outColor;

        void main() {
            outColor = u_color;
        }
        `;
    }

    renderCanvas(){
        // let canvas = document.querySelector(`#${this.id}`);
        let gl = this.gl;
        // if (!gl) {
        //     return;
        // }
        // currently we only have 1 program
        let program = webglUtils.createProgramFromSources(gl,
            [this.vertexShaderSource, this.fragmentShaderSource]);
        var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
        // look up uniform locations
        var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
        var colorLocation = gl.getUniformLocation(program, "u_color");

        // Create a buffer
        var positionBuffer = gl.createBuffer();
        
        // Create a vertex array object (attribute state)
        var vao = gl.createVertexArray();

        // and make it the one we're currently working with
        gl.bindVertexArray(vao);

        // Turn on the attribute
        gl.enableVertexAttribArray(positionAttributeLocation);

        // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
        var size = 2;          // 2 components per iteration for 2-d xy
        var type = gl.FLOAT;   // the data is 32bit floats
        var normalize = false; // don't normalize the data
        var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        var offset = 0;        // start at the beginning of the buffer
        gl.vertexAttribPointer(
            positionAttributeLocation, size, type, normalize, stride, offset);
        
        // ################################################
        // Draw loop below.
        // Tell WebGL how to convert from clip space to pixels
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        //   webglUtils.resizeCanvasToDisplaySize(gl.canvas);

        // Clear the canvas
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Tell it to use our program (pair of shaders)
        gl.useProgram(program);

        // Bind the attribute/buffer set we want.
        gl.bindVertexArray(vao);

        // Pass in the canvas resolution so we can convert from
        // pixels to clipspace in the shader
        gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

        this.stateToRender.forEach(drawnObj => {
            if (drawnObj.tool==="rect"){
                this.setRectangle(
                    gl, drawnObj.pos[0], drawnObj.pos[1], drawnObj.pos[2], drawnObj.pos[3]);
        
                // Set a random color.
                gl.uniform4f(colorLocation, Math.random(), Math.random(), Math.random(), 1);
        
                // Draw the rectangle.
                var primitiveType = gl.TRIANGLES;
                var offset = 0;
                var count = 6;
                gl.drawArrays(primitiveType, offset, count);
            }else if (drawnObj.tool==="triangle"){
                this.setTriangle(
                    gl, ...drawnObj.pos);
        
                // Set a random color.
                gl.uniform4f(colorLocation, Math.random(), Math.random(), Math.random(), 1);
        
                // Draw the rectangle.
                var primitiveType = gl.TRIANGLES;
                var offset = 0;
                var count = 3;
                gl.drawArrays(primitiveType, offset, count);
            }
        })
    }

    randomInt(range) {
        let is_positive = Math.random();
        let posneg = 1;
        if (is_positive<0.5){
            posneg = -1;
        }
        return Math.floor(Math.random() * range)*posneg;
    };

    // Fill the buffer with the values that define a rectangle.
    setRectangle(gl, x1, y1, x2, y2) {
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            x1, y1,
            x2, y1,
            x1, y2,
            x1, y2,
            x2, y1,
            x2, y2,
        ]), gl.STATIC_DRAW);
    };

    setTriangle(gl, x1, y1, x2, y2, x3, y3){
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            x1, y1,
            x2, y2,
            x3, y3
        ]), gl.STATIC_DRAW);
    };

    setLine(gl, x1, y1, x2, y2,context){

    };
}
