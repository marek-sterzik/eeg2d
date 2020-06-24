import AngleConvertor from '../convertors/angle.js';
import NumberConvertor from '../convertors/number.js';

import ZeroTest from '../utility/zerotest.js';
import MatrixGenerator from '../math/matrix_generator.js';

import AtomicTransformation from './atomic_transformation.js';

import Point from '../geometry/point.js';
import Angle from '../geometry/angle.js';

export default class SkewX extends AtomicTransformation
{
    constructor(params)
    {
        super();
        this._checkParam(params, 'skewX', Angle);
        this._checkParam(params, 'centerPoint', Point);
        this.skewX = params.skewX;
        this.centerPoint = params.centerPoint;
    }

    getMatrix()
    {
        return MatrixGenerator.skew(this.skewX, Angle.zero(), this.centerPoint);
    }

    getNonCanonicalArgs()
    {
        return [this.skewX, this.centerPoint.x, this.centerPoint.y];
    }

    getArgs()
    {
        if (!this.centerPoint.isOrigin()) {
            throw "cannot get arguments for a skewX with center point being different from origin";
        }

        return [this.skewX];
    }

    isCanonical()
    {
        return this.centerPoint.isOrigin();
    }

    static getName()
    {
        return 'skewX';
    }

    static getArgsConvertors()
    {
        return [AngleConvertor];
    }

    static getNonCanonicalArgsConvertors()
    {
        return [AngleConvertor, NumberConvertor, NumberConvertor];
    }

    static argsToParams(args)
    {
        var skewX;
        if (args.length != 1) {
            throw "Invalid number of arguments for a skewX transformation";
        }

        skewX = args[0];

        return {"skewX": skewX, "centerPoint": Point.origin()};
    }
}
