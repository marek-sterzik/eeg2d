import AngleConvertor from '../convertors/angle.js';

import ZeroTest from '../utility/zerotest.js';
import MatrixGenerator from '../math/matrix_generator.js';

import AtomicTransformation from './atomic_transformation.js';

import Point from '../geometry/point.js';
import Angle from '../geometry/angle.js';

export default class SkewY extends AtomicTransformation
{
    constructor(params)
    {
        super();
        this._checkParam(params, 'skewY', Angle);
        this._checkParam(params, 'centerPoint', Point);
        this.skewY = params.skewY;
        this.centerPoint = params.centerPoint;
    }

    getMatrix()
    {
        return MatrixGenerator.skew(Angle.zero(), this.skewY, this.centerPoint);
    }

    getArgs()
    {
        if (!this.centerPoint.isOrigin()) {
            throw "cannot get arguments for a skewY with center point being different from origin";
        }

        return [this.skewY];
    }

    isCanonical()
    {
        return this.centerPoint.isOrigin();
    }

    static getName()
    {
        return 'skewY';
    }

    static getArgsConvertors()
    {
        return [AngleConvertor];
    }

    static argsToParams(args)
    {
        var skewY;
        if (args.length != 1) {
            throw "Invalid number of arguments for a skewY transformation";
        }

        skewY = args[0];

        return {"skewY": skewY, "centerPoint": Point.origin()};
    }
}
