import assert from "../assert/assert.js";

import {Transformation, Vector, Angle, Point, StringConvertor} from "../../src/eeg2d.js";


const toStringSingleTest = (transformation, result, convertorParams = undefined) => {
    assert.equal(transformation.toString(convertorParams), result)
}

const parseSingleTest = (source, result, convertorParams = undefined) => {
    var convertor = StringConvertor.get(convertorParams)
    var transformation;
    try {
        transformation = convertor.parseTransformation(source)
        transformation = transformation.toString({"transformation.output.convertToCanonicalForm": false})
    } catch (err) {
        transformation = null
    }
    assert.equal(transformation, result)
}

const trToString = (tr) => {
    const matrixData = tr.getMatrix().data()
    return "MATRIX[" +matrixData.join(",")+ "]"
}

const toString = () => {
    const tr  = Transformation.rotate(Angle.deg(45))
    const tr2 = Transformation.rotate(Angle.deg(45), Point.create(1, 2))
    const tm  = Transformation.matrix(1, 2, 3, 4, 5, 6)
    const tt  = Transformation.translate(1, 2)
    const ts  = Transformation.scale(1, 2)
    const tsX = Transformation.skewX(Angle.deg(45))
    const tsY = Transformation.skewY(Angle.deg(45))
    const tsS = Transformation.skewX(Angle.deg(45), Point.create(1, 2))
    toStringSingleTest(tr, "rotate(45)")
    toStringSingleTest(tr2, "rotate(45, 1, 2)")
    toStringSingleTest(tm, "matrix(1, 2, 3, 4, 5, 6)")
    toStringSingleTest(tt, "translate(1, 2)")
    toStringSingleTest(ts, "scale(1, 2)")
    toStringSingleTest(tsX, "skewX(45)")
    toStringSingleTest(tsY, "skewY(45)")
    toStringSingleTest(tsS, "translate(-1, -2) skewX(45) translate(1, 2)")
    toStringSingleTest(tr.join(tt), "rotate(45) translate(1, 2)")
    toStringSingleTest(tr.join(tt), "rotate(45)*translate(1, 2)", {'transformation.output.transformationDelimeter': '*'})
    toStringSingleTest(tr.join(tt), "rotate(45) translate(1--2)", {'transformation.output.fieldDelimeter': '--'})
    toStringSingleTest(tr.join(tt), "rotate<<45>> translate<<1, 2>>", {'transformation.output.parenthesis': ['<<', '>>']})
    toStringSingleTest(tsS, "skewX*(45, 1, 2)", {"transformation.output.convertToCanonicalForm": false})
    toStringSingleTest(tsS, "skewX+(45, 1, 2)", {"transformation.output.convertToCanonicalForm": false, "transformation.output.nonCanonicalSuffix": "+"})
    toStringSingleTest(tm, "MATRIX[1,2,3,4,5,6]", {"fn.transformation.toString": trToString})
};

const parse = () => {
    parseSingleTest("translate(1,2)", "translate(1, 2)")
    parseSingleTest("translate(1 2)", "translate(1, 2)")
    parseSingleTest("translate(1, 2) translate(2, 3)", "translate(1, 2) translate(2, 3)")
    parseSingleTest("translate(1, 2) rotate(45)", "translate(1, 2) rotate(45)")
    parseSingleTest("xxxxtranslate(xxx1x,x2xxxx)", "translate(1, 2)", {"transformation.input.space": /x+/})
    parseSingleTest("translate(1,2)", "translate(1, 2)", {"transformation.input.identifier": /[transle]+/})
    parseSingleTest("rotate(1,2)", null, {"transformation.input.identifier": /[transle]+/})
    parseSingleTest("rotate(45)*translate(1,2)", "rotate(45) translate(1, 2)", {"transformation.input.transformationDelimeter": '*'})
    parseSingleTest("rotate(45) translate(1,2)", null, {"transformation.input.transformationDelimeter": '*'})
    parseSingleTest("translate(1--2)", null)
    parseSingleTest("translate(1--2)", "translate(1, 2)", {"transformation.input.fieldDelimeter": '--'})
    parseSingleTest("skewX++(45,1,2)", "skewX*(45, 1, 2)", {"transformation.input.nonCanonicalSuffix": '++'})
    parseSingleTest("translate<<1,2>>", null)
    parseSingleTest("translate<<1,2>>", "translate(1, 2)", {"transformation.input.parenthesis": ["<<", ">>"]})
    parseSingleTest("x", "translate(1, 2)", {"fn.transformation.parse": (str) => (str === "x") ? Transformation.translate(1, 2) : Transformation.translate(0, 0)})
}

export default {toString, parse}

