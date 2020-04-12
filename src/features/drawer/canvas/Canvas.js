import React, {Component} from 'react';
import { connect } from 'react-redux';
import styles from './Canvas.module.scss';
import {} from "./canvasSlice.js";
import { selectSelectedTool, selectMinVertices, selectMaxVertices} from "../tool/toolSlice";
// import init from "./GL1/.init";
// import init from "./GL2F1/gl2f1";
import WglRunner from "./GL4";
// This component will manage:
// Click events
// Communication with WASM
// Communication with WebGL
// The actual canvas is contained here, as well. 
// Uses react component, not hooks, as it's a bit complicated.

// Click events may go to Rust, may go directly to WebGL. 

// Notes on 

class Canvas extends Component{
    // https://reactjs.org/docs/react-component.html
    constructor(props){
        super(props);
        this.state = {
            width:0, 
            height:0, 
            transX:0,
            transY:0,
            canUseGL2:true,
        };
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.updateDimensions = this.updateDimensions.bind(this);
        this.reorientMousePos = this.reorientMousePos.bind(this);
        this.updateCanvasSize = this.updateCanvasSize.bind(this);
        this.checkWebGL2Support = this.checkWebGL2Support.bind(this);
        this.renderCanvas = this.renderCanvas.bind(this);
        this.renderCanvasMonolithic = this.renderCanvasMonolithic.bind(this);
        this.setRectangle = this.setRectangle.bind(this);
        this.randomInt = this.randomInt.bind(this);
        this.canvas = React.createRef();
    }

    componentDidMount(){
        // check for webgl support
        // this.checkWebGL2Support();
        this.updateDimensions();
        // init('gl-canvas');
        window.addEventListener('resize', this.updateDimensions);
        // this.renderCanvasMonolithic();
        this.renderCanvas('gl-canvas');
    }

    componentDidUpdate() {
        this.updateCanvasSize();
        // this.renderCanvasMonolithic();
        this.renderCanvas('gl-canvas');
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
      }

    checkWebGL2Support(){
        if (!this.canvas.current.getContext("webgl")){
            this.setState({canUseGL2:false});
        }
    }

    renderCanvas(id){
        // First, init the WebGL Manager
        // For each {shape, coodinates, context} group in the list of shapes
        // Use an enum or dict to determine which drawing fn to use based on supplied variables. 
        // Something like: {shape: function(dimensions, context),}
        // This inner fn will useProgram 
        let dummyState = [
            {
                tool:"rect",
                pos:[0,0,300,300]
            },
            {
                tool:"rect",
                pos:[100,100,400,400]
            },
            {
                tool:"triangle",
                pos:[0,0, 0,-500, -500, -500]
            }
        ]
        let wglRunner = new WglRunner(id, dummyState);
        wglRunner.renderCanvas();
    }

    renderCanvasMonolithic(){
        let canvas = this.canvas.current;
        let gl = canvas.getContext("webgl2");
        if (!gl) {
            return;
        }

        var vertexShaderSource = `#version 300 es

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

        var fragmentShaderSource = `#version 300 es

        precision mediump float;

        uniform vec4 u_color;

        // we need to declare an output for the fragment shader
        out vec4 outColor;

        void main() {
        outColor = u_color;
        }
        `;

        // Use our boilerplate utils to compile the shaders and link into a program
        // var program = webglUtils.createProgramFromSources(gl,
        //     [vertexShaderSource, fragmentShaderSource]);
        

        // look up where the vertex data needs to go.
        var positionAttributeLocation = gl.getAttribLocation(program, "a_position");

        // look up uniform locations
        // var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
        // var colorLocation = gl.getUniformLocation(program, "u_color");

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

        //   webglUtils.resizeCanvasToDisplaySize(gl.canvas);

        // ################################################
        // Draw loop below.
        // Tell WebGL how to convert from clip space to pixels
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

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

        // draw 50 random rectangles in random colors
        for (var ii = 0; ii < 50; ++ii) {
            // Put a rectangle in the position buffer
            this.setRectangle(
                gl, this.randomInt(300), this.randomInt(300), this.randomInt(300), this.randomInt(300));

            // Set a random color.
            gl.uniform4f(colorLocation, Math.random(), Math.random(), Math.random(), 1);

            // Draw the rectangle.
            var primitiveType = gl.TRIANGLES;
            var offset = 0;
            var count = 6;
            gl.drawArrays(primitiveType, offset, count);
        }
    }

    randomInt(range) {
        let is_positive = Math.random();
        let posneg = 1;
        if (is_positive<0.5){
          posneg = -1;
        }
        return Math.floor(Math.random() * range)*posneg;
      }
      
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
    }
    
    setLine(gl, x1, y1, x2, y2, context){
        // context is likely to just be width
    }

    updateDimensions () {
        // Fullscreen the canvas
        // Re-set the origin to the center of the screen
        this.setState({width:0, height:0})  // for some reason this is needed to get it to shrink
        const rectangle = this.canvas.current.parentNode.getBoundingClientRect();
        this.setState({
             width: rectangle.width, 
             height: rectangle.height, 
             transX: rectangle.width * 0.5,
             transY: rectangle.height * 0.5,
             });
      };

    updateCanvasSize() {
        // first reset h & w
        // https://stackoverflow.com/questions/30229536/how-to-make-a-html5-canvas-fit-dynamic-parent-flex-box-container
        
        this.canvas.current.width = this.state.width;
        this.canvas.current.height = this.state.height;

        // todo LATER: scale when the objects on canvas exceed viewport size 
        // https://www.pluralsight.com/guides/render-window-resize-react

    }

    handleMouseDown(event){
        // Gets coordinates
        // Checks tool from Redux
        // performs action relevant to tool
        // Select: Selects the top-most shape
        // Draw line segment: Start a line or end a line
        // Free draw: Draw segments between points. Segment length determines when a point is dropped. Need to monitor mouseup.
        // https://stackoverflow.com/questions/42309715/how-to-correctly-pass-mouse-coordinates-to-webgl
        let adjusted_coords = this.reorientMousePos(event.nativeEvent.offsetX,event.nativeEvent.offsetY)
        console.log(this.props.tool);
    }

    handleMouseUp(event){
        let adjusted_coords = this.reorientMousePos(event.nativeEvent.offsetX,event.nativeEvent.offsetY)
    }

    handleMouseMove(event){
        let adjusted_coords = this.reorientMousePos(event.nativeEvent.offsetX,event.nativeEvent.offsetY)
    }

    reorientMousePos(x,y){
        // This method takes an (x,y) position in the canvas and converts it relative to the 
        //canvas orgin in the center of the screen
        return {
            x: x - this.state.transX,
            y: (y  - this.state.transY)*-1
        }
    }


    render(){
        return (
            <>
                <canvas id="gl-canvas" ref={this.canvas} width="1354" height="50" 
                    onMouseDown={this.handleMouseDown}
                    onMouseUp={this.handleMouseUp}
                    onMouseMove={this.handleMouseMove}></canvas>
                {this.state.canUseGL2 ? null: <div className="hero-body">
                    <p className="container">
                    Your browser doesn't support WebGL. Please use a modern browser like
                    Firefox or Chrome. Safari really is the new Internet Explorer.
                    </p></div>
                }
            </>
        )
    }
};

const mapStateToProps = state => {
    return {
        tool: selectSelectedTool(state),
        minVertices: selectMinVertices(state),
        maxVertices: selectMaxVertices(state)
    }
};

export default connect(mapStateToProps, null)(Canvas);