import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from './Tool.module.scss';
import {
    // someImportedFn
} from './toolSlice';

// this component manages a single tool and its design within the toolbox
// It also sets some state that will be used by the canvas during reading

export function Tool(){
    // https://stackoverflow.com/questions/53960035/any-way-to-render-icon-based-on-text-field-name-using-material-ui
    // https://stackoverflow.com/questions/57827085/how-do-i-dynamically-display-an-icon-for-each-category-with-react
    // const someThing = useSelector(someImportedFn);
    const dispatch = useDispatch();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="panel-block is-active">
            <span className="panel-icon">
            <i className="fas fa-mouse-pointer" aria-hidden="true"></i>
            </span>
            Select
        </div>
    )
}