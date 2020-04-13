import React, {Component} from 'react';
import { connect } from 'react-redux';
import styles from './Canvas.module.scss';
import {} from "./canvasSlice.js";
import { selectSelectedTool, selectVertices} from "../tool/toolSlice";
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
            stateToRender:[],  // list of objects
            selecting:false,
            currentlyDrawing:false,
            currentlyDrawingShape:{}, // obj w/ {tool:currentTool, pos: [x,y,x1,y1,...] coordinates}
        };
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.updateDimensions = this.updateDimensions.bind(this);
        this.reorientMousePos = this.reorientMousePos.bind(this);
        this.updateCanvasSize = this.updateCanvasSize.bind(this);
        this.renderCanvas = this.renderCanvas.bind(this);
        this.canvas = React.createRef();
    }

    componentDidMount(){
        this.updateDimensions();
        window.addEventListener('resize', this.updateDimensions);

        this.renderCanvas(this.canvas.current);
    }

    componentDidUpdate() {
        this.updateCanvasSize();

        this.renderCanvas(this.canvas.current);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
      }

    renderCanvas(canvas){
        // First, init the WebGL Manager
        // For each {shape, coodinates, context} group in the list of shapes
        // Use an enum or dict to determine which drawing fn to use based on supplied variables. 
        // Something like: {shape: function(dimensions, context),}
        // This inner fn will useProgram 
        let gl = this.canvas.current.getContext("webgl2")
        if(!gl){
            this.setState({canUseGL2:false});
        }else{
            // WebGL2 is available. Draw stuff!
            // get full list of saved shapes
            let stateToRender = this.state.stateToRender.slice();
            // if we're currently drawing something, we want the temporary shape as it's dragged around
            if (this.state.currentlyDrawing && this.state.currentlyDrawingShape != {}){
                stateToRender.push({
                    tool:this.props.tool,
                    pos: this.state.currentlyDrawingShape.tempPos
                });
            }
            // send list and GL to the WGL runner
            // console.log(stateToRender);
            let wglRunner = new WglRunner(gl, stateToRender);
            wglRunner.renderCanvas();
        }
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

    handleEscape(event){
        // when esc is hit, reset selecting, currentlyDrawing, currentlyDrawingShape, tempPos
    }

    handleMouseDown(event){
        
    }

    handleMouseUp(event){
        // add current shape to stateToRender
        // reset currentlyDrawing to an empty obj
        // Move tempPos to savedPos. Add to 
        let adjusted_coords = this.reorientMousePos(event.nativeEvent.offsetX,event.nativeEvent.offsetY);
        if (this.props.tool === "select"){
            // Select what is being clicked.
            console.log("Replace this with a test for withinShape()")
        } else if (
            !this.state.currentlyDrawing &&
            ( 
                this.props.tool === "rect" || 
                this.props.tool === "line" 
            )
            ){
            // start drawing by setting the first anchor/vertex.
            this.setState({
                currentlyDrawing:true,
                currentlyDrawingShape:{
                    tool: this.props.tool,
                    tempPos:[
                        adjusted_coords.x,
                        adjusted_coords.y
                    ],
                    pos:[
                        adjusted_coords.x,
                        adjusted_coords.y
                    ]
                }
            });
        }else if (this.state.currentlyDrawing) {
            // Adding this coordinate to the saved list
            let savedPos = this.state.currentlyDrawingShape.pos.slice(0);
            savedPos.push(adjusted_coords.x, adjusted_coords.y);
            // if current length == max vertices, end the draw as the shape is complete
            // so we add the shape we just drew to the list of saved shapes
            // and clear the shape we're currently drawing.
            // 2 vertices * 2 xy coords
            if (savedPos.length>=this.props.selectVertices*2){
                let newShapesToDrawList = this.state.stateToRender.slice(0);
                newShapesToDrawList.push({
                    tool:this.props.tool,
                    pos: savedPos
                })
                this.setState({
                    stateToRender:newShapesToDrawList,
                    currentlyDrawing:false,
                    currentlyDrawingShape:{}
                });
            }else{
                // Otherwise, update the saved list of x,y coords with this one, and clear the temp positions.
                this.setState({
                    currentlyDrawingShape:{
                        tool: this.props.tool,
                        tempPos:[],
                        pos:savedPos
                    }
                });
            }
            
        }
    }

    handleMouseMove(event){
        // this handles rendering the "temporary" shape as the mouse is moved around
        // May need to adjust as setState can be async https://reactjs.org/docs/state-and-lifecycle.html#state-updates-may-be-asynchronous
        let adjusted_coords = this.reorientMousePos(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
        // This is agnostic to whichever drawing tool is selected.
        if (this.state.currentlyDrawing){
            // get the saved coordinates
            let tempPos = this.state.currentlyDrawingShape.pos.slice(0);
            // add the temporary coordinates
            tempPos.push(adjusted_coords.x, adjusted_coords.y);
            // update the state
            this.setState({
                currentlyDrawingShape:{
                    tool: this.props.tool,
                    tempPos: tempPos,
                    pos: this.state.currentlyDrawingShape.pos.slice(0)
                }
            })
        }
    }

    reorientMousePos(x,y){
        // This method takes an (x,y) position in the canvas and converts it relative to the 
        // canvas orgin in the center of the screen
        // currently WRONG!
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
                    onMouseMove={this.handleMouseMove}>
                        
                    </canvas>
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
        selectVertices: selectVertices(state),
    }
};

export default connect(mapStateToProps, null)(Canvas);