import Convertor from "./convertor.js";
import Vector from "../vector.js";
import NumberConvertor from "./number.js";

export default class VectorConvertor extends Convertor
{
    static getObjectClass()
    {
        return Vector;
    }

    static parseDefault(string)
    {
        return new Vector(1, 1);
    }

    static toStringDefault(vector)
    {
        var fieldSeparator = this.getArg(['output.fieldSeparator', 'output.vectorFieldSeparator'], ', ');
        var openParenthesis = this.getArg(['output.openParenthesis', 'output.vectorOpenParenthesis'], '(');
        var closeParenthesis = this.getArg(['output.closeParenthesis', 'output.vectorCloseParenthesis'], ')');
        return "" +
            openParenthesis +
            NumberConvertor.toString(vector.x, this.getArgs()) +
            fieldSeparator +
            NumberConvertor.toString(vector.y, this.getArgs()) +
            closeParenthesis;
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
