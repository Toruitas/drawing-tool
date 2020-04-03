import React from 'react';
import logo from './zlim.png';

export function Navbar(){
    return (
        <nav className="navbar is-fixed-top is-transparent">
        <div className="navbar-brand">
            <a className="navbar-item" href="/">
                <img src={logo} alt="Zlim: 3-way design tool" width="112" height="28" />
                
            </a>
            <div className="navbar-burger burger" data-target="navbarExampleTransparentExample">
            <span></span>
            <span></span>
            <span></span>
            </div>
        </div>

        <div className="navbar-menu">
            <div className="navbar-start">
                <a className="navbar-item" href="/">
                    Draw stuff
                </a>
                <a className="navbar-item" href="https://github.com/Toruitas/drawing-tool">
                    GitHub
                </a>
            </div>
        </div>
    </nav>
    )
}