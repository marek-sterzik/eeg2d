import Convertor from "./convertor.js";
import Vector from "../vector.js";

export default class VectorConvertor extends Convertor
{
    static getObjectClass()
    {
        return Vector;
    }

    static parseDefault(string, args)
    {
        return new Vector(1, 1);
    }

    static toStringDefault(vector, args)
    {
        return "(1, 1)";
    }

    static getCustomParserKey()
    {
        return 'vectorParser';
    }

    static getCustomToStringKey()
    {
        return 'vectorToString';
    }
}
