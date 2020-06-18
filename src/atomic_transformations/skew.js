import AngleConvertor from '../convertors/angle.js';

import ZeroTest from '../utility/zerotest.js';
import Transformation from '../geometry/transformation.js';
import MatrixGenerator from '../math/matrix_generator.js';

import AtomicTransformation from './atomic_transformation.js';

import Point from '../geometry/point.js';
import Angle from '../geometry/angle.js';

export default class Skew extends AtomicTransformation
{
    constructor(params)
    {
        this._checkParam(params, 'skewX', Angle);
        this._checkParam(params, 'skewY', Angle);
        this._checkParam(params, 'centerPoint', Point);
        this.skewX = params.skewX;
        this.skewY = params.skewY;
        this.centerPoint = params.centerPoint;
    }

    getTransformation()
    {
        return new Transformation(MatrixGenerator.skew(this.skewX, this.skewY, this.centerPoint));
    }

    getArgs()
    {
        if (!this.centerPoint.isOrigin()) {
            throw "cannot get arguments for a skew with center point being different from origin";
        }

        if (this.skewY.isZero()) {
            return [this.skewX];
        } else {
            return [this.skewX, this.skewY];
        }
    }

    static allowsShiftedCenterPoint()
    {
        return false;
    }

    static getName()
    {
        return 'skew';
    }

    static getArgsConvertors()
    {
        return [AngleConvertor, AngleConvertor];
    }

    static argsToParams(args)
    {
        var skewX, skewY;
        if (args.length < 1 || args.length > 2) {
            throw "Invalid number of arguments for a skew transformation";
        }

        skewX = args[0];
        skewY = (args.length >= 2) ? args[1] : Angle.zero();

        return {"skewX": skewX, "skewY": skewY, "centerPoint": Point.origin()};
    }
}
