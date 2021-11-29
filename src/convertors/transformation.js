import Convertor from "./convertor.js";
import AngleConvertor from "./angle.js";
import NumberConvertor from "./number.js";

import Transformation from "../geometry/transformation.js";

import AtomicTransformation from "../utility/atomic_transformation.js";
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
        var transformationList = this.parseTransformationList(string, params);

        if (transformationList === null) {
            throw "Cannot parse transformation";
        }

        transformationList = transformationList.map((record) => {
            var atomicTransformationClass = AtomicTransformation.getAtomicTransformationClassByType(record.type);
            var argsConvertors;
            if (record.canonical) {
                argsConvertors = atomicTransformationClass.getArgsConvertors();
            } else {
                argsConvertors = atomicTransformationClass.getNonCanonicalArgsConvertors();
            }

            if (argsConvertors.length < record.args.length) {
                throw "too much arguments when parsing transformation: " + record.type;
            }

            var convertedArgs = [];
            for (var i = 0; i < record.args.length; i++) {
                convertedArgs.push(params.invokeParse(argsConvertors[i], record.args[i]));
            }

            var transformationDescriptor;
            if (record.canonical) {
                transformationDescriptor = atomicTransformationClass.argsToParams(convertedArgs);
            } else {
                transformationDescriptor = atomicTransformationClass.nonCanonicalArgsToParams(convertedArgs);
            }

            transformationDescriptor.type = record.type;

            return AtomicTransformation.instantiate(transformationDescriptor);
        });

        return new Transformation(transformationList);
    }

    static parseTransformationList(string, params)
    {
        var transformations = [];
        string = string.trim();

        var space = new RegexpUtil(params.get('transformation.input.space'));
        var identifier = new RegexpUtil(params.get('transformation.input.identifier'));
        var transformationDelimeter = new RegexpUtil(params.get('transformation.input.transformationDelimeter'));
        var fieldDelimeter = new RegexpUtil(params.get('transformation.input.fieldDelimeter'));
        var nonCanonicalSuffix = new RegexpUtil(params.get('transformation.input.nonCanonicalSuffix'));
        var parenthesis = params.get('transformation.input.parenthesis').map(x => new RegexpUtil(x));

        
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
            
            [record.type, string] = identifier.readToken(string);

            if (record.type === null) {
                return null;
            }

            [token, string] = space.readToken(string);

            [token, string] = nonCanonicalSuffix.readToken(string);

            if (token !== null) {
                record.canonical = false;
                [token, string] = space.readToken(string);
            } else {
                record.canonical = true;
            }

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

    static atomicTransformationToString(atomicTransformation, params)
    {
        var args, argsConvertors;
        
        var canonical = atomicTransformation.isCanonical();

        if (canonical) {
            args = atomicTransformation.getArgs();
            argsConvertors = atomicTransformation.getArgsConvertors();
        } else {
            args = atomicTransformation.getNonCanonicalArgs();
            argsConvertors = atomicTransformation.getNonCanonicalArgsConvertors();
        }

        var finalArgs = [];

        for (var i = 0; i < args.length; i++) {
            finalArgs.push(params.invokeToString(argsConvertors[i], args[i]));
        }

        var fieldDelimeter = params.get('transformation.output.fieldDelimeter');
        var parenthesis = params.get('transformation.output.parenthesis');
        var nonCanonicalSuffix = canonical ? '' : params.get('transformation.output.nonCanonicalSuffix');
        
        return atomicTransformation.getName() + nonCanonicalSuffix + parenthesis[0] + finalArgs.join(fieldDelimeter) + parenthesis[1];

    }

    static toString(transformation, params, fnName)
    {
        var THIS = this;
        if (params.get('transformation.output.convertToCanonicalForm')) {
            transformation = transformation.canonize();
        }
        return transformation
            .getAtomicTransformations()
            .map(at => THIS.atomicTransformationToString(at, params))
            .join(params.get('transformation.output.transformationDelimeter'));
    }
}
