import Args from "../utility/args.js";
import ZeroTest from "../utility/zerotest.js";
import StringConvertor from "../utility/string_convertor.js";

import TransformationMatrix from "../math/matrix.js";
import MatrixGenerator from "../math/matrix_generator.js";

import Vector from "./vector.js";
import Point from "./point.js";
import Angle from "./angle.js";


class TransformationInterpolation
{
    constructor(t1, t2)
    {
        this.t1 = t1;
        this.t2 = t2;
    }

    at()
    {
        var args, x, numberOfRotations;
        if (args = Args.args(arguments, "x:number", "rotationMode:string:default:shortest")) {
            x = args.x;
            numberOfRotations = this._getNumberOfRotations(args.rotationMode);
        } else if (args = Args.args(arguments, "x:number", "numberOfRotations:number")) {
            x = args.x;
            numberOfRotations = args.numberOfRotations;
            if (numberOfRotations | 0 !== numberOfRotations) {
                throw "Invalid number of rotations";
            }
        } else {
            throw "Invalid arguments";
        }

        var matrix;
        var centerPoint = this._interpolatePoint([this.t1.centerPoint, this.t2.centerPoint], x);
        matrix = MatrixGenerator.translate(this._getTranslateVectorAt(x));
        matrix = matrix.mul(MatrixGenerator.rotate(this._getRotationAngleAt(x, numberOfRotations), centerPoint));
        matrix = matrix.mul(MatrixGenerator.scale(this._getScaleXAt(x), this._getScaleYAt(x), centerPoint));
        matrix = matrix.mul(MatrixGenerator.skewX(this._getSkewXAt(x), centerPoint));
        matrix = matrix.mul(MatrixGenerator.skewY(this._getSkewYAt(x), centerPoint));

        var m = this._getMatrixAt(x);
        if (m !== null) {
            matrix = matrix.mul(m);
        }

        return new Transformation(matrix);
    }

    _getNumberOfRotations(rotationMode)
    {
        switch (rotationMode) {
        case 'clockwise':
        case 'right':
        case 'cw':
            return 1;
        case 'anticlockwise':
        case 'counterclockwise':
        case 'left':
        case 'acw':
            return -1;
        case 'shortest':
            return 0;
        default:
            throw "invalid rotation mode: "+rotationMode;
        }
    }

    _getTranslateVectorAt(x)
    {
        return this._interpolateVector([this.t1.translation, this.t2.translation], x);
    }

    _getRotationAngleAt(x, numberOfRotations)
    {
        return this._interpolateAngle([this.t1.rotation, this.t2.rotation], x, numberOfRotations);
    }

    _getScaleXAt(x)
    {
        return this._interpolateNumber([this.t1.scaleX, this.t2.scaleX], x);
    }

    _getScaleYAt(x)
    {
        return this._interpolateNumber([this.t1.scaleX, this.t2.scaleX], x);
    }

    _getSkewXAt(x)
    {
        return this._interpolateAngle([this.t1.skewX, this.t2.skewX], x, "shortest");
    }

    _getSkewYAt(x)
    {
        return this._interpolateAngle([this.t1.skewY, this.t2.skewY], x, "shortest");
    }

    _getMatrixAt(x)
    {
        if (this.t1.matrix === null && this.t2.matrix === null) {
            return null;
        }

        var t1m = this.t1.matrix;
        if (t1m === null) {
            t1m = MatrixGenerator.identity();
        }

        var t2m = this.t2.matrix;
        if (t2m === null) {
            t2m = MatrixGenerator.identity();
        }

        return this._interpolateMatrix([t1m, t2m], x);
    }

    _getAngleRange(canonicalRange, numberOfRotations)
    {
        var diff = canonicalRange[1].sub(canonicalRange[0]).normalize();
        var fullAngle;

        if (numberOfRotations == 0) {
            if (Math.abs(diff.rad() - 2 * Math.PI) > diff.rad()) {
                numberOfRotations = -1;
            } else {
                numberOfRotations = 1;
            }
        }

        if (numberOfRotations < 0) {
            diff = diff.sub(Angle.full().mul(-numberOfRotations));
        } else {
            diff = diff.add(Angle.full().mul(numberOfRotations - 1));
        }

        return [canonicalRange[0], canonicalRange[0].add(diff)];
    }

    _interpolateNumber(range, x)
    {
        return range[0] * (1-x) + range[1] * x;
    }

    _interpolateVector(range, x)
    {
        return range[0].mul(1-x).add(range[1].mul(x));
    }

    _interpolateAngle(range, x, numberOfRotations)
    {
        range = this._getAngleRange(range, numberOfRotations);
        return range[0].mul(1-x).add(range[1].mul(x));
    }

    _interpolatePoint(range, x)
    {
        var v = range[0].vectorTo(range[1]);
        return range[0].add(v.mul(x));
    }

    _interpolateMatrix(range, x)
    {
        return range[0].mul(1-x).add(range[1].mul(x));
    }

}

