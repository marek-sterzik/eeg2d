import NumberConvertor from '../convertors/number.js';
import AngleConvertor from '../convertors/angle.js';

import Transformation from '../geometry/transformation.js';
import MatrixGenerator from '../math/matrix_generator.js';

import AtomicTransformation from './atomic_transformation.js';

import Angle from '../geometry/angle.js';
import Point from '../geometry/point.js';

export default class Rotate extends AtomicTransformation
{
    constructor(params)
    {
        this._checkParam(params, 'angle', Angle);
        this._checkParam(params, 'centerPoint', Point);
        this.angle = params.angle;
        this.centerPoint = params.centerPoint;
    }

    getTransformation()
    {
        return new Transformation(MatrixGenerator.rotate(this.angle, this.centerPoint));
    }

    getArgs()
    {
        if (this.centerPoint.isOrigin()) {
            return [this.angle];
        } else {
            return [this.angle, this.centerPoint.x, this.centerPoint.y]
        }
    }

    static allowsShiftedCenterPoint()
    {
        return true;
    }

    static getName()
    {
        return 'rotate';
    }

    static getArgsConvertors()
    {
        return [AngleConvertor, NumberConvertor, NumberConvertor];
    }

    static argsToParams(args)
    {
        var x, y, angle;
        if (args.length < 1 || args.length > 3 || args.length == 2) {
            throw "Invalid number of arguments for a rotation";
        }

        angle = args[0];
        x = (args.length >= 2) ? args[1] : 0;
        y = (args.length >= 3) ? args[2] : 0;

        return {"angle": angle, "centerPoint": new Point(x, y)};
    }
}
