import Utility from "./utility";
import ZeroTest from "./zerotest";
import Angle from "./angle";

export default class Vector
{
    constructor()
    {
        var args;
        if (args = Utility.args(arguments, "x:number", "y:number")) {
            this.x = args.x;
            this.y = args.y;
        } else if (args = Utility.args(arguments, ["vector", Vector])) {
            this.x = args.vector.x;
            this.y = args.vector.y;
        } else if (args = Utility.args(arguments, "string:string")) {
            throw "Loading vectors from a string is not yet implemented";
        } else {
            throw "Cannot construct vector from given arguments";
        }
        Object.freeze(this);
    }

    static zero() 
    {
        return new Vector(0, 0);
    }

    transformation()
    {
        return Transformation.translation(this);
    }

    size()
    {
        return Math.sqrt(this.mulScalar(this));
    }

    isZero()
    {
        return ZeroTest.isZero(this.x) && ZeroTest.isZero(this.y);
    }

    mulScalar(v)
    {
        return this.mul(v);
    }

    mul()
    {
        var args;
        if (args = Utility.args(arguments, "scalar:number")) {
            return new Vector (this.x * args.scalar, this.y * args.scalar);
        } else if (args = Utility.args(arguments, ["vector", Vector])) {
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
        var angleRadians = Math.acos(this.mulScalar(v) / (this.size() * v.size()));
        if (this.x * v.y - this.y * v.x < 0) {
            angleRadians = 2*Math.PI - angleRadians;
        }

        return Angle.inRadians(angleRadians);
    }

    copy()
    {
        return new Vector(this.x, this.y);
    }
}
