import Args from "../utility/args.js";
import ZeroTest from "../utility/zerotest.js";
import StringConvertor from "../utility/string_convertor.js";

import Vector from "./vector.js";

export default class Point
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
        Object.freeze(this);
    }

    static create = (...argList) => {
        var args;
        if (args = Args.args(argList, "x:number", "y:number")) {
            return new Point(args.x, args.y);
        } else if (args = Args.args(argList, ["point", Point])) {
            return args.point;
        } else if (args = Args.args(argList, "string:string")) {
            return StringConvertor.get().parsePoint(args.string);
        } else {
            throw "Cannot construct vector from given arguments";
        }
    }

    static origin = () => {
        return new Point(0, 0);
    }

    rot = (o2, angle) => {
        if (o2 instanceof Point) {
            o2 = this.vectorTo(o2);
        }

        if (!o2 instanceof Vector) {
            throw "invalid argument: needs to rotate a vector or a point";
        }
        return this.addVector(o2.rot(angle));
    }

    addVector = (v) => {
        return new Point (this.x + v.x, this.y + v.y);
    }

    distanceTo = (p2) => {
        return this.vectorTo(p2).size();
    }

    vectorTo = (p2) => {
        var x = p2.x - this.x;
        var y = p2.y - this.y;
        return new Vector(x, y);
    }

    isOrigin = () => {
        return ZeroTest.isZero(this.x) && ZeroTest.isZero(this.y);
    }

    toString = (...argList) => {
        return StringConvertor.get.apply(StringConvertor, argList).pointToString(this);
    }
}
