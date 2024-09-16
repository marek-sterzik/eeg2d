import Convertor from "./convertor.js"

import RegexpUtil from "../utility/regexp_util.js"

export default class NumberConvertor extends Convertor
{
    static getName = () => {
        return 'number'
    }

    static accepts = (object) => {
        return (typeof object === 'number')
    }

    static parse = (string, params, fnName) => {
        var space = new RegexpUtil(params.get('number.input.space'))
        
        string = space.trim(string)

        var number = Number(string)
        if (isNaN(number) && !isFinite(number)) {
            throw "Cannot parse number"
        }
        return number
    }

    static toString = (number, params, fnName) => {
        var precision = params.get('number.output.precision')
        if (precision !== null) {
            var outputZeros = params.get('number.output.outputZeroTrailingDecimals')
            number = number.toFixed(precision)
            if (!outputZeros) {
                number = number.replace(/\.?0+$/, '')
            }
        }
        return "" + number
    }
}

