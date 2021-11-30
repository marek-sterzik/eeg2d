import assert from "../assert/assert.js";

import {Point, StringConvertor} from "../../src/eeg2d.js";


const toStringSingleTest = (x, y, result, convertorParams = undefined) => {
    var point = new Point(x, y)
    assert.equal(point.toString(convertorParams), result)
}

const parseSingleTest = (source, result, convertorParams = undefined) => {
    var convertor = StringConvertor.get(convertorParams)
    var point;
    try {
        point = convertor.parsePoint(source)
        point = [point.x, point.y]
    } catch (err) {
        point = null
    }
    assert.deepStrictEqual(point, result)
}


const toString = () => {
    toStringSingleTest(1, 2, '[1, 2]')
    toStringSingleTest(1, 2, '[1:2]', {'point.output.delimeter': ':'})
    toStringSingleTest(1, 2, '<1, 2>', {'point.output.parenthesis': ['<', '>']})
    toStringSingleTest(1.00001, 2.00001, '[1, 2]', {'number.output.precision': 4})
    toStringSingleTest(1.00001, 2.00001, '[1.00001, 2.00001]', {'number.output.precision': 5})
    toStringSingleTest(1, 2, '[1.0000, 2.0000]', {'number.output.precision': 4, 'number.output.outputZeroTrailingDecimals': true})
    toStringSingleTest(1, 2, 'Point(1, 2)', {'fn.point.toString': (point) => "Point("+point.x+", "+point.y+")"})
};

const parse = () => {
    parseSingleTest("[1, 2]", [1, 2])
    parseSingleTest("[1,2]", [1, 2])
    parseSingleTest("[1 2]", [1, 2])
    parseSingleTest("(1 2)", [1, 2])
    parseSingleTest("1 2", [1, 2])
    parseSingleTest("1, 2", [1, 2])
    parseSingleTest("  1,    2  ", [1, 2])
    parseSingleTest("<1,2>", null)
    parseSingleTest("<1,2>", [1, 2], {"point.input.parenthesis": ['<', '>']})
    parseSingleTest("<<<1,2>>", null, {"point.input.parenthesis": ['<', '>']})
    parseSingleTest("<<<1,2>>", [1, 2], {"point.input.parenthesis": [/\<+/, /\>+/]})
    parseSingleTest("1:2", [1, 2], {"point.input.delimeter": ':'})
    parseSingleTest("1::2", null, {"point.input.delimeter": ':'})
    parseSingleTest("1::2", [1, 2], {"point.input.delimeter": /:+/})
    parseSingleTest("xxxx1,x2xxx", null)
    parseSingleTest("xxxx1,x2xxx", [1, 2], {"point.input.space": /x+/})
    parseSingleTest("xxxx1,x2xxx", null, {"point.input.space": 'x'})
    parseSingleTest("x1,x2x", [1, 2], {"point.input.space": 'x'})
    parseSingleTest("[x1x, x2x]", [1, 2], {"number.input.space": /x+/})
    parseSingleTest("x", [2, 3], {"fn.point.parse": (str) => {assert.equal(str, "x"); return new Point(2, 3);}})
}

export default {toString, parse}

