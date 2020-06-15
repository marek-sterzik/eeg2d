import Convertor from "./convertor.js";

export default class NumberConvertor extends Convertor
{
    static getObjectClass()
    {
        return 'number';
    }

    static parseDefault(string)
    {
        return 0;
    }

    static toStringDefault(number)
    {
        var percision = this.getArg('output.percision', null);
        if (percision !== null) {
            number = number.toFixed(percision).replace(/\.?0+$/, '');
        }
        return "" + number;
    }

    static getCustomParserKey()
    {
        return 'numberParser';
    }

    static getCustomToStringKey()
    {
        return 'numberToString';
    }
}

