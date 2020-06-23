import NumberConvertor from '../convertors/number.js';

import ZeroTest from '../utility/zerotest.js';
import MatrixGenerator from '../math/matrix_generator.js';

import AtomicTransformation from './atomic_transformation.js';

import Point from '../geometry/point.js';

export default class Scale extends AtomicTransformation
{
    constructor(params)
    {
        this._checkParam(params, 'scaleX', 'number');
        this._checkParam(params, 'scaleY', 'number');
        this._checkParam(params, 'centerPoint', Point);
        this.scaleX = params.scaleX;
        this.scaleY = params.scaleY;
        this.centerPoint = params.centerPoint;
    }

    getMatrix()
    {
        return MatrixGenerator.rotate(this.scaleX, this.scaleY, this.centerPoint);
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

    static allowsShiftedCenterPoint()
    {
        return false;
    }

    static getName()
    {
        return 'scale';
    }

    static getArgsConvertors()
    {
        return [NumberConvertor, NumberConvertor];
    }

    static argsToParams(args)
    {
        var scaleX, scaleY;
        if (args.length < 1 || args.length > 2) {
            throw "Invalid number of arguments for a scale transformation";
        }

        scaleX = args[0];
        scaleY = (args.length >= 2) ? args[1] : scaleX;

        return {"scaleX": scaleX, "scaleY": scaleY, "centerPoint": Point.origin()};
    }
}
