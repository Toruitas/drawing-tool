import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from './Toolbox.module.scss';
import {
    // someImportedFn
} from './toolboxSlice';
import {Tool} from "../tool/Tool";

// The Toolbox component is mostly stylistic. It holds all the tool components with their 
// icons
// Should be ok to use a hook

export function Toolbox(){
    // const someThing = useSelector(someImportedFn);
    const dispatch = useDispatch();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <nav id="toolbox" className="panel">
            <p className="panel-heading">Pick a tool</p>
            <Tool></Tool>
        </nav>
    )
}