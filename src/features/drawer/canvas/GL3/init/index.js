import GLM from "../GLManager";
import ModelRenderer from "../renderer/ModelRenderer";
import ModelType from "../models/modelType";
import ModelInstance from '../models/modelInstance';

export default (id) => {
    const canvas = document.querySelector(`#${id}`);

    if(!canvas){
        return;
    }

    const gl = canvas.getContext("webgl2");

    if(!gl){
        return;
    }

    GLM.init(gl);

    const modelRender = new ModelRenderer();

    for (const obj_to_draw in state){
        modelRender.registerNewModel(new ModelType(position), obj_to_draw.tool);
        // modelRender.addInstance(instance, obj_to_draw.tool);
    }

    const render = () => {
        GLM.clear(1.0, 1.0, 1.0, 1.0);
        // instance.updateRotation(0, 0, 0);  
        // instance.updatePosition(500, 300, 0);
        modelRender.render();
        window.requestAnimationFrame(render);
    }

    window.requestAnimationFrame(render);


    


}