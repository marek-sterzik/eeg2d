import assert from "assert";

import PointTest from "./point.js"
import VectorTest from "./vector.js"
import AngleTest from "./angle.js"
import TransformationTest from "./transformation.js"

describe("geometry", function() {
    describe('Point', PointTest);
    describe('Vector', VectorTest);
    describe('Angle', AngleTest);
    describe('Transformation', TransformationTest);
});
