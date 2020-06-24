import assert from "../assert/assert.js";

import {Vector, Point, Angle, Transformation, StringConvertor} from "../../src/eeg2d.js";
import TransformationMatrix from "../../src/math/matrix.js";
import AtomicTransformation from "../../src/utility/atomic_transformation.js";

var defaultStringConvertor;

export default function TransformationTest() {
    before(function() {
        //this config is necessary for assertTrEqual working properly
        var config = {
            'transformation.output.convertToCanonicalForm': false,
            'number.output.percision': 4,
        };
        defaultStringConvertor = StringConvertor.get(config).setDefault();
    });

    after(function() {
        defaultStringConvertor.setDefault();
    });

    it("construction:constructor", function() {
        var t1 = Transformation.rotate(Angle.deg(45), new Point(1, 2));

        assertTrEqual(new Transformation(t1), "rotate(45, 1, 2)");
        
        var matrix = new TransformationMatrix(6, 5, 4, 3, 2, 1);
        var t2 = new Transformation(matrix);
        assertTrEqual(t2, "matrix(6, 5, 4, 3, 2, 1)");
        assertTrEqual(new Transformation(1, 2, 3, 4, 5, 6), "matrix(1, 2, 3, 4, 5, 6)");


        var a1 = AtomicTransformation.instantiate({"type": "scale", "scaleX": 2, "scaleY": 3, "centerPoint": Point.origin()});
        var a2 = AtomicTransformation.instantiate({"type": "translate", "vector": new Vector(1, 2)});
        assertTrEqual(new Transformation([a1, a2]), "scale(2, 3) translate(1, 2)");
    });

    it("construction:matrix", function() {
        assertTrEqual(Transformation.matrix(1, 2, 3, 4, 5, 6), "matrix(1, 2, 3, 4, 5, 6)");

        var matrix = new TransformationMatrix(6, 5, 4, 3, 2, 1);
        assertTrEqual(Transformation.matrix(matrix), "matrix(6, 5, 4, 3, 2, 1)");
    });

    it("construction:translate", function() {
        assertTrEqual(Transformation.translate(1, 2), "translate(1, 2)");
        assertTrEqual(Transformation.translate(1), "translate(1, 0)");
        
        var v = new Vector(4, 5);
        assertTrEqual(Transformation.translate(v), "translate(4, 5)");
    });

    it("construction:rotate", function() {
        assertTrEqual(Transformation.rotate(Angle.deg(45)), "rotate(45)");
        assertTrEqual(Transformation.rotate(Math.PI/4), "rotate(45)");
        assertTrEqual(Transformation.rotate(Angle.deg(45), 1, 2), "rotate(45, 1, 2)");
        assertTrEqual(Transformation.rotate(Math.PI/4, 3, 4), "rotate(45, 3, 4)");
        assertTrEqual(Transformation.rotate(Angle.deg(45), new Point(4, 5)), "rotate(45, 4, 5)");
        assertTrEqual(Transformation.rotate(Math.PI/4, new Point(5, 6)), "rotate(45, 5, 6)");
    });

    it("construction:scale", function() {
        assertTrEqual(Transformation.scale(5), "scale(5)");
        assertTrEqual(Transformation.scale(5, 6), "scale(5, 6)");
        assertTrEqual(Transformation.scale(5, new Point(1, 2)), "scale*(5, 5, 1, 2)");
        assertTrEqual(Transformation.scale(5, 6, new Point(1, 2)), "scale*(5, 6, 1, 2)");
    });

    it("construction:skewX", function() {
        assertTrEqual(Transformation.skewX(Angle.deg(45)), "skewX(45)");
        assertTrEqual(Transformation.skewX(Math.PI/4), "skewX(45)");
        assertTrEqual(Transformation.skewX(Angle.deg(45), new Point(1, 2)), "skewX*(45, 1, 2)");
        assertTrEqual(Transformation.skewX(Math.PI/4, new Point(1, 2)), "skewX*(45, 1, 2)");
    });

    it("construction:skewY", function() {
        assertTrEqual(Transformation.skewY(Angle.deg(45)), "skewY(45)");
        assertTrEqual(Transformation.skewY(Math.PI/4), "skewY(45)");
        assertTrEqual(Transformation.skewY(Angle.deg(45), new Point(1, 2)), "skewY*(45, 1, 2)");
        assertTrEqual(Transformation.skewY(Math.PI/4, new Point(1, 2)), "skewY*(45, 1, 2)");
    });

    it("construction:skew", function() {
        assertTrEqual(Transformation.skew(Angle.deg(45)), "skew(45)");
        assertTrEqual(Transformation.skew(Angle.deg(45), Angle.deg(30)), "skew(45, 30)");
        assertTrEqual(Transformation.skew(Math.PI/4), "skew(45)");
        assertTrEqual(Transformation.skew(Math.PI/4, Math.PI/6), "skew(45, 30)");
        assertTrEqual(Transformation.skew(Angle.deg(45), new Point(1, 2)), "skew*(45, 0, 1, 2)");
        assertTrEqual(Transformation.skew(Angle.deg(45), Angle.deg(30), new Point(1, 2)), "skew*(45, 30, 1, 2)");
        assertTrEqual(Transformation.skew(Math.PI/4, new Point(1, 2)), "skew*(45, 0, 1, 2)");
        assertTrEqual(Transformation.skew(Math.PI/4, Math.PI/6, new Point(1, 2)), "skew*(45, 30, 1, 2)");
    });

    it("construction:identity", function() {
        assertTrEqual(Transformation.identity(), "");
        var matrix = Transformation.identity().getMatrix();
        assert.equal(matrix.m[0][0], 1);
        assert.equal(matrix.m[1][0], 0);
        assert.equal(matrix.m[0][1], 0);
        assert.equal(matrix.m[1][1], 1);
        assert.equal(matrix.m[0][2], 0);
        assert.equal(matrix.m[1][2], 0);
    });
};

function assertTrEqual(transformation, expectedString)
{
    assert.equal(transformation.toString(), expectedString);
}
