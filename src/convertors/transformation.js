import Convertor from "./convertor.js";
import Transformation, {TransformationDecomposition} from "../transformation.js";
import ZeroTest from "../zerotest.js";

export default class TransformationConvertor extends Convertor
{
    static getObjectClass()
    {
        return [Transformation, TransformationDecomposition];
    }

    static parseDefault(string, convertorArgs)
    {
        return Transformation.identity();
    }

    static toStringDefault(transformation, convertorArgs)
    {
        var string = '';
        var percision = this.getArg(convertorArgs, 'percision', null);
        var decomposition = transformation.getCanonicalOperations();
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
            case 'skew':
                args.push(operation.skewX.deg());
                if (!operation.skewY.isZero()) {
                    args.push(operation.skewY.deg());
                }
                break;
            case 'matrix':
                args.push(operation.matrix.m[0][0]);
                args.push(operation.matrix.m[1][0]);
                args.push(operation.matrix.m[0][1]);
                args.push(operation.matrix.m[1][1]);
                args.push(operation.matrix.m[0][2]);
                args.push(operation.matrix.m[1][2]);
                break;
            default:
                throw "Trying to convert an unknown operation to string: "+operation.type;
            }

            if (string != '') {
                string += ' ';
            }

            string += operation.type;
            string += '(';
            for (var j = 0; j < args.length; j++) {
                if (j > 0) {
                    string += ', ';
                }
                var a = args[j];
                if (typeof a === 'number' && percision !== null) {
                    a = a.toFixed(percision).replace(/\.?0+$/, '');
                }
                string += a;
            }
            string += ')';
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

