import Utility from "./utility.js";
import ZeroTest from "./zerotest.js";
import StringConvertor from "./string_convertor.js";
import Vector from "./vector.js";

export default class Point
{
    constructor()
    {
        var args;
        if (args = Utility.args(arguments, "x:number", "y:number")) {
            this.x = args.x;
            this.y = args.y;
        } else if (args = Utility.args(arguments, ["point", Point])) {
            return args.point;
        } else if (args = Utility.args(arguments, "string:string")) {
            return StringConvertor.getDefault().parsePoint(args.string);
        } else {
            throw "Cannot construct vector from given arguments";
        }
        Object.freeze(this);
    }

    static origin()
    {
        return new Point(0, 0);
    }

    rot(p2, angle)
    {
        return this.addVector(this.vectorTo(p2).rot(angle));
    }

    addVector(v)
    {
        return new Point (this.x + v.x, this.y + v.y);
    }

    distanceTo(p2)
    {
        return this.vectorTo(p2).size();
    }

    vectorTo(p2)
    {
        var x = p2.x - this.x;
        var y = p2.y - this.y;
        return new Vector(x, y);
    }

    isOrigin()
    {
        return ZeroTest.isZero(this.x) && ZeroTest.isZero(this.y);
    }

    toString()
    {
        return StringConvertor.getDefault.apply(StringConvertor, arguments).pointToString(this);
    }
}
