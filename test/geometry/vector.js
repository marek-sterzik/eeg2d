import assert from "../assert/assert.js";

import {Vector, Angle} from "../../src/eeg2d.js";

export default () => {
    it("construction", () => {
        var v0 = Vector.create(-6, -7);
        assert.equal(v0.x, -6);
        assert.equal(v0.y, -7);
        
        var v1 = Vector.create(1, -3);
        assert.equal(v1.x, 1);
        assert.equal(v1.y, -3);

        var v2 = Vector.create(v1);
        assert.equal(v2.x, 1);
        assert.equal(v2.y, -3);

        var v3 = Vector.create("4, -8");
        assert.equal(v3.x, 4);
        assert.equal(v3.y, -8);

        var v4 = Vector.zero();
        assert.equal(v4.x, 0);
        assert.equal(v4.y, 0);
    });

    it("basic operations", () => {
        var v1 = Vector.create(1, 2);
        var v2 = Vector.create(2, 1);

        var v3 = v1.add(v2);
        assert.equal(v3.x, 3);
        assert.equal(v3.y, 3);

        var v4 = v1.sub(v2);
        assert.equal(v4.x, -1);
        assert.equal(v4.y, 1);

        var v5 = v1.mul(-2);
        assert.equal(v5.x, -2);
        assert.equal(v5.y, -4);

        var x = v1.mul(v2);
        assert.equal(x, 4);

        var v6 = Vector.create(3, 4);
        assert.approxEqual(v6.size(), 5);
        assert.equal(v6.sizeSquare(), 25);

        var v7 = v6.normalize();
        assert.approxEqual(v7.x, 3/5);
        assert.approxEqual(v7.y, 4/5);

        assert.equal((Vector.create(0, 0)).isZero(), true);
        assert.equal((Vector.create(0.00001, 0)).isZero(), false);
        assert.equal((Vector.create(0, 0.00001)).isZero(), false);
        assert.equal((Vector.create(1, 1)).isZero(), false);

        assert.equal((Vector.create(1, 2)).toString(), '(1, 2)');

    });

    it("angle operations", () => {
        //universal angle operations
        var angle = Angle.deg(30);
        var v1 = Vector.create(1, 0);
        var v2 = v1.rot(angle);
        assert.approxEqual(v2.x, Math.sqrt(3/4));
        assert.approxEqual(v2.y, 1/2);
        var v3 = v2.rot(angle);
        assert.approxEqual(v3.x, 1/2);
        assert.approxEqual(v3.y, Math.sqrt(3/4));

        var angle2 = v2.angleTo(v3);
        assert.approxEqual(angle2.deg(), 30);
        var angle3 = v3.angleTo(v2);
        assert.approxEqual(angle3.deg(), 330);

        //test all rotations 10 degrees
        var b = Vector.create(1, 0);
        var b2 = b.rot(Angle.deg(20));
        for (var i = 0; i < 36; i++) {
            var a = Angle.deg(i*10);
            var v = b.rot(a);
            assert.approxEqual(v.x, Math.cos(i * Math.PI / 18));
            assert.approxEqual(v.y, Math.sin(i * Math.PI / 18));

            v = b2.rot(a);
            assert.approxEqual(v.x, Math.cos((i + 2) * Math.PI / 18));
            assert.approxEqual(v.y, Math.sin((i + 2) * Math.PI / 18));
        }

        var v4 = Vector.create(2, 1).rot()
        assert.equal(v4.x, -1)
        assert.equal(v4.y, 2)
        v4 = v4.rot()
        assert.equal(v4.x, -2)
        assert.equal(v4.y, -1)
        v4 = v4.rot()
        assert.equal(v4.x, 1)
        assert.equal(v4.y, -2)
    });

    it("angle with inaccurate computing", () => {
        // test if angle is working in cases where inaccuracy causes the acos argument being > 1
        var v = Vector.create(-79.08203125, -2.681640625)
        var angle = v.angleTo(v)
        assert.approxEqual(angle.rad(), 0)
    })

    it("translation", () => {
        var v = Vector.create(2, -3);
        var t = v.getTranslation();
        var matrix = t.getMatrix();
        assert.equal(matrix.m[0][0], 1);
        assert.equal(matrix.m[1][0], 0);
        assert.equal(matrix.m[0][1], 0);
        assert.equal(matrix.m[1][1], 1);
        assert.equal(matrix.m[0][2], 2);
        assert.equal(matrix.m[1][2], -3);
    });
};
