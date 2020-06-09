import Utility from "./utility";
import ZeroTest from "./zerotest";

export default class Angle
{
    constructor()
    {
        var args;
        if (args = Utility.args(arguments, "radians:number")) {
            this.radians = args.radians;
        } else if (args = Utility.args(arguments, ["angle", Angle])) {
            this.radians = args.angle.radians;
        } else if (args = Utility.args(arguments, "string:string")) {
            throw "Loading an angle from a string is not yet implemented";
        } else {
            throw "Cannot construct an angle from given arguments";
        }
        Object.freeze(this);
    }

    static zero()
    {
        return new Angle(0);
    }

    static inRadians(r)
    {
        return new Angle(r * 1);
    }

    static inDegrees(d)
    {
        return new Angle(d * Math.PI / 180);
    }

    rad()
    {
        return this.radians;
    }

    deg()
    {
        return this.radians * 180 / Math.PI;
    }

    mul(c)
    {
        return new Angle(this.radians * c);
    }

    add(a2)
    {
        if (!(a2 instanceof Angle)) {
            a2 = new Angle(a2);
        }

        return new Angle(this.radians + a2.radians);
    }

    sub(a2)
    {
        if (!(a2 instanceof Angle)) {
            a2 = new Angle(a2);
        }

        return new Angle(this.radians - a2.radians);
    }

    sin()
    {
        return Math.sin(this.radians);
    }

    cos()
    {
        return Math.cos(this.radians);
    }

    tan()
    {
        return Math.tan(this.radians);
    }

    cotan()
    {
        return this.cos() / this.sin();
    }

    transformation() 
    {
        return Transformation.rotation(Point.center(), this);
    }

    copy()
    {
        return new Angle(this.radians);
    }

    isZero()
    {
        return ZeroTest.isZero(this.radians);
    }

}
