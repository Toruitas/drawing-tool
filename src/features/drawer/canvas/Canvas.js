import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from './Canvas.module.scss';
import {} from "./canvasSlice.js";
import init from "./init";

// This component will manage:
// Click events
// Communication with WASM
// Communication with WebGL
// The actual canvas is contained here, as well. 
// Uses react component, not hooks, as it's a bit complicated.

// Click events may go to Rust, may go directly to WebGL. 

// Notes on 

// test canvas rectangle shape
function rect(props){
    const {ctx, x, y, width, height} = props;
    ctx.fillRect(x, y, width, height);
}



export class Canvas extends React.Component{
    // https://reactjs.org/docs/react-component.html
    constructor(props){
        super(props);
        this.state = {width:0, height:0, canUseGL2:true};
        this.handleClick = this.handleClick.bind(this);
        this.updateDimensions = this.updateDimensions.bind(this);
        this.updateCanvas = this.updateCanvas.bind(this);
        this.checkWebGL2Support = this.checkWebGL2Support.bind(this);
        this.canvas = React.createRef();
    }

    componentDidMount(){
        // check for webgl support
        
        // this.checkWebGL2Support();
        this.updateDimensions();
        // this.updateCanvas();
        init('gl-canvas');

        window.addEventListener('resize', this.updateDimensions);
    }

    componentDidUpdate() {
        this.updateCanvas();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
      }

    checkWebGL2Support(){
        if (!this.canvas.current.getContext("webgl")){
            this.setState({canUseGL2:false});
        }
    }

    updateDimensions () {
        const rectangle = this.canvas.current.parentNode.getBoundingClientRect();
        this.setState({ width: rectangle.width, height:rectangle.height });
      };

    updateCanvas() {
        // first reset h & w
        // https://stackoverflow.com/questions/30229536/how-to-make-a-html5-canvas-fit-dynamic-parent-flex-box-container
        
        this.canvas.current.width = this.state.width;
        this.canvas.current.height = this.state.height;

        // todo LATER: scale when the objects on canvas exceed viewport size 
        // https://www.pluralsight.com/guides/render-window-resize-react

        const ctx = this.canvas.current.getContext('webgl');
        // ctx.clearRect(0,0, this.canvas.current.width, this.canvas.current.height);
        // draw children “components”
        // rect({ctx, x: 10, y: 10, width: 50, height: 50});
        // rect({ctx, x: 110, y: 110, width: 50, height: 50});
    }

    handleEvent(event){
        // https://reactjs.org/docs/events.html
        if (event.type === "mousedown") {
                this.setState({ message: "Mouse Down"});
                // https://stackoverflow.com/questions/42309715/how-to-correctly-pass-mouse-coordinates-to-webgl
                var x = event.offsetX;
                var y = event.offsetY;
           } 
        if (event.type === "mouseup") {
                this.setState({ message: "Mouse Up"});
           }
       }

    handleClick(x,y){
        // Gets coordinates
        // Checks tool from Redux
        // performs action relevant to tool
        // Select: Selects the top-most shape
        // Draw line segment: Start a line or end a line
        // Free draw: Draw segments between points. Segment length determines when a point is dropped. Need to monitor mouseup.
    }

    writeVertexShaderSource(){
        // assembles vertex shader

        // todo: re-add to top: 
        let vertexShaderSourceGL2 = `#version 300 es
        
 
        // an attribute is an input (in) to a vertex shader.
        // It will receive data from a buffer
        in vec4 a_position;
        
        // all shaders have a main function
        void main() {
        
        // gl_Position is a special variable a vertex shader
        // is responsible for setting
        gl_Position = a_position;
        }
        `;

        let vertexShaderSourceGL1 = `
        // an attribute will receive data from a buffer
        attribute vec2 a_position;
        uniform vec2 u_resolution;
       
        // all shaders have a main function
        void main() {

            // convert the position from pixels to 0.0 to 1.0
            vec2 zeroToOne = a_position / u_resolution;
            
            // convert from 0->1 to 0->2
            vec2 zeroToTwo = zeroToOne * 2.0;
            
            // convert from 0->2 to -1->+1 (clip space)
            vec2 clipSpace = zeroToTwo - 1.0;
       
            // gl_Position is a special variable a vertex shader
            // is responsible for setting
            gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
        }
        `

        return vertexShaderSourceGL1;
    }

    writeFragmentShaderSource(){
        // this fn assembles the frag shader

        // todo: re-add to top: 
        let fragmentShaderSourceGL2 = `#version 300 es
 
        // fragment shaders don't have a default precision so we need
        // to pick one. mediump is a good default. It means "medium precision"
        precision mediump float;
        
        // we need to declare an output for the fragment shader
        out vec4 outColor;
        
        void main() {
        // Just set the output to a constant reddish-purple
        outColor = vec4(1, 0, 0.5, 1);
        }
        `;

        let fragmentShaderSourceGL1 = `
        // fragment shaders don't have a default precision so we need
        // to pick one. mediump is a good default
        precision mediump float;
       
        void main() {
          // gl_FragColor is a special variable a fragment shader
          // is responsible for setting
          gl_FragColor = vec4(1, 0, 0.5, 1); // return reddish-purple
        }
        `

        return fragmentShaderSourceGL1;
    }

    createShader(gl, type, source){
        let shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (success ){
            return shader;
        }

        console.log(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
    }

    createGLProgram(gl, vertexShader, fragmentShader){
        let program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        let success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (success){
            return program;
        }

        console.log(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
    }

    initializeGL(gl){
        let vertexShaderSource = writeVertexShaderSource();
        let fragmentShaderSource = writeFragmentShaderSource();
        let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
        let program = createProgram(gl, vertexShader, fragmentShader);

        // look up memory location for this attr.
        // Should do before render loop.
        let positionAttributeLocation = gl.getAttribLocation(program, "a_position");
        // get location for resolution, too
        let resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
        // create a buffer
        let positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        // put data into the buffer 
        // three 2d points
        let positions = [
            10, 20,
            80, 20,
            10, 30,
            10, 30,
            80, 20,
            80, 30,
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
        // initialization complete

        // this is for rendering
        let vao = gl.createVertexArray();
        gl.bindVertexArray(vao);
        gl.enableVertexAttribArray(positionAttributeLocation);
        let size = 2;          // 2 components per iteration
        let type = gl.FLOAT;   // the data is 32bit floats
        let normalize = false; // don't normalize the data
        let stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        let offset = 0;        // start at the beginning of the buffer
        gl.vertexAttribPointer(
            positionAttributeLocation, size, type, normalize, stride, offset)
        // Tell WebGL how to convert from clip space to pixels
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        // Clear the canvas
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        // Tell it to use our program (pair of shaders)
        gl.useProgram(program);
        // Pass in the canvas resolution so we can convert from
        // pixels to clip space in the shader
        gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
        // Bind the attribute/buffer set we want.
        gl.bindVertexArray(vao);
        // Execute GLSL program
        let primitiveType = gl.TRIANGLES;
        let count = 6;
        gl.drawArrays(primitiveType, offset, count);
    }

    renderGL(gl){
        
    }


    render(){
        return (
            <>
                <canvas id="gl-canvas" ref={this.canvas}></canvas>
                {this.state.canUseGL2 ? null: <div className="hero-body">
                    <p className="container">
                    Your browser doesn't support WebGL2. Please use a modern browser like
                    Firefox or Chrome. Safari really is the new Internet Explorer.
                    </p></div>
                }
            </>
        )
    }
}