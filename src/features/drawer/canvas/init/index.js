import GLM from "../GLManager";
import ModelRenderer from "../renderer/ModelRenderer";
import ModelType from "../models/modelType";

export default (id) => {
    const canvas = document.querySelector(`#${id}`);

    if(!canvas){
        return;
    }

    const gl = canvas.getContext("webgl");

    if(!gl){
        return;
    }

    GLM.init(gl);

    const vertices = [
        // x, y, z
        0.0, 0.5, 0.0,
        -0.5, -0.5, 0.0,
        0.5, -0.5, 0.0
    ];

    const indices = [0, 1, 2]; // first connects to second connects to third
    
    const modelRender = new ModelRenderer();
    modelRender.registerNewModel(new ModelType(vertices, indices), "triangle");
    modelRender.addInstance('instance1', "triangle"); // in the future this will be used for tranformation and translation matrices
    GLM.clear(1.0,1.0,1.0,1.0)
    modelRender.render();


    


}