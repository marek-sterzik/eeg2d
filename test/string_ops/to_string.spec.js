import assert from "assert";

import PointTest from "./point.js"
import VectorTest from "./vector.js"
import AngleTest from "./angle.js"
import TransformationTest from "./transformation.js"

describe("to string", () => {
    it("Angle", AngleTest.toString)
    it("Point", PointTest.toString)
    it("Vector", VectorTest.toString)
    it("Transformation", TransformationTest.toString)
});

describe("parse from string", () => {
    it("Angle", AngleTest.parse)
    it("Point", PointTest.parse)
    it("Vector", VectorTest.parse)
    it("Transformation", TransformationTest.parse)
});
