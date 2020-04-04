export default `
    precision mediump float;
    varying vec3 color;  // this has to be called the exact same thing as in the vertex shader.

    void main(void){
        gl_FragColor = vec4(color, 1.0);
    }
`