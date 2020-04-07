import { createTransformationMatrix } from '../../utils/maths';

export default class ModelInstance {
    // It's important to keep in mind that the transformation matrix will be drawn in (-1,1)
    // So these must be converted to that scale 

    constructor(x, y, z, rx, ry, rz, scale, width, height){
        this.x = this.pixelToClip(x,width);
        this.y = this.pixelToClip(y,height);
        this.z = z; // Z we leave as -1,1 for now.
        this.rx = this.degreeToClip(rx);
        this.ry = this.degreeToClip(ry);
        this.rz = this.degreeToClip(rz);
        this.width = width;
        this.height = height;
        this.scale = scale;
    }

    degreeToClip = (degree) => {
        // a clipspace rotation of 1 = 1 radian = 180*        
        return degree/180;
    }

    pixelToClip = (pixelPos, dimension) =>{
        return pixelPos/dimension;
    }

    updateRotation = (rx, ry, rz) => {
        // 1 = 180 degrees
        this.rx += this.degreeToClip(rx);
        this.ry += this.degreeToClip(ry);
        this.rz += this.degreeToClip(rz);
        this.updateTransformationMatrix();
    }

    updatePosition = (x, y, z) => {
        this.x = this.pixelToClip(x, this.width);
        this.y = this.pixelToClip(y,this.height);
        this.z = z;
        this.updateTransformationMatrix();
    }

    updatePositionByDelta = (dx, dy, dz) => {
        this.x += x;
        this.y += y;
        this.z += z;
        this.updateTransformationMatrix();
    }

    updateTransformationMatrix = () => {
        this.transformationMatrix = createTransformationMatrix(this.x, this.y, this.z, this.rx, this.ry, this.rz, this.scale);
    }

    getTransformationMatrix = () => this.transformationMatrix;
} 