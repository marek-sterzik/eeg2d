import Utility from "./utility.js";
import Vector from "./vector.js";
import Point from "./point.js";
import Angle from "./angle.js";
import TransformationMatrix from "./matrix.js";
import ZeroTest from "./zerotest.js";

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
            throw "Cannot construct a skewX matrix from the given arguments";
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
            throw "Cannot construct a skewY matrix from the given arguments";
        }

        return new Transformation(MatrixGenerator.skewY(angle, center));
    }

    getTransformation()
    {
        return this;
    }

    _getCanonicalDecomposition(defaultCenterPoint)
    {
        return this.decompose(defaultCenterPoint);
    }

    compose(t2)
    {
        return new Transformation(this.matrix.mul(t2.getTransformation().matrix));
    }

    inv()
    {
        return new Transformation(this.matrix.inv())
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
        var centerPoint, mode;
        var origin = Point.origin();

        if (args = Utility.args(arguments, ["centerPoint", Point, "default", origin], ["mode", "string", "default", "skewX"])) {
            centerPoint = args.centerPoint;
            mode = args.mode;
        } else if (args = Utility.args(arguments, ["mode", "string", "default", "skewX"])) {
            centerPoint = origin;
            mode = args.mode;
        } else {
            throw "Invalid arguments for the decompose() method";
        }

        if (mode !== 'skewX' && mode !== 'skewY' && mode !== 'matrix') {
            throw "Invalid decomposition mode";
        }

        return new TransformationDecomposition(this, centerPoint, mode);
    }

    getOperations()
    {
        return [{"type": "matrix", "matrix": this.matrix}];
    }

    toString()
    {
        return TransformationOperationStringifier.operationsToString(this.getOperations());
    }

    interpolate(t2, x)
    {
        if (t2 instanceof TransformationDecomposition) {
            return this._getCanonicalDecomposition(t2.centerPoint).interpolate(t2, x);
        } else {
            return this._getCanonicalDecomposition(Point.origin()).interpolate(t2, x);
        }
    }
}

class TransformationDecomposition
{
    constructor(transformation, centerPoint, mode)
    {
        var matrix = transformation.matrix;

        var az = Angle.zero();
        this.centerPoint = centerPoint;
        this.skewX = az;
        this.skewY = az;
        this.scaleX = 1;
        this.scaleY = 1;
        this.rotation = az;
        this.translation = Vector.zero();
        this.matrix = null;
        this.transformation = transformation;

        //Calculate the whole decomposition
        var bx = new Vector(1, 0);
        var by = new Vector(0, 1);
        var bxImage, byImage;

        if (matrix.isRegular() || mode !== 'matrix') {
            //decompose skew part
            bxImage = matrix.transformVector(bx);
            byImage = matrix.transformVector(by);

            if (mode === 'skewX') {
                this.skewX = Angle.atan(bxImage.mul(byImage)/byImage.mul(byImage));
                matrix = matrix.mul(MatrixGenerator.skewX(this.skewX.mul(-1), centerPoint));
            } else {
                this.skewY = Angle.atan(bxImage.mul(byImage)/bxImage.mul(bxImage));
                matrix = matrix.mul(MatrixGenerator.skewY(this.skewY.mul(-1), centerPoint));
            }
            
            //decompose scale
            bxImage = matrix.transformVector(bx);
            byImage = matrix.transformVector(by);
            this.scaleX = bxImage.size();
            this.scaleY = byImage.size();

            //decompose flip
            var bxImageRot = bxImage.rot(Angle.inDegrees(90));
            if (bxImageRot.mul(byImage) < 0) {
                this.scaleY = -this.scaleY;
            }
            
            matrix = matrix.mul(MatrixGenerator.scale(1/this.scaleX, 1/this.scaleY, centerPoint));

            //decompose rotation
            bxImage = matrix.transformVector(bx);
            this.rotation = bx.angleTo(bxImage);
            
            matrix = matrix.mul(MatrixGenerator.rotate(this.rotation.mul(-1), centerPoint));

            //decompose translation
            this.translation = centerPoint.vectorTo(matrix.transformPoint(centerPoint));
        } else {
            this.matrix = matrix;
        }

        Object.freeze(this);
    }

    getOperations()
    {
        var decomposition = [];

        if (!this.translation.isZero()) {
            decomposition.push({"type": "translate", "vector": this.translation});
        }

        if (!this.rotation.isZero()) {
            decomposition.push({"type": "rotate", "angle": this.rotation, "centerPoint": this.centerPoint});
        }

        if (!ZeroTest.isEqual(this.scaleX, 1) || !ZeroTest.isEqual(this.scaleY, 1)) {
            decomposition.push({"type": "scale", "scaleX": this.scaleX, "scaleY": this.scaleY, "centerPoint": this.centerPoint});
        }

        if (!this.skewX.isZero()) {
            decomposition.push({"type": "skewX", "angle": this.skewX, "centerPoint": this.centerPoint});
        }

        if (!this.skewY.isZero()) {
            decomposition.push({"type": "skewY", "angle": this.skewY, "centerPoint": this.centerPoint});
        }

        if (this.matrix !== null) {
            decomposition.push({"type": "matrix", "matrix": this.matrix});
        }

        if (decomposition.length === 0) {
            decomposition.push({"type": "translate", "vector": Vector.zero()});
        }

        return decomposition;
    }

    toString()
    {
        return TransformationOperationStringifier.operationsToString(this.getOperations());
    }

    compose(t2)
    {
        return this.transformation.compose(t2);
    }

    decompose()
    {
        return this.transformation.decompose.apply(this.transformation, arguments);
    }

    transformPoint(p)
    {
        return this.transformation.transformPoint(p);
    }

    transformVector(v)
    {
        return this.transformation.transformVector(v);
    }

    inv()
    {
        return this.transformation.inv();
    }

    getTransformation()
    {
        return this.transformation;
    }

    _getCanonicalDecomposition(defaultCenterPoint)
    {
        return this;
    }

    interpolate(t2, x)
    {
        t2 = t2._getCanonicalDecomposition(this.centerPoint);
        //FIXME implement interpolation
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

    static scale(a, b, center)
    {
        var tr = new TransformationMatrix(a, 0, 0, b, 0, 0);

        return this._moveCenter(tr, center);
    }

    static skewX(angle, center)
    {
        var tr = new TransformationMatrix(1, angle.tan(), 0, 1, 0, 0);

        return this._moveCenter(tr, center);
    }

    static skewY(angle, center)
    {
        var tr = new TransformationMatrix(1, 0, angle.tan(), 1, 0, 0);

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

class TransformationOperationStringifier
{
    static getCanonicalOperations(decomposition)
    {
        var canonicalDecomposition = [];
        var translateVector = Vector.zero();
        var origin = Point.origin();

        for (var i = 0; i < decomposition.length; i++) {
            var operation = decomposition[i];
            if (operation.type === 'translate') {
                translateVector = translateVector.add(operation.vector);
            } else {
                var needsShift = (operation.type !== 'rotate' && operation.type !== 'matrix');
                var shiftVector;
                
                if (needsShift) {
                    shiftVector = origin.vectorTo(operation.centerPoint);
                    translateVector = translateVector.add(shiftVector);
                }
                
                if (!translateVector.isZero()) {
                    canonicalDecomposition.push({"type": "translate", "vector": translateVector});
                }
                
                var op2;
                
                if (needsShift) {
                    op2 = Object.assign({}, operation);
                    delete op2.centerPoint;
                } else {
                    op2 = operation;
                }

                canonicalDecomposition.push(op2);

                translateVector = Vector.zero();

                if (needsShift) {
                    translateVector = translateVector.sub(shiftVector);
                }
            }
        }

        if (!translateVector.isZero() || canonicalDecomposition.length === 0) {
                canonicalDecomposition.push({"type": "translate", "vector": translateVector});
        }

        return canonicalDecomposition;
    }

    static operationsToString(operations)
    {
        var string = '';
        var decomposition = this.getCanonicalOperations(operations);
        for (var i = 0; i < decomposition.length; i++) {
            var operation = decomposition[i];
            var args = [];
            switch (operation.type) {
            case 'scale':
                if(ZeroTest.isEqual(operation.scaleX, operation.scaleY)) {
                    args.push(operation.scaleX);
                } else {
                    args.push(operation.scaleX);
                    args.push(operation.scaleY);
                }
                break;
            case 'rotate':
                args.push(operation.angle.deg());
                if (!operation.centerPoint.isOrigin()) {
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

/*


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

