import Args from "../utility/args.js";
import ZeroTest from "../utility/zerotest.js";
import StringConvertor from "../utility/string_convertor.js";
import AtomicTransformation from "../utility/atomic_transformation.js";

import TransformationMatrix from "../math/matrix.js";
import TransformationDecomposer from "../math/transformation_decomposer.js";
import MatrixGenerator from "../math/matrix_generator.js";

import Vector from "./vector.js";
import Point from "./point.js";
import Angle from "./angle.js";

export default class Transformation
{
    constructor()
    {
        var args;
        if (args = Args.args(arguments, ["at", AtomicTransformation])) {
            this.atomicTransformations = [args.at];
        } else if (args = Args.args(arguments, ["atomicTransformations", Array])) {
            for (var i = 0; i < args.atomicTransformations.length; i++) {
                if (!args.atomicTransformations[i] instanceof AtomicTransformation) {
                    throw "Cannot construct a transformation from given arguments";
                }
            }
            this.atomicTransformations = args.atomicTransformations;
        } else if (args = Args.args(arguments, ["transformation", Transformation])) {
            return args.transformation;
        } else if (args = Args.args(arguments, "string:string")) {
            return StringConvertor.get().parseTransformation(args.string);
        } else if (args = Args.args(arguments, ["matrix", TransformationMatrix])) {
           return Transformation.matrix(args.matrix);
        } else if (args = Args.args(arguments, "a:number", "b:number", "c:number", "d:number", "e:number", "f:number")) {
            var matrix = new TransformationMatrix(args.a, args.b, args.c, args.d, args.e, args.f);
            return Transformation.matrix(matrix);
        } else {
            throw "Cannot construct a transformation from given arguments";
        }

        if (this.atomicTransformations.length > 0) {
            this.matrix = this.atomicTransformations[0].getMatrix();
        } else {
            this.matrix = MatrixGenerator.identity();
        }

        for (var i = 1; i < this.atomicTransformations.length; i++) {
            this.matrix = this.matrix.mul(this.atomicTransformations[i].getMatrix());
        }

        Object.freeze(this);
        Object.freeze(this.atomicTransformations);
    }

    static matrix()
    {
        var args;
        var matrix;
        if (args = Args.args(arguments, ["matrix", TransformationMatrix])) {
            matrix = args.matrix
        } else if (args = Args.args(arguments, "a:number", "b:number", "c:number", "d:number", "e:number", "f:number")) {
            matrix = new TransformationMatrix(args.a, args.b, args.c, args.d, args.e, args.f);
        } else {
            throw "Cannot construct a matrix transformation from the given arguments";
        }

        var at = AtomicTransformation.instantiate({"type": "matrix", "matrix": matrix});
        return new Transformation(at);
    }

    static translate()
    {
        var args;
        var v;
        if (args = Args.args(arguments, ["v", Vector])) {
            v = args.v
        } else if (args = Args.args(arguments, "x:number", ["y", "number", "default", 0])) {
            v = new Vector(args.x, args.y);
        } else {
            throw "Cannot construct a translation transformation from the given arguments";
        }

        var at = AtomicTransformation.instantiate({"type": "translate", "vector": v});
        return new Transformation(at);
    }

    static rotate()
    {
        var args;
        var angle, center;
        if (args = Args.args(arguments, ["angle", Angle], ["center", Point, "default", null])) {
            angle = args.angle;
            center = args.center;
        } else if (args = Args.args(arguments, "angle:number", ["center", Point, "default", null])) {
            angle = new Angle(args.angle);
            center = args.center;
        } else {
            throw "Cannot construct a rotation transformation from the given arguments";
        }

        if (center === null) {
            center = Point.origin();
        }

        var at = AtomicTransformation.instantiate({"type": "rotate", "centerPoint": center, "angle": angle});
        return new Transformation(at);
    }

    static scale()
    {
        var args;
        var a, b, center;
        if (args = Args.args(arguments, "a:number", ["b", "number", "default", null], ["center", Point, "default", null])) {
            a = args.a;
            b = (args.b === null) ? args.a : args.b;
            center = args.center;
        } else if (args = Args.args(arguments, "a:number", ["center", Point, "default", null])) {
            a = args.a;
            b = args.a;
            center = args.center;
        } else {
            throw "Cannot construct a scale transformation from the given arguments";
        }

        if (center === null) {
            center = Point.origin();
        }

        var at = AtomicTransformation.instantiate({"type": "scale", "centerPoint": center, "scaleX": a, "scaleY": b});
        return new Transformation(at);
    }

    static skewX()
    {
        var args;
        var angle, center;
        if (args = Args.args(arguments, "angle:number", ["center", Point, "default", null])) {
            angle = new Angle(args.angle);
            center = args.center;
        } else if (args = Args.args(arguments, ["angle", Angle], ["center", Point, "default", null])) {
            angle = args.angle;
            center = args.center;
        } else {
            throw "Cannot construct a skewX matrix from the given arguments";
        }

        if (center === null) {
            center = Point.origin();
        }

        var at = AtomicTransformation.instantiate({"type": "skewX", "centerPoint": center, "skewX": angle});
        return new Transformation(at);
    }

    static skewY()
    {
        var args;
        var angle, center;
        if (args = Args.args(arguments, "angle:number", ["center", Point, "default", null])) {
            angle = new Angle(args.angle);
            center = args.center;
        } else if (args = Args.args(arguments, ["angle", Angle], ["center", Point, "default", null])) {
            angle = args.angle;
            center = args.center;
        } else {
            throw "Cannot construct a skewY matrix from the given arguments";
        }

        if (center === null) {
            center = Point.origin();
        }

        var at = AtomicTransformation.instantiate({"type": "skewY", "centerPoint": center, "skewY": angle});
        return new Transformation(at);
    }

    static skew()
    {
        var args;
        var skewX, skewY, center;
        if (args = Args.args(arguments, "skewX", ["skewY", "default", 0], ["center", Point, "default", null])) {
            skewX = new Angle(args.skewX);
            skewY = new Angle(args.skewY);
            center = args.center;
        } else {
            throw "Cannot construct a skew matrix from the given arguments";
        }

        if (center === null) {
            center = Point.origin();
        }

        var at = AtomicTransformation.instantiate({"type": "skew", "centerPoint": center, "skewX": skewX, "skewY": skewY});
        return new Transformation(at);
    }

    static identity()
    {
        return new Transformation([]);
    }

    getAtomicTransformations()
    {
        return this.atomicTransformations;
    }

    getMatrix()
    {
        return this.matrix;
    }

    compose(t2)
    {
        return Transformation.matrix(this.getMatrix().mul(t2.getMatrix()));
    }

    concat(t2)
    {
        return new Transformation(this.atomicTransformations.concat(t2.atomicTransformations))
    }

    inv()
    {
        return new Transformation.matrix(this.getMatrix().inv())
    }

    transformPoint(p)
    {
        return this.getMatrix().transformPoint(p);
    }

    transformVector(v)
    {
        return this.getMatrix().transformVector(v);
    }

    decompose()
    {
        var decomposer = new TransformationDecomposer();
        decomposer.setParams.apply(decomposer, arguments);
        var atomicOperations = decomposer.decompose(this.getMatrix()).map(function(op){
            return AtomicTransformation.instantiate(op);
        });

        return new Transformation(atomicOperations);
    }

    flatten()
    {
        return Transformation.matrix(this.getMatrix());
    }

    canonize()
    {
        return this;
    }

    interpolate(t2)
    {
    }

    toString()
    {
        return StringConvertor.get.apply(StringConvertor, arguments).transformationToString(this);
    }
}
