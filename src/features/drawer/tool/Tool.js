import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from './Tool.module.scss';
import ToolIcon from "./toolIcon/ToolIcon";
import {
    selectATool,
    selectSelectedTool
} from './toolSlice';

// this component manages a single tool and its design within the toolbox
// It also sets some state that will be used by the canvas during reading

export function Tool({toolName}){
    // https://stackoverflow.com/questions/53960035/any-way-to-render-icon-based-on-text-field-name-using-material-ui
    // https://stackoverflow.com/questions/57827085/how-do-i-dynamically-display-an-icon-for-each-category-with-react
    const currentlySelectedTool = useSelector(selectSelectedTool);
    const dispatch = useDispatch();
    const isActive = currentlySelectedTool === toolName ? 'is-active' : '';
    const classes = "panel-block " + isActive;    

    return (
        <div className={classes} onClick={() => dispatch(selectATool(toolName))}>
            <ToolIcon toolName={toolName}></ToolIcon>
            {toolName}
        </div>
    )
}