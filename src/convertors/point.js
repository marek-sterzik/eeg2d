import Convertor from "./convertor.js";
import Point from "../point.js";

export default class PointConvertor extends Convertor
{
    static getObjectClass()
    {
        return Point;
    }

    static parseDefault(string, convertorArgs)
    {
        return new Point(1, 1);
    }

    static toStringDefault(vector, convertorArgs)
    {
        return "[1, 1]";
    }

    static getCustomParserKey()
    {
        return 'pointParser';
    }

    static getCustomToStringKey()
    {
        return 'pointToString';
    }
}
