import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from "./clearButton.module.scss";
import {
    clearCanvas,
    resetClear,
    selectClearCanvas
} from "./clearButtonSlice";

// this component manages the clearing of the canvas

export function ClearButton(){
    const dispatch = useDispatch();
    const shouldClearCanvas = useSelector(selectClearCanvas);

    useEffect(()=>{
        // after state has updated. Reset the clear to false.
        if (shouldClearCanvas){
            dispatch(resetClear());
        }
    })

    const clearAndResetCanvas = () =>{
        // first set the signal for the Canvas to see and reset
        // then, since we don't want to keep clearing, reset the variable
        dispatch(clearCanvas());
    }

    return (
        <div className="panel-block">
            <button className="button is-small" id="clear-button"
                onClick={()=>clearAndResetCanvas()}
                >Clear Canvas
            </button>
        </div>
    )
}