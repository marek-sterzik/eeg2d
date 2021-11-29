import Args from "../utility/args.js";
import ZeroTest from "../utility/zerotest.js";
import StringConvertor from "../utility/string_convertor.js";

import Point from "./point.js";
import Transformation from "./transformation.js";

export default class Angle
{
    constructor(radians)
    {
        this.radians = radians
        Object.freeze(this);
    }

    static create = (...argList) => {
        var args;
        if (args = Args.args(argList, "radians:number")) {
            return new Angle(args.radians);
        } else if (args = Args.args(argList, ["angle", Angle])) {
            return args.angle;
        } else if (args = Args.args(argList, "string:string")) {
            return StringConvertor.get().parseAngle(args.string);
        } else {
            throw "Cannot construct an angle from given arguments";
        }
    }

    static zero = () => {
        return new Angle(0);
    }

    static full = () => {
        return new Angle(2 * Math.PI);
    }

    static straight = () => {
        return new Angle(Math.PI);
    }

    static right = () => {
        return new Angle(Math.PI / 2);
    }

    static rad = (r) => {
        return new Angle(r);
    }

    static deg = (d) => {
        return new Angle(d * Math.PI / 180);
    }

    static grad = (g) => {
        return new Angle(g * Math.PI / 200);
    }

    static turn = (t) => {
        return new Angle(t * 2 * Math.PI);
    }

    static atan = (x) => {
        return new Angle(Math.atan(x));
    }

    rad = () => {
        return this.radians;
    }

    deg = () => {
        return this.radians * 180 / Math.PI;
    }

    grad = () => {
        return this.radians * 200 / Math.PI;
    }

    turn = () => {
        return this.radians / (2 * Math.PI);
    }

    mul = (c) => {
        return new Angle(this.radians * c);
    }

    add = (a2) => {
        if (!(a2 instanceof Angle)) {
            a2 = Angle.create(a2);
        }

        return new Angle(this.radians + a2.radians);
    }

    sub = (a2) => {
        if (!(a2 instanceof Angle)) {
            a2 = Angle.create(a2);
        }

        return new Angle(this.radians - a2.radians);
    }

    normalize = () => {
        if (this.radians < 0) {
            var n = Math.ceil((- this.radians) / (2 * Math.PI));
            return new Angle(this.radians + 2 * n * Math.PI);
        } else if (this.radians >= 2 * Math.PI) {
            var n = Math.floor(this.radians / (2 * Math.PI));
            return new Angle(this.radians - 2 * n * Math.PI);
        } else {
            return this;
        }
    }

    sin = () => {
        return Math.sin(this.radians);
    }

    cos = () => {
        return Math.cos(this.radians);
    }

    tan = () => {
        return Math.tan(this.radians);
    }

    cotan = () => {
        return this.cos() / this.sin();
    }

    getRotation = (center = Point.origin()) => {
        return Transformation.rotate(this, center);
    }

    isZero = () => {
        return ZeroTest.isZero(this.radians);
    }

    toString = (...argList) => {
        return StringConvertor.get.apply(StringConvertor, argList).angleToString(this);
    }
}
