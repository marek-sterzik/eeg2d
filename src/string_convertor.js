import VectorConvertor from "./convertors/vector.js";
import PointConvertor from "./convertors/point.js";
import AngleConvertor from "./convertors/angle.js";
import TransformationConvertor from "./convertors/transformation.js";

export default class StringConvertor
{
    static getDefault()
    {
        if (! (_defaultStringConvertor in this)) {
            this._defaultStringConvertor = new StringConvertor();
        }

        var defaultConvertor = this._defaultStringConvertor;

        if (arguments.length >= 1) {
            if (arguments.length >= 2) {
                throw "StringConvertor.getDefault() accepts exactly 0 or 1 arguments";
            }
            defaultConvertor = defaultConvertor.getModifiedConvertor.apply(defaultConvertor, arguments[0]);
        }

        return defaultConvertor;
    }

    static setDefault(stringConvertor)
    {
        this._defaultStringConvertor = stringConvertor;
    }

    constructor()
    {
        this.args = this._argsFromArguments(arguments);
    }

    getModifiedConvertor()
    {
        var args = this._argsFromArguments(arguments);
        return new StringConvertor(Object.assign({}, this.args, args));
    }

    _argsFromArguments(args)
    {
        return Object.assign({}, args[0]);
    }

    parseVector(string)
    {
        return VectorConvertor.parse(string, this.args);
    }

    vectorToString(vector)
    {
        return VectorConvertor.toString(vector, this.args);
    }

    parsePoint(string)
    {
        return PointConvertor.parse(string, this.args);
    }

    pointToString(point)
    {
        return PointConvertor.toString(point, this.args);
    }

    parseAngle(string)
    {
        return AngleConvertor.parse(string, this.args);
    }

    angleToString(angle)
    {
        return AngleConvertor.toString(angle, this.args);
    }

    parseTransformation(string)
    {
        return TransformationConvertor.parse(string, this.args);
    }

    transformationToString(transformation)
    {
        return TransformationConvertor.toString(transformation, this.args);
    }
}
