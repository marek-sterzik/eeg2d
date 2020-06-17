import Args from "../utility/args.js";
import ZeroTest from "../utility/zerotest.js";
import StringConvertor from "../utility/string_convertor.js";

import Angle from "./angle.js";
import Transformation from "./transformation.js";

export default class Vector
{
    constructor()
    {
        var args;
        if (args = Args.args(arguments, "x:number", "y:number")) {
            this.x = args.x;
            this.y = args.y;
        } else if (args = Args.args(arguments, ["vector", Vector])) {
            return args.vector;
        } else if (args = Args.args(arguments, "string:string")) {
            return StringConvertor.get().parseVector(args.string);
        } else {
            throw "Cannot construct vector from given arguments";
        }
        Object.freeze(this);
    }

    static zero() 
    {
        return new Vector(0, 0);
    }

    translation()
    {
        return Transformation.translate(this);
    }

    size()
    {
        return Math.sqrt(this.mul(this));
    }

    isZero()
    {
        return ZeroTest.isZero(this.x) && ZeroTest.isZero(this.y);
    }

    mul()
    {
        var args;
        if (args = Args.args(arguments, "scalar:number")) {
            return new Vector (this.x * args.scalar, this.y * args.scalar);
        } else if (args = Args.args(arguments, ["vector", Vector])) {
            return (this.x * args.vector.x) + (this.y * args.vector.y);
        } else {
            throw "invalid arguments";
        }
    }

    add(v)
    {
        return new Vector (this.x + v.x, this.y + v.y);
    }

    sub(v)
    {
        return new Vector (this.x - v.x, this.y - v.y);
    }

    rot(angle)
    {
        var cs = Math.cos(angle.rad());
        var sn = Math.sin(angle.rad());
        return new Vector (cs * this.x - sn * this.y, sn * this.x + cs * this.y);
    }

    normalize()
    {
        var size = this.size();
        if (size > 0) {
            return new Vector(this.x/size, this.y/size);
        } else {
            return Vector.zero();
        }
    }

    angleTo(v)
    {
        var angleRadians = Math.acos(this.mul(v) / (this.size() * v.size()));
        if (this.x * v.y - this.y * v.x < 0) {
            angleRadians = 2*Math.PI - angleRadians;
        }

        return Angle.rad(angleRadians);
    }

    toString()
    {
        return StringConvertor.get.apply(StringConvertor, arguments).vectorToString(this);
    }
}
