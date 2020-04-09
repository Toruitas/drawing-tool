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

export class Canvas extends React.Component{
    // https://reactjs.org/docs/react-component.html
    constructor(props){
        super(props);
        this.state = {
            width:0, 
            height:0, 
            transX:0,
            transY:0,
            canUseGL2:true
        };
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.updateDimensions = this.updateDimensions.bind(this);
        this.reorientMousePos = this.reorientMousePos.bind(this);
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
        // Fullscreen the canvas
        // Re-set the origin to the center of the screen
        const rectangle = this.canvas.current.parentNode.getBoundingClientRect();
        this.setState({
             width: rectangle.width, 
             height: rectangle.height, 
             transX: rectangle.width * 0.5,
             transY: rectangle.height * 0.5,
             });
      };

    updateCanvas() {
        // first reset h & w
        // https://stackoverflow.com/questions/30229536/how-to-make-a-html5-canvas-fit-dynamic-parent-flex-box-container
        
        this.canvas.current.width = this.state.width;
        this.canvas.current.height = this.state.height;

        // todo LATER: scale when the objects on canvas exceed viewport size 
        // https://www.pluralsight.com/guides/render-window-resize-react

        // const ctx = this.canvas.current.getContext('webgl');
        // ctx.clearRect(0,0, this.canvas.current.width, this.canvas.current.height);
        // draw children “components”
        // rect({ctx, x: 10, y: 10, width: 50, height: 50});
        // rect({ctx, x: 110, y: 110, width: 50, height: 50});
    }

    handleMouseDown(event){
        // Gets coordinates
        // Checks tool from Redux
        // performs action relevant to tool
        // Select: Selects the top-most shape
        // Draw line segment: Start a line or end a line
        // Free draw: Draw segments between points. Segment length determines when a point is dropped. Need to monitor mouseup.
        // https://stackoverflow.com/questions/42309715/how-to-correctly-pass-mouse-coordinates-to-webgl
        console.log(event.type);
        let adjusted_coords = this.reorientMousePos(event.nativeEvent.offsetX,event.nativeEvent.offsetY)
        console.log(adjusted_coords);
    }

    handleMouseUp(event){
        console.log(event.type);
        let x = event.nativeEvent.offsetX;
        let y = event.nativeEvent.offsetY;
        console.log(x,y); 
    }

    handleMouseMove(event){
        let x = event.nativeEvent.offsetX;
        let y = event.nativeEvent.offsetY;
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
                    Your browser doesn't support WebGL2. Please use a modern browser like
                    Firefox or Chrome. Safari really is the new Internet Explorer.
                    </p></div>
                }
            </>
        )
    }
}