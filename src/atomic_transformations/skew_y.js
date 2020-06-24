import AngleConvertor from '../convertors/angle.js';
import NumberConvertor from '../convertors/number.js';

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

    getNonCanonicalToCanonizedTransformations()
    {
        return this.getShiftTransformations(
            {"type": "skewY", "skewY": this.skewY, "centerPoint": Point.origin()},
            this.centerPoint
        );
    }

    getMatrix()
    {
        return MatrixGenerator.skew(Angle.zero(), this.skewY, this.centerPoint);
    }

    getNonCanonicalArgs()
    {
        return [this.skewY, this.centerPoint.x, this.centerPoint.y];
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

    static getNonCanonicalArgsConvertors()
    {
        return [AngleConvertor, NumberConvertor, NumberConvertor];
    }

    static argsToParams(args)
    {
        return this._argsToParams(args, true);
    }

    static nonCanonicalArgsToParams(args)
    {
        return this._argsToParams(args, false);
    }

    static _argsToParams(args, canonical)
    {
        var skewY, centerPoint;
        if (canonical) {
            if (args.length != 1) {
                throw "Invalid number of arguments for a skewY transformation";
            }
        } else {
            if (args.length != 1 && args.length != 3) {
                throw "Invalid number of arguments for a skewY transformation";
            }
        }

        skewY = args[0];
        if (args.length == 3) {
            centerPoint = new Point(args[1], args[2]);
        } else {
            centerPoint = Point.origin();
        }

        return {"skewY": skewY, "centerPoint": centerPoint};
    }
}
