import AngleConvertor from '../convertors/angle.js'
import NumberConvertor from '../convertors/number.js'

import ZeroTest from '../utility/zerotest.js'
import MatrixGenerator from '../math/matrix_generator.js'

import AtomicTransformation from './atomic_transformation.js'

import Point from '../geometry/point.js'
import Angle from '../geometry/angle.js'

export default class SkewX extends AtomicTransformation
{
    constructor(params)
    {
        super()
        this._checkParam(params, 'skewX', Angle)
        this._checkParam(params, 'centerPoint', Point)
        this.skewX = params.skewX
        this.centerPoint = params.centerPoint
    }

    getNonCanonicalToCanonizedTransformations()
    {
        return this.getShiftTransformations(
            {"type": "skewX", "skewX": this.skewX, "centerPoint": Point.origin()},
            this.centerPoint
        )
    }

    getMatrix()
    {
        return MatrixGenerator.skew(this.skewX, Angle.zero(), this.centerPoint)
    }

    getNonCanonicalArgs()
    {
        return [this.skewX, this.centerPoint.x, this.centerPoint.y]
    }

    getArgs()
    {
        if (!this.centerPoint.isOrigin()) {
            throw "cannot get arguments for a skewX with center point being different from origin"
        }

        return [this.skewX]
    }

    isIdentity()
    {
        return this.skewX.normalize().isZero()
    }

    isCanonical()
    {
        return this.centerPoint.isOrigin()
    }

    static getName()
    {
        return 'skewX'
    }

    static getArgsConvertors()
    {
        return [AngleConvertor]
    }

    static getNonCanonicalArgsConvertors()
    {
        return [AngleConvertor, NumberConvertor, NumberConvertor]
    }

    static argsToParams(args)
    {
        return this._argsToParams(args, true)
    }

    static nonCanonicalArgsToParams(args)
    {
        return this._argsToParams(args, false)
    }

    static _argsToParams(args, canonical)
    {
        var skewX, centerPoint
        if (canonical) {
            if (args.length != 1) {
                throw "Invalid number of arguments for a skewX transformation"
            }
        } else {
            if (args.length != 1 && args.length != 3) {
                throw "Invalid number of arguments for a skewX transformation"
            }
        }

        skewX = args[0]
        if (args.length == 3) {
            centerPoint = new Point(args[1], args[2])
        } else {
            centerPoint = Point.origin()
        }

        return {"skewX": skewX, "centerPoint": centerPoint}
    }
}
