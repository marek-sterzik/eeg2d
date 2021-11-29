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
    constructor(atomicTransformations)
    {
        this.atomicTransformations = [...atomicTransformations];

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

    static create = (...argList) => {
        var args;
        if (args = Args.args(argList, ["atomicTransformations", Array])) {
            for (var i = 0; i < args.atomicTransformations.length; i++) {
                if (!args.atomicTransformations[i] instanceof AtomicTransformation) {
                    throw "Cannot construct a transformation from given arguments";
                }
            }
            return new Transformation(args.atomicTransformations);
        } else if (args = Args.args(argList, ["transformation", Transformation])) {
            return args.transformation;
        } else if (args = Args.args(argList, "string:string")) {
            return StringConvertor.get().parseTransformation(args.string);
        } else if (args = Args.args(argList, ["matrix", TransformationMatrix])) {
           return Transformation.matrix(args.matrix);
        } else if (args = Args.args(argList, "a:number", "b:number", "c:number", "d:number", "e:number", "f:number")) {
            var matrix = new TransformationMatrix(args.a, args.b, args.c, args.d, args.e, args.f);
            return Transformation.matrix(matrix);
        } else {
            throw "Cannot construct a transformation from given arguments";
        }
    }

    static matrix = (...argList) => {
        var args;
        var matrix;
        if (args = Args.args(argList, ["matrix", TransformationMatrix])) {
            matrix = args.matrix
        } else if (args = Args.args(argList, "a:number", "b:number", "c:number", "d:number", "e:number", "f:number")) {
            matrix = new TransformationMatrix(args.a, args.b, args.c, args.d, args.e, args.f);
        } else {
            throw "Cannot construct a matrix transformation from the given arguments";
        }

        var at = AtomicTransformation.instantiate({"type": "matrix", "matrix": matrix});
        return new Transformation([at]);
    }

    static translate = (...argList) => {
        var args;
        var v;
        if (args = Args.args(argList, ["v", Vector])) {
            v = args.v
        } else if (args = Args.args(argList, "x:number", ["y", "number", "default", 0])) {
            v = new Vector(args.x, args.y);
        } else {
            throw "Cannot construct a translation transformation from the given arguments";
        }

        var at = AtomicTransformation.instantiate({"type": "translate", "vector": v});
        return new Transformation([at]);
    }

    static rotate = (...argList) => {
        var args;
        var angle, center;
        if (args = Args.args(argList, ["angle", Angle], ["center", Point, "default", null])) {
            angle = args.angle;
            center = args.center;
        } else if (args = Args.args(argList, ["angle", Angle], "cx:number", ["cy", "number", "default", 0])) {
            angle = args.angle;
            center = new Point(args.cx, args.cy);
        } else if (args = Args.args(argList, "angle:number", ["center", Point, "default", null])) {
            angle = Angle.create(args.angle);
            center = args.center;
        } else if (args = Args.args(argList, "angle:number", "cx:number", ["cy", "number", "default", 0])) {
            angle = Angle.create(args.angle);
            center = new Point(args.cx, args.cy);
        } else {
            throw "Cannot construct a rotation transformation from the given arguments";
        }

        if (center === null) {
            center = Point.origin();
        }

        var at = AtomicTransformation.instantiate({"type": "rotate", "centerPoint": center, "angle": angle});
        return new Transformation([at]);
    }

    static scale = (...argList) => {
        var args;
        var a, b, center;
        if (args = Args.args(argList, "a:number", ["b", "number", "default", null], ["center", Point, "default", null])) {
            a = args.a;
            b = (args.b === null) ? args.a : args.b;
            center = args.center;
        } else if (args = Args.args(argList, "a:number", ["center", Point, "default", null])) {
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
        return new Transformation([at]);
    }

    static skewX = (...argList) => {
        var args;
        var angle, center;
        if (args = Args.args(argList, "angle:number", ["center", Point, "default", null])) {
            angle = new Angle(args.angle);
            center = args.center;
        } else if (args = Args.args(argList, ["angle", Angle], ["center", Point, "default", null])) {
            angle = args.angle;
            center = args.center;
        } else {
            throw "Cannot construct a skewX transformation from the given arguments";
        }

        if (center === null) {
            center = Point.origin();
        }

        var at = AtomicTransformation.instantiate({"type": "skewX", "centerPoint": center, "skewX": angle});
        return new Transformation([at]);
    }

    static skewY = (...argList) => {
        var args;
        var angle, center;
        if (args = Args.args(argList, "angle:number", ["center", Point, "default", null])) {
            angle = new Angle(args.angle);
            center = args.center;
        } else if (args = Args.args(argList, ["angle", Angle], ["center", Point, "default", null])) {
            angle = args.angle;
            center = args.center;
        } else {
            throw "Cannot construct a skewY transformation from the given arguments";
        }

        if (center === null) {
            center = Point.origin();
        }

        var at = AtomicTransformation.instantiate({"type": "skewY", "centerPoint": center, "skewY": angle});
        return new Transformation([at]);
    }

    static skew = (...argList) => {
        var args;
        var skewX, skewY, center;
        if (args = Args.args(argList, ["skewX", Angle], ["skewY", Angle, "default", null], ["center", Point, "default", null])) {
            skewX = args.skewX;
            skewY = args.skewY;
            center = args.center;
        } else if (args = Args.args(argList, "skewX:number", ["skewY", "number", "default", 0], ["center", Point, "default", null])) {
            skewX = new Angle(args.skewX);
            skewY = new Angle(args.skewY);
            center = args.center;
        } else if (args = Args.args(argList, ["skewX", Angle], ["center", Point, "default", null])) {
            skewX = args.skewX;
            skewY = Angle.zero();
            center = args.center;
        } else if (args = Args.args(argList, "skewX:number", ["center", Point, "default", null])) {
            skewX = new Angle(args.skewX);
            skewY = Angle.zero();
            center = args.center;
        } else {
            throw "Cannot construct a skew transformation from the given arguments";
        }

        if (center === null) {
            center = Point.origin();
        }

        if (skewY === null) {
            skewY = Angle.zero();
        }

        var at = AtomicTransformation.instantiate({"type": "skew", "centerPoint": center, "skewX": skewX, "skewY": skewY});
        return new Transformation([at]);
    }

    static identity = () => {
        return new Transformation([]);
    }

    getAtomicTransformations = () => {
        return this.atomicTransformations;
    }

    getMatrix = () => {
        return this.matrix;
    }

    compose = (t2) => {
        return Transformation.matrix(this.getMatrix().mul(t2.getMatrix()));
    }

    concat = (t2) => {
        return new Transformation(this.atomicTransformations.concat(t2.atomicTransformations))
    }

    join = (t2) => {
        return new Transformation(this.atomicTransformations.concat(t2.atomicTransformations))
    }

    flatten = () => {
        return Transformation.matrix(this.getMatrix());
    }

    inv = () => {
        return Transformation.matrix(this.getMatrix().inv())
    }

    transformPoint = (p) => {
        return this.getMatrix().transformPoint(p);
    }

    transformVector = (v) => {
        return this.getMatrix().transformVector(v);
    }

    transform = (pv) => {
        if (pv instanceof Point) {
            return this.transformPoint(pv);
        }
        if (pv instanceof Vector) {
            return this.transformVector(pv);
        }

        throw "Invalid argument"
    }

    decompose = (...argList) => {
        var decomposer = new TransformationDecomposer();
        decomposer.setParams.apply(decomposer, argList);
        var atomicOperations = decomposer.decompose(this.getMatrix()).map(op => AtomicTransformation.instantiate(op));

        return new Transformation(atomicOperations);
    }

    canonize = () => {
        var canonizedOperations = [];
        var empty = true;
        for(var i = 0; i < this.atomicTransformations.length; i++) {
            var co = this.atomicTransformations[i].getCanonizedTransformations();
            for (var j = 0; j < co.length; j++) {
                if (!co[j].isIdentity()) {
                    if (empty) {
                        canonizedOperations.push(co[j]);
                        empty = false;
                    } else {
                        var mergedOp = canonizedOperations[canonizedOperations.length - 1].canonicalMerge(co[j]);
                        if (mergedOp !== null) {
                            if (mergedOp.isIdentity()) {
                                canonizedOperations.pop();
                            } else {
                                canonizedOperations[canonizedOperations.length - 1] = mergedOp;
                            }
                        } else {
                            canonizedOperations.push(co[j]);
                        }
                    }
                }
            }
        }

        if (empty) {
            canonizedOperations.push(AtomicTransformation.instantiate({"type": "translate", "vector": Vector.zero()}));
        }

        return new Transformation(canonizedOperations);
    }

    toString = (...argList) => {
        return StringConvertor.get.apply(StringConvertor, argList).transformationToString(this);
    }
}
