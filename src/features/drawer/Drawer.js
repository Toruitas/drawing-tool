import React from 'react';
import styles from './Drawer.module.css';

import { Toolbox } from "./toolbox/Toolbox";
import { Canvas } from "./canvas/Canvas";

// This component holds the whole drawing tool

export function Drawer(){
    return (
        <div className="columns">
            <div className="column">
                <Toolbox></Toolbox>
            </div>
            <div className="column">
                <Canvas></Canvas>
            </div>
            
        </div>
    )
}