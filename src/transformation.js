import Utility from "./utility";
import Vector from "./vector";
import Point from "./point";
import Angle from "./angle";
import TransformationMatrix from "./matrix";
import ZeroTest from "./zerotest";

export default class Transformation
{
    constructor()
    {
        var args;
        if (args = Utility.args(arguments, ["matrix", TransformationMatrix])) {
            this.matrix = args.matrix;
        } else if (args = Utility.args(arguments, "a:number", "b:number", "c:number", "d:number", "e:number", "f:number")) {
            this.matrix = new TransformationMatrix(args.a, args.b, args.c, args.d, args.e, args.f);
        } else if (args = Utility.args(arguments, "string:string")) {
            throw "Loading transformations from a string is not yet implemented";
        } else {
            throw "Cannot construct a transformation from given arguments";
        }
        Object.freeze(this);
    }

    static translate()
    {
        var args;
        var v;
        if (args = Utility.args(arguments, ["v", Vector])) {
            v = args.v
        } else if (args = Utility.args(arguments, "x:number", ["y", "number", "default", null])) {
            v = new Vector(args.x, args.y);
        } else {
            throw "Cannot construct a translation transformation from the given arguments";
        }

        return new Transformation(MatrixGenerator.translate(v));
    }

    static rotate()
    {
        var args;
        var angle, center;
        if (args = Utility.args(arguments, ["angle", Angle], ["center", Point, "default", null])) {
            angle = args.angle;
            center = args.center;
        } else if (args = Utility.args(arguments, "angle:number", ["center", Point, "default", null])) {
            angle = new Angle(args.angle);
            center = args.center;
        } else {
            throw "Cannot construct a rotation transformation from the given arguments";
        }

        return new Transformation(MatrixGenerator.rotate(angle, center));
    }

    static scale()
    {
        var args;
        var a, b, center;
        if (args = Utility.args(arguments, "a:number", ["b", "number", "default", null], ["center", Point, "default", null])) {
            a = args.a;
            b = (args.b === null) ? args.a : args.b;
            center = args.center;
        } else if (args = Utility.args(arguments, "a:number", ["center", Point, "default", null])) {
            a = args.a;
            b = args.a;
            center = args.center;
        } else {
            throw "Cannot construct a scale transformation from the given arguments";
        }

        return new Transformation(MatrixGenerator.scale(a, b, center));
    }

    static skewX()
    {
        var args;
        var angle, center;
        if (args = Utility.args(arguments, "angle:number", ["center", Point, "default", null])) {
            angle = new Angle(args.angle);
            center = args.center;
        } else if (args = Utility.args(arguments, ["angle", Angle], ["center", Point, "default", null])) {
            angle = args.angle;
            center = args.center;
        } else {
            throw "Cannot construct a skew matrix from the given arguments";
        }

        return new Transformation(MatrixGenerator.skewX(angle, center));
    }

    static skewY()
    {
        var args;
        var angle, center;
        if (args = Utility.args(arguments, "angle:number", ["center", Point, "default", null])) {
            angle = new Angle(args.angle);
            center = args.center;
        } else if (args = Utility.args(arguments, ["angle", Angle], ["center", Point, "default", null])) {
            angle = args.angle;
            center = args.center;
        } else {
            throw "Cannot construct a skew matrix from the given arguments";
        }

        return new Transformation(MatrixGenerator.skewY(angle, center));
    }


    copy()
    {
        return new MatrixTransform(this.matrix);
    }

    compose(t2)
    {
        return new MatrixTransformation(this.matrix.mul(t2.matrix));
    }

    inv()
    {
        return new MatrixTransformation(this.matrix.inv())
    }

    transformPoint(p)
    {
        return this.matrix.transformPoint(p);
    }

    transformVector(v)
    {
        return this.matrix.transformVector(v);
    }

    decompose()
    {
        var args;
        var centerPoint;
        
        if (args = Utility.args(arguments)) {
            centerPoint = new Point(0, 0);
        } else if (args = Utility.args(arguments, ["centerPoint", Point])) {
            centerPoint = args.centerPoint;
        } else {
            throw "Invalid arguments for the decompose() method";
        }

        return new TransformationDecomposition(this.matrix, centerPoint);
    }
}

class TransformationDecomposition
{
    constructor(matrix, centerPoint)
    {
        this.decomposition = this.decomposeTransformationInOrigin(matrix);
    }

    decomposeTransformationInOrigin(matrix)
    {
        var decomposition = [];
        var origin = Point.origin();
        var v = origin.vectorTo(matrix.transformPoint(origin));
        if (!v.isZero()) {
            decomposition.push({"type": "translate", "vector": v});
        }
        matrix = MatrixGenerator.translate(v.mul(-1)).mul(matrix);

        var b1 = new Vector(1, 0);
        var b2 = new Vector(0, 1);

        var b1x = matrix.transformVector(b1);

        if (b1x.isZero()) {
            var b2x = matrix.transformVector(b2);
            if (b2x.isZero()) {
                decomposition.push({"type": "scale", "a": 0, "b": 0});
            } else {
                var angle = b2.angleTo(b2x);
                if (!angle.isZero()) {
                    decomposition.push({"type": "rotate", "angle": angle, "center": Point.origin()});
                }
                matrix = MatrixGenerator.rotate(angle.mul(-1), null).mul(matrix);
                var b = b2x.mul(b2);
                decomposition.push({"type": "scale", "a" : 0, "b": b});
            }
        } else {
            var angle = b1.angleTo(b1x);
            if (!angle.isZero()) {
                decomposition.push({"type": "rotate", "angle": angle, "center": Point.origin()})
            }
            matrix = MatrixGenerator.rotate(angle.mul(-1), null).mul(matrix);
            var b2x = matrix.transformVector(b2);
            if (b2x.isZero()) {
                var a = b1.mul(matrix.transformVector(b1));
                decomposition.push({"type": "scale", "a" : a, "b": 0});
            } else {
                var angle2 = b2x.angleTo(b2);
                if (!angle2.isZero()) {
                    decomposition.push({"type": "skewX", "angle": angle2});
                }
                matrix = MatrixGenerator.skewX(angle2.mul(-1), null).mul(matrix);

                var a = b1.mul(matrix.transformVector(b1));
                var b = b2.mul(matrix.transformVector(b2));

                if (!ZeroTest.isEqual(a, 1) || !ZeroTest.isEqual(b, 1)) {
                    decomposition.push({"type": "scale", "a": a, "b": b});
                }
            }
        }
        return decomposition;
    }

    toString()
    {
        var string = '';
        for (var i = 0; i < this.decomposition.length; i++) {
            var operation = this.decomposition[i];
            var args = [];
            switch (operation.type) {
            case 'scale':
                if(ZeroTest.isEqual(operation.a, operation.b)) {
                    args.push(operation.a);
                } else {
                    args.push(operation.a);
                    args.push(operation.b);
                }
                break;
            case 'rotate':
                args.push(operation.angle.deg());
                if (!operation.center.isOrigin()) {
                    args.push(operation.center.x);
                    args.push(operation.center.y);
                }
                break;
            case 'translate':
                args.push(operation.vector.x);
                args.push(operation.vector.y);
                break;
            case 'skewX':
                args.push(operation.angle.deg());
                break;
            case 'skewY':
                args.push(operation.angle.deg());
                break;
            default:
                throw "This should never happen.";
            }
            if (string != '') {
                string += ' ';
            }
            string += operation.type;
            string += '(';
            for (var j = 0; j < args.length; j++) {
                if (j > 0) {
                    string += ' ';
                }
                string += args[j];
            }
            string += ')';
        }
        return string;
    }
}

class MatrixGenerator
{
    static translate(v)
    {
        return new TransformationMatrix(1, 0, 0, 1, v.x, v.y);
    }

    static rotate(angle, center)
    {
        var tr = new TransformationMatrix(angle.cos(), angle.sin(), -angle.sin(), angle.cos(), 0, 0);

        return this._moveCenter(tr, center);
    }

    static rotateInv(angle, center)
    {
        var tr = new TransformationMatrix(angle.cos(), -angle.sin(), angle.sin(), angle.cos(), 0, 0);
        
        return this._moveCenter(tr, center);
    }

    static scale(a, b, center)
    {
        var tr = new TransformationMatrix(a, 0, 0, b, 0, 0);

        return this._moveCenter(tr, center);
    }

    static scaleInv(a, b, center)
    {
        var tr = new TransformationMatrix(1/a, 0, 0, 1/b, 0, 0);

        return this._moveCenter(tr, center);
    }

    static skewX(angle, center)
    {
        var tr = new TransformationMatrix(1, 0, angle.tan(), 1, 0, 0);

        return this._moveCenter(tr, center);
    }

    static skewXInv(angle, center)
    {
        var tr = new TransformationMatrix(1, 0, -angle.tan(), 1, 0, 0);

        return this._moveCenter(tr, center);
    }

    static skewY(angle, center)
    {
        var tr = new TransformationMatrix(1, angle.tan(), 0, 1, 0, 0);

        return this._moveCenter(tr, center);
    }

    static skewYInv(angle, center)
    {
        var tr = new TransformationMatrix(1, angle.tan(), 0, 1, 0, 0);

        return this._moveCenter(tr, center);
    }

    static _moveCenter(m, center)
    {
        if (center !== null) {
            var v = Point.origin().vectorTo(center);
            if (!v.isZero()) {
                var t1 = this.translate(v);
                var t2 = this.translate(v.mul(-1));
                m = t1.mul(m).mul(t2);
            }
        }
        return m;
    }

}


/*
export default function Transformation(center, angle, translation)
{
    this.center = center;
    this.angle = angle;
    this.translation = translation;
}

Transformation.prototype.compose = function (t2)
{
    var center = this.center;
    var angle = this.angle.add(t2.angle);
    var cdiff = t2.center.vectorTo(this.center);
    var translation = cdiff.rot(t2.angle).sub(cdiff).add(this.translation.rot(t2.angle)).add(t2.translation);

    return new Transformation(center, angle, translation);
}

Transformation.prototype.inv = function ()
{
    var center = this.center;
    var angle = this.angle.mul(-1);
    var translation = this.translation.rot(this.angle.mul(-1)).mul(-1);

    return new Transformation(center, angle, translation);
}

Transformation.prototype.transformPoint = function (p)
{
    return this.center.rot(p, this.angle).addVector(this.translation);
}

Transformation.prototype.inverseTransformPoint = function (p)
{
    return this.center.rot(p.addVector(this.translation.mul(-1)), this.angle.mul(-1));
}

Transformation.prototype.pivotIn = function (c)
{
    return Transformation.rotation(c, Angle.zero()).compose(this);
}

Transformation.prototype.toString = function ()
{
    return "translate("+this.translation.x.toFixed(5)+","+this.translation.y.toFixed(5)+") rotate("+this.angle.deg().toFixed(5)+","+this.center.x.toFixed(5)+","+this.center.y.toFixed(5)+")";
}

Transformation.prototype.transformation = function ()
{
    return this;
}

Transformation.prototype.getPivot = function ()
{
    return this.center;
}

Transformation.prototype.getAngle = function ()
{
    return this.angle;
}

Transformation.prototype.getTranslation = function ()
{
    return this.translation;
}

Transformation.prototype.copy = function(center, angle, translation)
{
    return new Transformation(this.center, this.angle, this.translation);
}

Transformation._atomic = function(name, args)
{
    switch (name) {
    case 'rotate':
        if (args.length == 1) {
            args.push(0);
            args.push(0);
        }
        if (args.length != 3) {
            throw "rotate needs to have 1 or 3 arguments";
        }
        var angle = Angle.inDegrees(args[0]);
        var center = new Point(args[1], args[2]);
        return Transformation.rotation(center, angle);
    case 'translate':
        if (args.length != 2) {
            throw "translate needs to have 2 arguments";
        }
        var v = new Vector(args[0], args[1]);
        return Transformation.translation(v);
    default:
        throw "unknown atomic transformation: "+name;
    }
}


Transformation.fromString = function(str)
{
    str = str.trim();
    var transformation = Transformation.zero();
    while (str != "") {
        var match = str.match(/^([a-z]+)\s*\(([^\)]*)\)\s*(.*)/);
        if (!match) {
            throw "not a transformation";
        }

        var t = match[1];
        var args = match[2].split(/\s*,\s{0,}/); //{0,} is here instead of * to be able to comment out
        str = match[3];

        var argsFinal = [];
        for (var i in args) {
            argsFinal.push(parseFloat(args[i].trim()));
        }

        transformation = Transformation._atomic(t, argsFinal).compose(transformation);
    }
    //TODO implement

    return transformation;
}

Transformation.rotation = function (center, angle)
{
    return new Transformation(center, angle, Vector.zero());
}

Transformation.zero = function()
{
    return new Transformation(Point.center(), Angle.zero(), Vector.zero());
}

Transformation.translation = function (v)
{
    return new Transformation(Point.center(), Angle.zero(), v);
}
*/

