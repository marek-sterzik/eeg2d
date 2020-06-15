import Convertor from "./convertor.js";
import Transformation from "../transformation.js";

export default class TransformationConvertor extends Convertor
{
    static getObjectClass()
    {
        return Transformation;
    }

    static parseDefault(string, args)
    {
        return Transformation.identity();
    }

    static toStringDefault(vector, args)
    {
        return "scale(1, 1)";
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

