import assert from "../assert/assert.js";

import {Vector, StringConvertor} from "../../src/eeg2d.js";


const toStringSingleTest = (x, y, result, convertorParams = undefined) => {
    var vector = new Vector(x, y)
    assert.equal(vector.toString(convertorParams), result)
}

const parseSingleTest = (source, result, convertorParams = undefined) => {
    var convertor = StringConvertor.get(convertorParams)
    var vector;
    try {
        vector = convertor.parseVector(source)
        vector = [vector.x, vector.y]
    } catch (err) {
        vector = null
    }
    assert.deepStrictEqual(vector, result)
}


const toString = () => {
    toStringSingleTest(1, 2, '(1, 2)')
    toStringSingleTest(1, 2, '(1:2)', {'vector.output.delimeter': ':'})
    toStringSingleTest(1, 2, '<1, 2>', {'vector.output.parenthesis': ['<', '>']})
    toStringSingleTest(1.00001, 2.00001, '(1, 2)', {'number.output.precision': 4})
    toStringSingleTest(1.00001, 2.00001, '(1.00001, 2.00001)', {'number.output.precision': 5})
    toStringSingleTest(1, 2, '(1.0000, 2.0000)', {'number.output.precision': 4, 'number.output.outputZeroTrailingDecimals': true})
    toStringSingleTest(1, 2, 'Vector(1, 2)', {'fn.vector.toString': (vector) => "Vector("+vector.x+", "+vector.y+")"})
};

const parse = () => {
    parseSingleTest("[1, 2)", [1, 2])
    parseSingleTest("(1,2)", [1, 2])
    parseSingleTest("(1 2)", [1, 2])
    parseSingleTest("(1 2)", [1, 2])
    parseSingleTest("1 2", [1, 2])
    parseSingleTest("1, 2", [1, 2])
    parseSingleTest("  1,    2  ", [1, 2])
    parseSingleTest("<1,2>", null)
    parseSingleTest("<1,2>", [1, 2], {"vector.input.parenthesis": ['<', '>']})
    parseSingleTest("<<<1,2>>", null, {"vector.input.parenthesis": ['<', '>']})
    parseSingleTest("<<<1,2>>", [1, 2], {"vector.input.parenthesis": [/\<+/, /\>+/]})
    parseSingleTest("1:2", [1, 2], {"vector.input.delimeter": ':'})
    parseSingleTest("1::2", null, {"vector.input.delimeter": ':'})
    parseSingleTest("1::2", [1, 2], {"vector.input.delimeter": /:+/})
    parseSingleTest("xxxx1,x2xxx", null)
    parseSingleTest("xxxx1,x2xxx", [1, 2], {"vector.input.space": /x+/})
    parseSingleTest("xxxx1,x2xxx", null, {"vector.input.space": 'x'})
    parseSingleTest("x1,x2x", [1, 2], {"vector.input.space": 'x'})
    parseSingleTest("(x1x, x2x)", [1, 2], {"number.input.space": /x+/})
    parseSingleTest("x", [2, 3], {"fn.vector.parse": (str) => {assert.equal(str, "x"); return new Vector(2, 3);}})
}

export default {toString, parse}

