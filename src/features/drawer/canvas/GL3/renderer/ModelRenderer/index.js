import GLM from "../../GLManager";
import Shader from "../../shaders/modelShader";

export default class ModelRenderer {
    constructor(){
        this.shader = new Shader();  // todo: add param here to choose a shader just for this model.
        this.models = {};
    }

    registerNewModel = (model, id) =>{
        // will register each model type and upload its specific data to the GPU. 
        if(this.models[id]){
            let id_num = 1;
            id = id+" "+id_num
            while(this.models[id]){
                id_num++;
            }
        }
        if(!this.models[id]){
            this.models[id] = {
                type:model,
                instances:[],
            }
        }
    }

    addInstance = (instance, id) =>{
        this.models[id].instances.push(instance);
    }

    preRender = () => {
        GLM.viewport();
        GLM.depthTest(true); 
        GLM.cullFace(true);
    }

    // This renders every shape we have registered.
    render = () => {
        this.preRender();
        this.shader.use();
        this.shader.enablePixelCanvas();
        Object.keys(this.models).forEach(model => {
            this.models[model].type.use(this.shader);
            this.models[model].instances.forEach(instance =>{
                // this.shader.enableTransformationMatrix(instance.getTransformationMatrix());
                GLM.drawTriangles(this.models[model].type.indices.length);
            })
        })
    }
}