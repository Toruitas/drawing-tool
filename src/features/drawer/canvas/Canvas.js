import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from './Canvas.module.scss';
import {} from "./canvasSlice.js";

// This component will manage:
// Click events
// Communication with WASM
// Communication with WebGL
// The actual canvas is contained here, as well. 
// Uses react component, not hooks, as it's a bit complicated.

// Click events may go to Rust, may go directly to WebGL. 

// Notes on 

// test shape
function rect(props){
    const {ctx, x, y, width, height} = props;
    ctx.fillRect(x, y, width, height);
}

export class Canvas extends React.Component{
    // https://reactjs.org/docs/react-component.html
    constructor(props){
        super(props);
        this.state = {width:0, height:0};
        this.handleClick = this.handleClick.bind(this);
        this.updateDimensions = this.updateDimensions.bind(this);
        this.updateCanvas = this.updateCanvas.bind(this);
        this.canvas = React.createRef();
    }

    componentDidMount(){
        this.updateDimensions();
        this.updateCanvas();
        window.addEventListener('resize', this.updateDimensions);
    }

    componentDidUpdate() {
        this.updateCanvas();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
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
        // todo: https://stackoverflow.com/questions/19014250/rerender-view-on-browser-resize-with-react

        const ctx = this.canvas.current.getContext('2d');
        ctx.clearRect(0,0, this.canvas.current.width, this.canvas.current.height);
        // draw children “components”
        rect({ctx, x: 10, y: 10, width: 50, height: 50});
        rect({ctx, x: 110, y: 110, width: 50, height: 50});
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

    render(){
        return (
            <canvas id="gl-canvas" ref={this.canvas}></canvas>
        )
    }
}