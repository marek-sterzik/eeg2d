import Convertor from "./convertor.js";
import AngleConvertor from "./angle.js";
import NumberConvertor from "./number.js";
import Transformation, {TransformationDecomposition} from "../transformation.js";
import ZeroTest from "../zerotest.js";

export default class TransformationConvertor extends Convertor
{
    static getObjectClass()
    {
        return [Transformation, TransformationDecomposition];
    }

    static parseDefault(string)
    {
        return Transformation.identity();
    }

    static toStringDefault(transformation)
    {
        var string = '';
        var transformationSeparator = this.getArg('output.transformationSeparator', ' ');
        var fieldSeparator = this.getArg(['output.fieldSeparator', 'output.transformationFieldSeparator'], ', ');
        var openParenthesis = this.getArg(['output.openParenthesis', 'output.transformationOpenParenthesis'], '(');
        var closeParenthesis = this.getArg(['output.closeParenthesis', 'output.transformationCloseParenthesis'], ')');
        var decomposition = transformation.getCanonicalOperations();
        for (var i = 0; i < decomposition.length; i++) {
            var operation = decomposition[i];
            var args = [];
            switch (operation.type) {
            case 'scale':
                if(ZeroTest.isEqual(operation.scaleX, operation.scaleY)) {
                    args.push(NumberConvertor.toString(operation.scaleX, this.getArgs()));
                } else {
                    args.push(NumberConvertor.toString(operation.scaleX, this.getArgs()));
                    args.push(NumberConvertor.toString(operation.scaleY, this.getArgs()));
                }
                break;
            case 'rotate':
                args.push(AngleConvertor.toString(operation.angle, this.getArgs()));
                if (!operation.centerPoint.isOrigin()) {
                    args.push(NumberConvertor.toString(operation.center.x, this.getArgs()));
                    args.push(NumberConvertor.toString(operation.center.y, this.getArgs()));
                }
                break;
            case 'translate':
                args.push(NumberConvertor.toString(operation.vector.x, this.getArgs()));
                args.push(NumberConvertor.toString(operation.vector.y, this.getArgs()));
                break;
            case 'skewX':
                args.push(AngleConvertor.toString(operation.angle, this.getArgs()));
                break;
            case 'skewY':
                args.push(AngleConvertor.toString(operation.angle, this.getArgs()));
                break;
            case 'skew':
                args.push(AngleConvertor.toString(operation.skewX, this.getArgs()));
                if (!operation.skewY.isZero()) {
                    args.push(AngleConvertor.toString(operation.skewY, this.getArgs()));
                }
                break;
            case 'matrix':
                args.push(NumberConvertor.toString(operation.matrix.m[0][0], this.getArgs()));
                args.push(NumberConvertor.toString(operation.matrix.m[1][0], this.getArgs()));
                args.push(NumberConvertor.toString(operation.matrix.m[0][1], this.getArgs()));
                args.push(NumberConvertor.toString(operation.matrix.m[1][1], this.getArgs()));
                args.push(NumberConvertor.toString(operation.matrix.m[0][2], this.getArgs()));
                args.push(NumberConvertor.toString(operation.matrix.m[1][2], this.getArgs()));
                break;
            default:
                throw "Trying to convert an unknown operation to string: "+operation.type;
            }

            if (string != '') {
                string += transformationSeparator;
            }

            string += operation.type;
            string += openParenthesis;
            string += args.join(fieldSeparator);
            string += closeParenthesis;
        }
        return string;
    }

    static getCustomParserKey()
    {
        return 'transformationParser';
    }

    static getCustomToStringKey()
    {
        return 'transformationToString';
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

*/

