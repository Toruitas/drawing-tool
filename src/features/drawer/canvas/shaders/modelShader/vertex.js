import Locations from "./locations";

// varying name must match the one in fragment

export default `
    precision mediump float;
    attribute vec3 ${Locations.POSITION};
    varying vec3 color;
    uniform mat4 transformationMatrix;
    uniform vec2 ${Locations.RESOLUTION};

    void main(void) {
        // get first 2 values of positions
        vec2 a_position = vec2(${Locations.POSITION}.xy);
        
        // convert the position from pixels to -1.0 to 1.0
        vec2 zeroToOne = a_position / u_resolution;

        // convert from 0->1 to 0->2
        // vec2 zeroToTwo = zeroToOne * 2.0;

        // convert from 0->2 to -1->+1 (clipspace)
        // vec2 clipSpace = zeroToTwo - 1.0;

        // gl_Position = vec4(clipSpace, 0, 1);

        color = ${Locations.POSITION};
        gl_Position = transformationMatrix * vec4(zeroToOne* vec2(1, -1), 0.0, 1.0);

        
    }
`;