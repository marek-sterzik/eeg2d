import assert from "../assert/assert.js";

import {Angle, StringConvertor} from "../../src/eeg2d.js";


const toStringSingleTest = (deg, result, convertorParams = undefined) => {
    var angle = Angle.deg(deg)
    assert.equal(angle.toString(convertorParams), result)
}

const parseSingleTest = (source, resultDeg, convertorParams = undefined) => {
    var convertor = StringConvertor.get(convertorParams)
    var angle;
    try {
        angle = convertor.parseAngle(source)
        angle = angle.deg()
    } catch (err) {
        angle = null
    }

    if (resultDeg === null) {
        assert.ok(angle === null)
    } else {
        assert.ok(angle !== null)
        assert.approxEqual(angle, resultDeg)
    }
}

const customUnits = {'deg': ['d', 'DG'], 'rad': ['r', 'RD'], 'grad': ['g', 'GR'], 'turn': ['t', 'TR']}

const toString = () => {
    toStringSingleTest(180, "180")
    toStringSingleTest(180, "180deg", {"angle.output.showDefaultUnit": true})
    toStringSingleTest(180, "3.1416rad", {"angle.output.unit": "rad", "number.output.precision": 4})
    toStringSingleTest(180, "200grad", {"angle.output.unit": "grad", "number.output.precision": 4})
    toStringSingleTest(180, "0.5turn", {"angle.output.unit": "turn", "number.output.precision": 4})
    toStringSingleTest(180, "3.1416", {"angle.output.unit": "rad", "angle.defaultUnit": 'rad', 'number.output.precision': 4})
    toStringSingleTest(180, "180 deg", {"angle.output.showDefaultUnit": true, 'angle.output.unitSeparator': ' '})
    toStringSingleTest(180, "180d", {"angle.output.unit": "deg", "angle.output.showDefaultUnit": true,"number.output.precision": 4, 'angle.units': customUnits})
    toStringSingleTest(180, "3.1416r", {"angle.output.unit": "rad", "number.output.precision": 4, 'angle.units': customUnits})
    toStringSingleTest(180, "200g", {"angle.output.unit": "grad", "number.output.precision": 4, 'angle.units': customUnits})
    toStringSingleTest(180, "0.5t", {"angle.output.unit": "turn", "number.output.precision": 4, 'angle.units': customUnits})
    toStringSingleTest(180, 'Angle(180)', {'fn.angle.toString': (angle) => "Angle("+angle.deg()+")"})
};

const parse = () => {
    parseSingleTest("180", 180)
    parseSingleTest("180deg", 180)
    parseSingleTest(Math.PI+"rad", 180)
    parseSingleTest("200grad", 180)
    parseSingleTest("0.5turn", 180)
    parseSingleTest(".5turn", 180)
    parseSingleTest("180DEG", null)
    parseSingleTest("180DEG", 180, {"angle.input.unitsCaseSensitive": false})
    parseSingleTest("180  deg ", 180)
    parseSingleTest("180-deg", null)
    parseSingleTest("180-deg", 180, {"angle.input.space": '-'})
    parseSingleTest("180--deg", null, {"angle.input.space": '-'})
    parseSingleTest("180-deg", 180, {"angle.input.space": /-+/})
    parseSingleTest("180--deg", 180, {"angle.input.space": /-+/})
    parseSingleTest("180d", 180, {"angle.units": customUnits})
    parseSingleTest("180DG", 180, {"angle.units": customUnits})
    parseSingleTest("210dg", null, {"angle.units": customUnits})
    parseSingleTest("200dg", 200, {"angle.units": customUnits, "angle.input.unitsCaseSensitive": false})
    parseSingleTest("180d", 180, {"angle.units": customUnits})
    parseSingleTest("200g", 180, {"angle.units": customUnits})
    parseSingleTest("200GR", 180, {"angle.units": customUnits})
    parseSingleTest("200gr", null, {"angle.units": customUnits})
    parseSingleTest("200gr", 180, {"angle.units": customUnits, "angle.input.unitsCaseSensitive": false})
    parseSingleTest("x", 360, {"fn.angle.parse": (str) => {assert.equal(str, "x"); return Angle.deg(360);}})
}

export default {toString, parse}


