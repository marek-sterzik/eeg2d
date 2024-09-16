import Args from "../utility/args.js"
import ZeroTest from "../utility/zerotest.js"
import StringConvertor from "../utility/string_convertor.js"

import Angle from "./angle.js"
import Transformation from "./transformation.js"

export default class Vector
{
    constructor(x, y)
    {
        this.x = x
        this.y = y
        Object.freeze(this)
    }

    static create = (...argList) => {
        var args
        if (args = Args.args(argList, "x:number", "y:number")) {
            return new Vector(args.x, args.y)
        } else if (args = Args.args(argList, ["vector", Vector])) {
            return args.vector
        } else if (args = Args.args(argList, "string:string")) {
            return StringConvertor.get().parseVector(args.string)
        } else {
            throw "Cannot construct vector from given arguments"
        }
    }

    static zero = () => {
        return new Vector(0, 0)
    }

    getTranslation = () => {
        return Transformation.translate(this)
    }

    size = () => {
        return Math.sqrt(this.mul(this))
    }

    isZero = () => {
        return ZeroTest.isZero(this.x) && ZeroTest.isZero(this.y)
    }

    mul = (o2) => {
        if (typeof o2 == "number") {
            return new Vector (this.x * o2, this.y * o2)
        }
        if (o2 instanceof Vector) {
            return (this.x * o2.x) + (this.y * o2.y)
        }
        throw "invalid arguments"
    }

    add = (v) => {
        return new Vector (this.x + v.x, this.y + v.y)
    }

    sub = (v) => {
        return new Vector (this.x - v.x, this.y - v.y)
    }

    rot = (angle) => {
        var cs = angle.cos()
        var sn = angle.sin()
        return new Vector (cs * this.x - sn * this.y, sn * this.x + cs * this.y)
    }

    normalize = () => {
        var size = this.size()
        if (size > 0) {
            return new Vector(this.x/size, this.y/size)
        } else {
            return Vector.zero()
        }
    }

    angleTo = (v) => {
        var r = (this.mul(v) / (this.size() * v.size()))
        if (r > 1) {
            r = 1
        } else if (r < -1) {
            r = -1
        }
        var angleRadians = Math.acos(r)
        if (this.x * v.y - this.y * v.x < 0) {
            angleRadians = 2*Math.PI - angleRadians
        }

        return Angle.rad(angleRadians)
    }

    toString = (...argList) => {
        return StringConvertor.get.apply(StringConvertor, argList).vectorToString(this)
    }
}
