import Vector from "./vector";
import Utility from "./utility";

export default class Point
{
    constructor()
    {
        var args;
        if (args = Utility.args(arguments, "x:number", "y:number")) {
            this.x = args.x;
            this.y = args.y;
        } else if (args = Utility.args(arguments, ["point", Point])) {
            this.x = args.point.x;
            this.y = args.point.y;
        } else if (args = Utility.args(arguments, "string:string")) {
            throw "Loading points from a string is not yet implemented";
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

    coords()
    {
        return [this.x, this.y];
    }

    copy()
    {
        return new Point(this.x, this.y);
    }
}
