import Convertor from "./convertor.js";
import AngleConvertor from "./angle.js";
import NumberConvertor from "./number.js";

import Transformation, {TransformationDecomposition} from "../geometry/transformation.js";
import ZeroTest from "../utility/zerotest.js";

export default class TransformationConvertor extends Convertor
{
    static getName()
    {
        return 'transformation';
    }

    static accepts(object)
    {
        return (object instanceof Transformation) || (object instanceof TransformationDecomposition);
    }

    static parse(string, params, fnName)
    {
        return Transformation.identity();
    }

    static parseTransformationList(string)
    {
        var transformations = [];
        string = string.trim();

        while (string !== '') {
            var match = string.match(/^([a-zA-Z_][a-zA-Z_0-9]+)\s*(.*)/);

            if (!match) {
                return null;
            }

        }


        var transformation = Transformation.zero();
        while (str != "") {
            var match = str.match(/^([a-zA-Z]+)\s*\(([^\)]*)\)\s*(.*)/);
            if (!match) {
                throw "not a transformation";
            }

            var t = match[1];
            var args = match[2].split(/\s*,\s*/);
            str = match[3];

            var argsFinal = [];
            for (var i in args) {
                argsFinal.push(parseFloat(args[i].trim()));
            }

            transformation = Transformation._atomic(t, argsFinal).compose(transformation);
        }
    }

    static toString(transformation, params, fnName)
    {
        var string = '';
        
        var transformationDelimeter = params.get('transformation.output.transformationDelimeter');
        var fieldDelimeter = params.get('transformation.output.fieldDelimeter');
        var parenthesis = params.get('transformation.output.parenthesis');

        var decomposition = transformation.getCanonicalOperations();
        
        for (var i = 0; i < decomposition.length; i++) {
            var operation = decomposition[i];
            var args = [];
            switch (operation.type) {
            case 'scale':
                args.push(params.invokeToString(NumberConvertor, operation.scaleX));
                if(!ZeroTest.isEqual(operation.scaleX, operation.scaleY)) {
                    args.push(params.invokeToString(NumberConvertor, operation.scaleY));
                }
                break;
            case 'rotate':
                args.push(params.invokeToString(AngleConvertor, operation.angle));
                if (!operation.centerPoint.isOrigin()) {
                    args.push(params.invokeToString(NumberConvertor, operation.center.x));
                    args.push(params.invokeToString(NumberConvertor, operation.center.y));
                }
                break;
            case 'translate':
                args.push(params.invokeToString(NumberConvertor, operation.vector.x));
                args.push(params.invokeToString(NumberConvertor, operation.vector.y));
                break;
            case 'skewX':
                args.push(params.invokeToString(AngleConvertor, operation.angle));
                break;
            case 'skewY':
                args.push(params.invokeToString(AngleConvertor, operation.angle));
                break;
            case 'skew':
                args.push(params.invokeToString(AngleConvertor, operation.skewX));
                if (!operation.skewY.isZero()) {
                    args.push(params.invokeToString(AngleConvertor, operation.skewY));
                }
                break;
            case 'matrix':
                args.push(params.invokeToString(NumberConvertor, operation.matrix.m[0][0]));
                args.push(params.invokeToString(NumberConvertor, operation.matrix.m[1][0]));
                args.push(params.invokeToString(NumberConvertor, operation.matrix.m[0][1]));
                args.push(params.invokeToString(NumberConvertor, operation.matrix.m[1][1]));
                args.push(params.invokeToString(NumberConvertor, operation.matrix.m[0][2]));
                args.push(params.invokeToString(NumberConvertor, operation.matrix.m[1][2]));
                break;
            default:
                throw "Trying to convert an unknown operation to string: "+operation.type;
            }

            if (string != '') {
                string += transformationDelimeter;
            }

            string += operation.type + parenthesis[0] + args.join(fieldDelimeter) + parenthesis[1];
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
        var angle = Angle.deg(args[0]);
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


*/

