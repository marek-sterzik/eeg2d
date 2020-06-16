import Convertor from "./convertor.js";

export default class NumberConvertor extends Convertor
{
    static getName()
    {
        return 'number';
    }

    static accepts(object)
    {
        return (typeof object === 'number');
    }

    static parse(string, params, fnName)
    {
        return 0;
    }

    static toString(number, params, fnName)
    {
        var percision = params.get('number.output.percision');
        if (percision !== null) {
            number = number.toFixed(percision).replace(/\.?0+$/, '');
        }
        return "" + number;
    }
}

