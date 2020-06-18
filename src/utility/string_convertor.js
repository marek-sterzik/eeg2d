import PointConvertor from "../convertors/point.js";
import VectorConvertor from "../convertors/vector.js";
import AngleConvertor from "../convertors/angle.js";
import TransformationConvertor from "../convertors/transformation.js";

import {StringConvertorDefaultParams, Reference} from "../string_convertor_default_params.js";


export default class StringConvertor
{
    static get()
    {
        var defaultConvertor = defaultStringConvertor;


        if (arguments.length >= 1) {
            var params = defaultConvertor.params.merge(arguments[0]);
            defaultConvertor = new StringConvertor(params);
        }

        return defaultConvertor;
    }

    static setDefault(stringConvertor)
    {
        var oldStringConvertor = defaultStringConvertor;

        if (stringConvertor === null) {
            stringConvertor = new StringConvertor();
        }
        defaultStringConvertor = stringConvertor;

        return oldStringConvertor;
    }

    setDefault()
    {
        StringConvertor.setDefault(this);
    }

    constructor(params)
    {
        if (params === undefined) {
            params = {};
        }
        if (! (params instanceof StringConvertorParams)) {
            params = new StringConvertorParams(params);
        }
        this.params = params;
    }

    parseVector(string)
    {
        return this.params.invokeParse(VectorConvertor, string);
    }

    vectorToString(vector)
    {
        return this.params.invokeToString(VectorConvertor, vector);
    }

    parsePoint(string)
    {
        return this.params.invokeParse(PointConvertor, string);
    }

    pointToString(point)
    {
        return this.params.invokeToString(PointConvertor, point);
    }

    parseAngle(string)
    {
        return this.params.invokeParse(AngleConvertor, string);
    }

    angleToString(angle)
    {
        return this.params.invokeToString(AngleConvertor, angle);
    }

    parseTransformation(string)
    {
        return this.params.invokeParse(TransformationConvertor, string);
    }

    transformationToString(transformation)
    {
        return this.params.invokeToString(TransformationConvertor, transformation);
    }
}

class StringConvertorParams
{
    constructor(params)
    {
        this._params = params;
    }

    merge(params)
    {
        return new StringConvertorParams(Object.assign({}, this._params, params));
    }

    invokeParse(convertor, string)
    {
        var fn = this._getInvokedFunction(convertor, 'parse');
        var object = fn(string);
        if (!convertor.accepts(object)) {
            throw "Parser created an object which is not accepted by the convertor";
        }
        return object;
    }

    invokeToString(convertor, object)
    {
        var fn = this._getInvokedFunction(convertor, 'toString');
        if (!convertor.accepts(object)) {
            throw "Convertor does not accept this object for toString conversion";
        }
        var string = fn(object);

        return string;
    }

    get(param)
    {
        return this._get(param);
    }

    _getInvokedFunction(convertor, operation)
    {
        var fnName = "fn." + convertor.getName() + "." + operation;
        var fn = this.get(fnName);
        var fnThis = null;
        var params = this;
        if (fn === null) {
            fn = convertor[operation];
            fnThis = convertor;
        }

        return function(object) {
            return fn.call(fnThis, object, params, fnName);
        };
    }


    _get(param)
    {
        if (param in this._params) {
            return this._params[param];
        }

        if (param in StringConvertorDefaultParams) {
            return StringConvertorDefaultParams[param];
        }

        return null;
    }
}

var defaultStringConvertor = new StringConvertor();

