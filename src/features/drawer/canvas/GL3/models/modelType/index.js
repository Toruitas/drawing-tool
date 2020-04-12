import GLM from "../../GLManager";

export class ModelType {
    constructor(coords, type){
        this.vertices = [];
        this.indices = [];
        this.type = type;
        this.coords = coords;
        this._generateVerticesAndIndices();
        this._genVertexBuffer();
        this._genIndexBuffer();
    }

    _genVertexBuffer = () => {
        this.vertexBuffer = GLM.createBuffer();
        GLM.bindArrayBuffer(this.vertexBuffer);
        GLM.addArrayBufferData(this.vertices);
        GLM.unbindArrayBuffer();
    }

    _genIndexBuffer = () => {
        this.indexBuffer = GLM.createBuffer();
        GLM.bindElementArrayBuffer(this.indexBuffer);
        GLM.addElementArrayBufferData(this.indices);
        GLM.unbindElementArrayBuffer();
    }

    _genVao = () =>{
        this.vao = GLM.createVertexArray();
        GLM.bindVertexArray(this.vao);
        
    }

    use = (shader) =>{
        GLM.bindArrayBuffer(this.vertexBuffer);
        shader.enablePosition();
        GLM.bindElementArrayBuffer(this.indexBuffer);
    }

    _generateVerticesAndIndices = () =>{
        // Tell GLSL how to draw the shape 
        if(this.type === "triangle"){
            // one (x,y) pair for each point of the triangle
            this.vertices = [
                this.coords[0], this.coords[1],
                this.coords[2], this.coords[3],
                this.coords[4], this.coords[5],
            ]
            this.indices = [0,1,2];
        }else if (this.type === "rect"){
            // x1, y1, x2, y2
            let x1 = this.coords[0];
            let y1 = this.coords[1];
            let x2 = this.coords[2];
            let y2 = this.coords[3];
            // (1,5) and (2,10)
            this.vertices = [
                x1, y1,
                x2, y1,
                x1, y2,
                x1, y2,
                x2, y1,
                x2, y2,
            ]
            this.indices = [0,1,2,3,4,5]
        }
    }

}