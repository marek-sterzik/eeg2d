import assert from "../assert/assert.js";

import {Vector, Point, Angle, Transformation, StringConvertor} from "../../src/eeg2d.js";
import TransformationMatrix from "../../src/math/matrix.js";
import AtomicTransformation from "../../src/utility/atomic_transformation.js";

var defaultStringConvertor;

export default () => {
    before(() => {
        //this config is necessary for assertTrEqual working properly
        var config = {
            'transformation.output.convertToCanonicalForm': false,
            'number.output.percision': 4,
        };
        defaultStringConvertor = StringConvertor.get(config).setDefault();
    });

    after(() => {
        defaultStringConvertor.setDefault();
    });

    it("construction:constructor", () => {
        var t1 = Transformation.rotate(Angle.deg(45), Point.create(1, 2));

        assertTrEqual(Transformation.create(t1), "rotate(45, 1, 2)");
        
        var matrix = TransformationMatrix.create(6, 5, 4, 3, 2, 1);
        var t2 = Transformation.create(matrix);
        assertTrEqual(t2, "matrix(6, 5, 4, 3, 2, 1)");
        assertTrEqual(Transformation.create(1, 2, 3, 4, 5, 6), "matrix(1, 2, 3, 4, 5, 6)");


        var a1 = AtomicTransformation.instantiate({"type": "scale", "scaleX": 2, "scaleY": 3, "centerPoint": Point.origin()});
        var a2 = AtomicTransformation.instantiate({"type": "translate", "vector": Vector.create(1, 2)});
        assertTrEqual(new Transformation([a1, a2]), "scale(2, 3) translate(1, 2)");
        assertTrEqual(Transformation.create([a1, a2]), "scale(2, 3) translate(1, 2)");

        assertTrEqual(Transformation.create("rotate(45, 1, 2) translate(5, 6)"), "rotate(45, 1, 2) translate(5, 6)");
    });

    it("construction:matrix", () => {
        assertTrEqual(Transformation.matrix(1, 2, 3, 4, 5, 6), "matrix(1, 2, 3, 4, 5, 6)");

        var matrix = TransformationMatrix.create(6, 5, 4, 3, 2, 1);
        assertTrEqual(Transformation.matrix(matrix), "matrix(6, 5, 4, 3, 2, 1)");
    });

    it("construction:translate", () => {
        assertTrEqual(Transformation.translate(1, 2), "translate(1, 2)");
        assertTrEqual(Transformation.translate(1), "translate(1, 0)");
        
        var v = Vector.create(4, 5);
        assertTrEqual(Transformation.translate(v), "translate(4, 5)");
    });

    it("construction:rotate", () => {
        assertTrEqual(Transformation.rotate(Angle.deg(45)), "rotate(45)");
        assertTrEqual(Transformation.rotate(Math.PI/4), "rotate(45)");
        assertTrEqual(Transformation.rotate(Angle.deg(45), 1, 2), "rotate(45, 1, 2)");
        assertTrEqual(Transformation.rotate(Math.PI/4, 3, 4), "rotate(45, 3, 4)");
        assertTrEqual(Transformation.rotate(Angle.deg(45), Point.create(4, 5)), "rotate(45, 4, 5)");
        assertTrEqual(Transformation.rotate(Math.PI/4, Point.create(5, 6)), "rotate(45, 5, 6)");
    });

    it("construction:scale", () => {
        assertTrEqual(Transformation.scale(5), "scale(5)");
        assertTrEqual(Transformation.scale(5, 6), "scale(5, 6)");
        assertTrEqual(Transformation.scale(5, Point.create(1, 2)), "scale*(5, 5, 1, 2)");
        assertTrEqual(Transformation.scale(5, 6, Point.create(1, 2)), "scale*(5, 6, 1, 2)");
    });

    it("construction:skewX", () => {
        assertTrEqual(Transformation.skewX(Angle.deg(45)), "skewX(45)");
        assertTrEqual(Transformation.skewX(Math.PI/4), "skewX(45)");
        assertTrEqual(Transformation.skewX(Angle.deg(45), Point.create(1, 2)), "skewX*(45, 1, 2)");
        assertTrEqual(Transformation.skewX(Math.PI/4, Point.create(1, 2)), "skewX*(45, 1, 2)");
    });

    it("construction:skewY", () => {
        assertTrEqual(Transformation.skewY(Angle.deg(45)), "skewY(45)");
        assertTrEqual(Transformation.skewY(Math.PI/4), "skewY(45)");
        assertTrEqual(Transformation.skewY(Angle.deg(45), Point.create(1, 2)), "skewY*(45, 1, 2)");
        assertTrEqual(Transformation.skewY(Math.PI/4, Point.create(1, 2)), "skewY*(45, 1, 2)");
    });

    it("construction:skew", () => {
        assertTrEqual(Transformation.skew(Angle.deg(45)), "skew(45)");
        assertTrEqual(Transformation.skew(Angle.deg(45), Angle.deg(30)), "skew(45, 30)");
        assertTrEqual(Transformation.skew(Math.PI/4), "skew(45)");
        assertTrEqual(Transformation.skew(Math.PI/4, Math.PI/6), "skew(45, 30)");
        assertTrEqual(Transformation.skew(Angle.deg(45), Point.create(1, 2)), "skew*(45, 0, 1, 2)");
        assertTrEqual(Transformation.skew(Angle.deg(45), Angle.deg(30), Point.create(1, 2)), "skew*(45, 30, 1, 2)");
        assertTrEqual(Transformation.skew(Math.PI/4, Point.create(1, 2)), "skew*(45, 0, 1, 2)");
        assertTrEqual(Transformation.skew(Math.PI/4, Math.PI/6, Point.create(1, 2)), "skew*(45, 30, 1, 2)");
    });

    it("construction:identity", () => {
        assertTrEqual(Transformation.identity(), "");
        var matrix = Transformation.identity().getMatrix();
        assert.equal(matrix.m[0][0], 1);
        assert.equal(matrix.m[1][0], 0);
        assert.equal(matrix.m[0][1], 0);
        assert.equal(matrix.m[1][1], 1);
        assert.equal(matrix.m[0][2], 0);
        assert.equal(matrix.m[1][2], 0);
    });

    it("composition", () => {
        var t1 = Transformation.translate(1, 2);
        var t2 = Transformation.rotate(Angle.deg(45), 3, 4);
        
        var matrix = t1.getMatrix().mul(t2.getMatrix());
        var t3 = Transformation.matrix(matrix);

        var t4 = t1.compose(t2);
        assertTrEqual(t4, t3.toString());
        assertMatrixEqual(t4.getMatrix(), matrix);

        var t5 = t1.join(t2);
        assertTrEqual(t5, "translate(1, 2) rotate(45, 3, 4)");
        assertMatrixEqual(t5.getMatrix(), matrix);

        t5 = t1.concat(t2);
        assertTrEqual(t5, "translate(1, 2) rotate(45, 3, 4)");
        assertMatrixEqual(t5.getMatrix(), matrix);

        var t6 = t5.flatten();
        assertTrEqual(t6, t3.toString());
        assertMatrixEqual(t6.getMatrix(), t5.getMatrix());
    });

    it("inversion", () => {
        var t1 = Transformation.translate(1, 2);
        var t2 = Transformation.rotate(Angle.deg(45), 3, 4);
        var t3 = Transformation.scale(2, 3, Point.create(4, 5));
        var t4 = Transformation.skewX(Angle.deg(30), Point.create(5, 6));
        var t5 = Transformation.skewY(Angle.deg(30), Point.create(5, 6));
        
        var t1inv = Transformation.translate(-1, -2);
        var t2inv = Transformation.rotate(Angle.deg(-45), 3, 4);
        var t3inv = Transformation.scale(1/2, 1/3, Point.create(4, 5));
        var t4inv = Transformation.skewX(Angle.deg(-30), Point.create(5, 6));
        var t5inv = Transformation.skewY(Angle.deg(-30), Point.create(5, 6));

        assertMatrixEqual(t1.inv().getMatrix(), t1inv.getMatrix());
        assertMatrixEqual(t2.inv().getMatrix(), t2inv.getMatrix());
        assertMatrixEqual(t3.inv().getMatrix(), t3inv.getMatrix());
        assertMatrixEqual(t4.inv().getMatrix(), t4inv.getMatrix());
    });

    it("transformation", () => {
        var b1 = Vector.create(1, 0);
        var b2 = Vector.create(0, 1);

        var p0 = Point.origin();
        var p1 = p0.addVector(b1);
        var p2 = p0.addVector(b2);

        var b1x = b1.rot(Angle.deg(45));
        var b2x = b2.rot(Angle.deg(45));

        var p0x = Point.create(1, 2);
        var p1x = p0x.addVector(b1x);
        var p2x = p0x.addVector(b2x);

        var t = Transformation.create("translate(1, 2) rotate(45)");

        assertPointEqual(t.transformPoint(p0), p0x);
        assertPointEqual(t.transformPoint(p1), p1x);
        assertPointEqual(t.transformPoint(p2), p2x);

        assertVectorEqual(t.transformVector(b1), b1x);
        assertVectorEqual(t.transformVector(b2), b2x);
    });

    it("decomposition", () => {
        var t1 = Transformation.create("translate(2, 3) rotate(30) scale(5, 6) skew(10)");
        var matrix = t1.getMatrix();
        var t2 = t1.flatten();

        assertTrEqual(t2, Transformation.matrix(matrix).toString());
        
        assertTrEqual(t2.decompose(), "translate(2, 3) rotate(30) scale(5, 6) skew(10)");
        assertTrEqual(t2.decompose("skew"), "translate(2, 3) rotate(30) scale(5, 6) skew(10)");
        assertTrEqual(t2.decompose("skewX"), "translate(2, 3) rotate(30) scale(5, 6) skewX(10)");
        
        var t3 = Transformation.create("translate(2, 3) rotate(30) scale(5, 6) skewY(15)");
        assertTrEqual(t3.decompose("skewY"), "translate(2, 3) rotate(30) scale(5, 6) skewY(15)");

        var t4 = Transformation.create("translate(2, 3) rotate(30, 1, 1) scale*(5, 6, 1, 1) skewX*(15, 1, 1)")
        assertTrEqual(t4.decompose(Point.create(1, 1), "skewX"), "translate(2, 3) rotate(30, 1, 1) scale*(5, 6, 1, 1) skewX*(15, 1, 1)");

        var t5 = Transformation.create("translate(2, 3) rotate(30, 1, 1) scale(5, 6) skewX(15)")
        assertTrEqual(t5.decompose(Point.create(1, 1), "skewX,canonical"), "translate(2, 3) rotate(30, 1, 1) scale(5, 6) skewX(15)");
    });

    it("canonization", () => {
        var p = Point.create(1, 2);

        assertTrEqual(Transformation.identity(), "");
        assertTrEqual(Transformation.identity().canonize(), "translate(0, 0)");
        assertTrEqual(Transformation.rotate(Angle.deg(45), p).canonize(), "rotate(45, 1, 2)");
        assertTrEqual(Transformation.scale(2, 3, p).canonize(), "translate(-1, -2) scale(2, 3) translate(1, 2)");
        assertTrEqual(Transformation.skew(Angle.deg(10), Angle.deg(15), p).canonize(), "translate(-1, -2) skew(10, 15) translate(1, 2)");
        assertTrEqual(Transformation.skewX(Angle.deg(10), p).canonize(), "translate(-1, -2) skewX(10) translate(1, 2)");
        assertTrEqual(Transformation.skewY(Angle.deg(10), p).canonize(), "translate(-1, -2) skewY(10) translate(1, 2)");

        var ot = "translate(1, 2) translate(2, 3) rotate(45) translate(-2, -3) translate(2, 3) scale(4) translate(-2, -3) translate(1, 1)";
        var ct = "translate(3, 5) rotate(45) scale(4) translate(-1, -2)";
        var t = Transformation.create(ot);
        assertTrEqual(t, ot);
        assertTrEqual(t.canonize(), ct);
    });

    it("string conversions", () => {
        var t = Transformation.create("translate(5, 6) rotate(60) scale(4) skewX(10)");
        assert.equal(t.toString(), "translate(5, 6) rotate(60) scale(4) skewX(10)");
        assertMatrixEqual(t.getMatrix(), t.flatten().getMatrix());
    });
};

const assertTrEqual = (transformation, expectedString) => {
    assert.equal(transformation.toString(), expectedString);
}

const assertMatrixEqual = (matrix, matrix2) => {
    for (var i = 0; i < 2; i++) {
        for (var j = 0; j < 3; j++) {
            assert.approxEqual(matrix.m[i][j], matrix2.m[i][j]);
        }
    }
}

const assertPointEqual = (point, point2) => {
    assert.approxEqual(point.x, point2.x);
    assert.approxEqual(point.y, point2.y);
}

const assertVectorEqual = (vector, vector2) => {
    assert.approxEqual(vector.x, vector2.x);
    assert.approxEqual(vector.y, vector2.y);
}
