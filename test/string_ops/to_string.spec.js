import assert from "assert";

import PointTest from "./point.js"
import VectorTest from "./vector.js"
import AngleTest from "./angle.js"

describe("to string", () => {
    it("Angle", AngleTest.toString)
    it("Point", PointTest.toString)
    it("Vector", VectorTest.toString)
});

describe("parse from string", () => {
    it("Angle", AngleTest.parse)
    it("Point", PointTest.parse)
    it("Vector", VectorTest.parse)
});
