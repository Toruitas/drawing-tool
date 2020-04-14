import {webglUtils} from "./webgl-utils";

export default class WglRunner{
    constructor(gl, stateToRender={}){
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

            // convert the position from pixels to 0.0 to 2.0
            vec2 zeroToOne = a_position / u_resolution;

            // convert from 0->1 to 0->2
            vec2 zeroToTwo = zeroToOne * 2.0;

            gl_Position = vec4(zeroToTwo, 0, 1);
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
        webglUtils.resizeCanvasToDisplaySize(gl.canvas);

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

        if (this.stateToRender.length > 0){
            this.stateToRender.forEach(drawnObj => {
                if (drawnObj.tool==="rect"){
                    this.setRectangle(gl, colorLocation, drawnObj.pos[0], drawnObj.pos[1], drawnObj.pos[2], drawnObj.pos[3]);
                }else if (drawnObj.tool==="triangle"){
                    this.setTriangle(gl, colorLocation, drawnObj.pos[0], drawnObj[2], drawnObj[3]);
                }else if (drawnObj.tool==="line"){
                    this.setLine(gl, colorLocation, drawnObj.pos[0], drawnObj.pos[1]);
                }else if (drawnObj.tool==="ellipse"){
                    this.setEllipse(gl, colorLocation, drawnObj.pos[0], drawnObj.pos[1], drawnObj.pos[2], drawnObj.pos[3]);
                }
            })
        }
        
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
    setRectangle(gl, colorLocation, x1, y1, x2, y2, context={}) {
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            x1, y1,
            x2, y1,
            x1, y2,
            x1, y2,
            x2, y1,
            x2, y2,
        ]), gl.STATIC_DRAW);

        // Set a random color.
        // gl.uniform4f(colorLocation, Math.random(), Math.random(), Math.random(), 1);
        // Set a color based on major minor radii.
        let colorRadius = Math.max(((x2+x1)/2)/gl.canvas.width, ((y2+y1)/2)/gl.canvas.height);
        gl.uniform4f(colorLocation, colorRadius, colorRadius, colorRadius, colorRadius);
            
        // Draw the rectangle.
        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = 6;
        gl.drawArrays(primitiveType, offset, count);
    };

    setTriangle(gl, colorLocation, x1, y1, x2, y2, x3, y3, context={}){
        // Triangle must first draw a line from x1,y1 to x2,y2 before can draw a full triangle.
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            x1, y1,
            x2, y2,
            x3, y3
        ]), gl.STATIC_DRAW);

        // Set a random color.
        // gl.uniform4f(colorLocation, Math.random(), Math.random(), Math.random(), 1);
        // Set a color based on major minor radii.
        let colorRadius = Math.max(x1/gl.canvas.width, y1/gl.canvas.height);
        gl.uniform4f(colorLocation, colorRadius, colorRadius, colorRadius, colorRadius);
            
        // Draw the rectangle.
        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = 3;
        gl.drawArrays(primitiveType, offset, count);
    };

    setLine(gl, colorLocation, x1, y1, x2, y2, context={}){
        // https://community.khronos.org/t/simple-tutorial-needed-how-to-draw-a-line/2664/4
        // https://www.tutorialspoint.com/webgl/webgl_modes_of_drawing.htm

    };

    setFreeDraw(gl, colorLocation, vertices, context={}){
        // endless vertices connected. 

    };

    setEllipse(gl, colorLocation, x1, y1, x2, y2, context={}){
        // https://www.youtube.com/watch?v=S0QZJgNTtEw
        // https://www.gamedev.net/forums/topic/69729-draw-ellipse-in-opengl/
        // https://community.khronos.org/t/how-to-draw-an-oval/13428/
        // Array construction is a good candidate for replacement by WASM
        let degreeToRadian = Math.PI/180.0;
        let originX = (x2+x1)/2;
        let originY = (y2+y1)/2;
        let radiusX = Math.abs((x2-x1)/2);
        let radiusY = Math.abs((y2-y1)/2);
        let vertices = []
        for(let i=0; i<=360; i++){
            let radian = i * degreeToRadian;
            let vertex1 = [
                Math.cos(radian) * radiusX + originX, Math.sin(radian) * radiusY + originY
            ];
            let vertex2 = [
                originX, originY
            ]
            vertices.push(...vertex1);
            vertices.push(...vertex2);
        }

        // Add vertices into the buffer
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        // Set a random color.
        // gl.uniform4f(colorLocation, Math.random(), Math.random(), Math.random(), 1);
        // Set a color based on major minor radii.
        let colorRadius = Math.max(radiusX/gl.canvas.width, radiusY/gl.canvas.height);
        gl.uniform4f(colorLocation, colorRadius, colorRadius, colorRadius, colorRadius);
            
        // Draw the rectangle.
        var primitiveType = gl.TRIANGLE_STRIP;
        var offset = 0;
        var count = vertices.length / 2;
        gl.drawArrays(primitiveType, offset, count);
        // Gotta translate the circle to the position it was drawn in.


    }
}
