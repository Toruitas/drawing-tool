import Locations from "./locations";

// varying name must match the one in fragment

export default `
    precision mediump float;
    attribute vec3 ${Locations.POSITION};
    varying vec3 color;
    void main(void) {
        color = ${Locations.POSITION};
        gl_Position = vec4(${Locations.POSITION}, 1.0);
    }
`;