import GLM from "../../GLManager";
import VertexSource from "./vertex";
import FragmentSource from "./fragment";
import Locations from "./locations";

export default class ModelShader {
    constructor(){
        GLM.setAttributePrefix("a_")
        const programInfo = GLM.createProgramInfo(VertexSource,FragmentSource);

        this.positionAttribute = GLM.getAttribLocation(program, Locations.POSITION);
        // this.transformationMatrix = GLM.getUniformLocation(program, 'transformationMatrix');
        this.resolutionUniform = GLM.getResolutionUniformLocation(program);
        // var colorLocation = gl.getUniformLocation(program, "u_color");
        this.program = programInfo.program;
    }

    use = () =>{
        GLM.useProgram(this.program);
    }

    enablePosition = () => {
        GLM.enableVertexAttribArray(this.positionAttribute);
        GLM.pointToAttribute(this.positionAttribute, 2); // 2 (x,y) or 3 (x,y,z) positions to draw 
    }

    enableTransformationMatrix = (matrix) => {
        GLM.uploadMatrix4fv(this.transformationMatrix, matrix);
    }

    enablePixelCanvas = () =>{
        GLM.uploadResolution2f(this.resolutionUniform);
    }

} 