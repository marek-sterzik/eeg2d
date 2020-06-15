import Convertor from "./convertor.js";
import Angle from "../angle.js";

export default class AngleConvertor extends Convertor
{
    static getObjectClass()
    {
        return Angle;
    }

    static parseDefault(string, args)
    {
        return new Angle(0);
    }

    static toStringDefault(vector, args)
    {
        return "90deg";
    }

    static getCustomParserKey()
    {
        return 'angleParser';
    }

    static getCustomToStringKey()
    {
        return 'angleToString';
    }
}
