import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from './Canvas.module.css';
import {} from "./canvasSlice.js";

// This component will manage:
// Click events
// Communication with WASM
// Communication with WebGL
// The actual canvas is contained here, as well. 
// Uses react component, not hooks, as it's a bit complicated.

// Click events may go to Rust, may go directly to WebGL. 

// Notes on 

class Canvas extends React.Component{
    // https://reactjs.org/docs/react-component.html
    constructor(props){
        super(props);
        this.state = {};
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount(){

        
    }

    handleEvent = (event) => {
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

    updateCanvas(){

    }

    render(){
        return (
            <div>
                <canvas id="gl-canvas"></canvas>
            </div>
        )
    }
}