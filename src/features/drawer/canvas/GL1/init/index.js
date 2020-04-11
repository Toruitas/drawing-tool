import GLM from "../GLManager";
import ModelRenderer from "../renderer/ModelRenderer";
import ModelType from "../models/modelType";
import ModelInstance from '../models/modelInstance';

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

    // const vertices = [
    //     // x, y, z
    //     0.0, 0.5, 0.0,
    //     -0.5, -0.5, 0.0,
    //     0.5, -0.5, 0.0
    // ];

    const vertices = [
        // x, y, z
        -75.0, -75.0, 0.0,
        0.0, 75.0, 0.0,
        75.0, -75.0, 0.0
    ];

    const indices = [0, 1, 2]; // first connects to second connects to third

    const modelRender = new ModelRenderer();
    modelRender.registerNewModel(new ModelType(vertices, indices), "triangle");
    const instance = new ModelInstance(0, 0, 0, 150, 150, 0, 1.0, gl.canvas.width, gl.canvas.height);
    modelRender.addInstance(instance, 'triangle');
    // const instance2 = new ModelInstance(100, 100, 0, 180, 0, 0, 1.0, gl.canvas.width, gl.canvas.height);
    // modelRender.addInstance(instance2, 'triangle');

    const render = () => {
        GLM.clear(1.0, 1.0, 1.0, 1.0);
        // instance.updateRotation(0, 0, 0);  
        // instance.updatePosition(500, 300, 0);
        modelRender.render();
        window.requestAnimationFrame(render);
    }

    window.requestAnimationFrame(render);


    


}