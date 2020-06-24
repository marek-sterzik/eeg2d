import NumberConvertor from '../convertors/number.js';

import ZeroTest from '../utility/zerotest.js';
import MatrixGenerator from '../math/matrix_generator.js';

import AtomicTransformation from './atomic_transformation.js';

import Point from '../geometry/point.js';

export default class Scale extends AtomicTransformation
{
    constructor(params)
    {
        super();
        this._checkParam(params, 'scaleX', 'number');
        this._checkParam(params, 'scaleY', 'number');
        this._checkParam(params, 'centerPoint', Point);
        this.scaleX = params.scaleX;
        this.scaleY = params.scaleY;
        this.centerPoint = params.centerPoint;
    }

    getNonCanonicalToCanonizedTransformations()
    {
        return this.getShiftTransformations(
            {"type": "scale", "scaleX": this.scaleX, "scaleY": this.scaleY, "centerPoint": Point.origin()},
            this.centerPoint
        );
    }

    getMatrix()
    {
        return MatrixGenerator.scale(this.scaleX, this.scaleY, this.centerPoint);
    }

    getArgs()
    {
        if (!this.centerPoint.isOrigin()) {
            throw "cannot get arguments for a scale with center point being different from origin";
        }

        if (ZeroTest.isEqual(this.scaleX, this.scaleY)) {
            return [this.scaleX];
        } else {
            return [this.scaleX, this.scaleY];
        }
    }

    getNonCanonicalArgs()
    {
        return [this.scaleX, this.scaleY, this.centerPoint.x, this.centerPoint.y];
    }

    isIdentity()
    {
        return ZeroTest.isEqual(this.scaleX, 1) && ZeroTest.isEqual(this.scaleY, 1);
    }

    isCanonical()
    {
        return this.centerPoint.isOrigin();
    }

    static getName()
    {
        return 'scale';
    }

    static getArgsConvertors()
    {
        return [NumberConvertor, NumberConvertor];
    }

    static getNonCanonicalArgsConvertors()
    {
        return [NumberConvertor, NumberConvertor, NumberConvertor, NumberConvertor];
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
        var scaleX, scaleY, centerPoint;
        if (canonical) {
            if (args.length < 1 || args.length > 2) {
                throw "Invalid number of arguments for a scale transformation";
            }
        } else {
            if (args.length < 1 || args.length == 3 || args.length > 4) {
                throw "Invalid number of arguments for a scale transformation";
            }
        }

        scaleX = args[0];
        scaleY = (args.length >= 2) ? args[1] : scaleX;
        if (args.length == 4) {
            centerPoint = new Point(args[2], args[3]);
        } else {
            centerPoint = Point.origin();
        }

        return {"scaleX": scaleX, "scaleY": scaleY, "centerPoint": centerPoint};
    }
}
