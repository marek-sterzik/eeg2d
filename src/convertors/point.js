import Convertor from "./convertor.js";
import Point from "../point.js";
import NumberConvertor from "./number.js";

export default class PointConvertor extends Convertor
{
    static getObjectClass()
    {
        return Point;
    }

    static parseDefault(string)
    {
        return new Point(1, 1);
    }

    static toStringDefault(point)
    {
        var fieldSeparator = this.getArg(['output.fieldSeparator', 'output.pointFieldSeparator'], ', ');
        var openParenthesis = this.getArg(['output.openParenthesis', 'output.pointOpenParenthesis'], '[');
        var closeParenthesis = this.getArg(['output.closeParenthesis', 'output.pointCloseParenthesis'], ']');
        return "" +
            openParenthesis +
            NumberConvertor.toString(point.x, this.getArgs()) +
            fieldSeparator +
            NumberConvertor.toString(point.y, this.getArgs()) +
            closeParenthesis;
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
