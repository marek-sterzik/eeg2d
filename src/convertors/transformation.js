import Convertor from "./convertor.js";
import AngleConvertor from "./angle.js";
import NumberConvertor from "./number.js";

import Transformation from "../geometry/transformation.js";
import ZeroTest from "../utility/zerotest.js";
import RegexpUtil from "../utility/regexp_util.js"

export default class TransformationConvertor extends Convertor
{
    static getName()
    {
        return 'transformation';
    }

    static accepts(object)
    {
        return (object instanceof Transformation);
    }

    static parse(string, params, fnName)
    {
        console.log(string);
        var transformationList = this.parseTransformationList(string, params);

        if (transformationList === null) {
            throw "Cannot parse transformation";
        }

        this.convertTransformationArguments(transformationList, params);
        
        console.log(transformationList);
        return Transformation.identity();
    }

    static getConvertorDescriptors()
    {
        return {
            'scale': [NumberConvertor, NumberConvertor],
            'rotate': [AngleConvertor, NumberConvertor, NumberConvertor],
            'translate': [NumberConvertor, NumberConvertor],
            'skewX': [AngleConvertor],
            'skewY': [AngleConvertor],
            'skew': [AngleConvertor, AngleConvertor],
            'matrix': [NumberConvertor, NumberConvertor, NumberConvertor, NumberConvertor, NumberConvertor, NumberConvertor]
        };
    }

    static convertTransformationArguments(transformationList, params)
    {
        var convertors = this.getConvertorDescriptors();

        for (var i = 0; i < transformationList.length; i++) {
            var name = transformationList[i].name;
            var args = transformationList[i].args;
            if (!name in convertors) {
                throw "unknown transformation: " + name;
            }
            
            var argConvertors = convertors[name];

            if (args.length > argConvertors.length) {
                throw "too many arguments for transformation: " + name;
            }

            for (var j = 0; j < args.length; j++) {
                args[j] = params.invokeParse(argConvertors[j], args[j]);
            }
        }
    }

    static parseTransformationList(string, params)
    {
        var transformations = [];
        string = string.trim();

        var space = new RegexpUtil(params.get('transformation.input.space'));
        var identifier = new RegexpUtil(params.get('transformation.input.identifier'));
        var transformationDelimeter = new RegexpUtil(params.get('transformation.input.transformationDelimeter'));
        var fieldDelimeter = new RegexpUtil(params.get('transformation.input.fieldDelimeter'));
        var parenthesis = params.get('transformation.input.parenthesis').map(function(x) {return new RegexpUtil(x);});

        
        var first = true;
        var token;
        var ar;
        var record;
        while (string !== '') {
            record = {};
            if (!first) {
                ar = transformationDelimeter.split2(string);
                if (ar.length < 2) {
                    return null;
                }

                if (ar[0] !== '' && !space.matchAll(ar[0])) {
                    return null;
                }

                string = ar[1];
            }
            first = false;

            [token, string] = space.readToken(string);

            if (string === '') {
                break;
            }
            
            [record.name, string] = identifier.readToken(string);

            if (record.name === null) {
                return null;
            }

            [token, string] = space.readToken(string);

            [token, string] = parenthesis[0].readToken(string);

            if (token === null) {
                return null;
            }
            
            ar = parenthesis[1].split2(string);

            if (ar.length < 2) {
                return null;
            }

            record.args = this.parseTransformationArgs(ar[0], space, fieldDelimeter);
            string = ar[1];

            transformations.push(record);
        }

        return transformations;
    }

    static parseTransformationArgs(argString, space, fieldDelimeter)
    {
        var splitted = [];
        var ar = [argString];

        do {
            if (ar.length > 1) {
                splitted.push(space.trim(ar.shift()));
            }
            argString = space.trim(ar.shift());
            ar = fieldDelimeter.split2(argString);
        } while (ar.length > 1);
        
        splitted.push(space.trim(ar.shift()));

        return splitted;
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
