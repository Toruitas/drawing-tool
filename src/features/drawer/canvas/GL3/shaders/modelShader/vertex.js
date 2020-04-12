import Locations from "./locations";

// varying name must match the one in fragment

export default `
    precision mediump float;
    attribute vec2 ${Locations.POSITION};
    varying vec3 color;
    uniform mat4 transformationMatrix;
    uniform vec2 ${Locations.RESOLUTION};

    void main(void) {
        // get first 2 values of positions
        vec2 a_position = vec2(${Locations.POSITION}.xy);
        
        // convert the position from pixels to -1.0 to 1.0
        vec2 zeroToOne = a_position / u_resolution;

        color = ${Locations.POSITION};
        // gl_Position = transformationMatrix * vec4(zeroToOne, 0.0, 1.0);
        gl_Position = vec4(zeroToOne, 0.0, 1.0);

        
    }
`;