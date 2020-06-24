import Point from "../geometry/point.js";
import Vector from "../geometry/vector.js";
import Angle from "../geometry/angle.js";

import MatrixGenerator from "./matrix_generator.js";

export default class TransformationDecomposer
{
    constructor()
    {
        this.skewMode = 'skew';
        this.centerPoint = Point.origin();
        this.nonCanonicalCenterPoint = this.centerPoint;

    }

    setParams(centerPoint, mode)
    {
        //FIXME implement
        return;
        this.skewMode = mode;
        this.centerPoint = centerPoint;
        this.nonCanonicalCenterPoint = centerPoint;
    }

    decompose(matrix)
    {
        var decomposition = [];

        //Calculate the whole decomposition
        var bx = new Vector(1, 0);
        var by = new Vector(0, 1);
        var bxImage, byImage;

        if (matrix.isRegular()) {
            //decompose skew part
            bxImage = matrix.transformVector(bx);
            byImage = matrix.transformVector(by);

            if (this.skewMode === 'skew') {
                var skewX = Angle.atan(bxImage.mul(byImage)/byImage.mul(byImage));
                decomposition.unshift({"type": 'skew', "skewX": skewX, "skewY": Angle.zero(), "centerPoint": this.nonCanonicalCenterPoint});
                matrix = matrix.mul(MatrixGenerator.skew(skewX.mul(-1), Angle.zero(), this.nonCanonicalCenterPoint));
            } else if (this.skewMode === 'skewX') {
                var skewX = Angle.atan(bxImage.mul(byImage)/byImage.mul(byImage));
                decomposition.unshift({"type": 'skewX', "skewX": skewX, "centerPoint": this.nonCanonicalCenterPoint});
                matrix = matrix.mul(MatrixGenerator.skewX(skewX.mul(-1), this.nonCanonicalCenterPoint));
            } else {
                var skewY = Angle.atan(bxImage.mul(byImage)/bxImage.mul(bxImage));
                decomposition.unshift({"type": 'skewY', "skewY": skewY, "centerPoint": this.nonCanonicalCenterPoint});
                matrix = matrix.mul(MatrixGenerator.skewY(skewY.mul(-1), this.nonCanonicalCenterPoint));
            }
            
            //decompose scale
            bxImage = matrix.transformVector(bx);
            byImage = matrix.transformVector(by);
            var scaleX = bxImage.size();
            var scaleY = byImage.size();

            //decompose flip
            var bxImageRot = bxImage.rot(Angle.right());
            if (bxImageRot.mul(byImage) < 0) {
                scaleY = -scaleY;
            }

            decomposition.unshift({"type": "scale", "scaleX": scaleX, "scaleY": scaleY, "centerPoint": this.nonCanonicalCenterPoint});
            
            matrix = matrix.mul(MatrixGenerator.scale(1/scaleX, 1/scaleY, this.nonCanonicalCenterPoint));

            //decompose rotation
            bxImage = matrix.transformVector(bx);
            var rotation = bx.angleTo(bxImage);

            decomposition.unshift({"type": "rotate", "angle": rotation, "centerPoint": this.centerPoint});
            
            matrix = matrix.mul(MatrixGenerator.rotate(rotation.mul(-1), this.centerPoint));

            //decompose translation
            var translation = this.centerPoint.vectorTo(matrix.transformPoint(this.centerPoint));
            decomposition.unshift({"type": "translate", "vector": translation});
        } else {
            decomposition.unshift({"type": "matrix", "matrix": matrix});
        }
        
        return decomposition;
    }
}
