import React from 'react';

// const ICON_STATES = {
//     select: <i className="fas fa-mouse-pointer" aria-hidden="true"></i>,
//     rect: <i className="fas fa-vector-square" aria-hidden="true"></i>,
//     line: <i class="fas fa-minus" aria-hidden="true"></i>
// }

export default function ToolIcon({toolName}){
    // https://www.robinwieruch.de/conditional-rendering-react#conditional-rendering-in-react-switch-case
    return (
        <span className="panel-icon">
            {
                {
                    select: <i className="fas fa-mouse-pointer" aria-hidden="true"></i>,
                    rect: <i className="fas fa-vector-square" aria-hidden="true"></i>,
                    line: <i className="fas fa-minus" aria-hidden="true"></i>
                }[toolName]
        }
        </span>
    );
}