import assert from "assert";

import {Vector, Angle} from "../../src/eeg2d.js";
import ZeroTest from "../../src/utility/zerotest.js";

export default function VectorTest() {
    it("construction", function() {
        var v1 = new Vector(1, -3);
        assert.equal(v1.x, 1);
        assert.equal(v1.y, -3);

        var v2 = new Vector(v1);
        assert.equal(v2.x, 1);
        assert.equal(v2.y, -3);

        var v3 = new Vector("4, -8");
        assert.equal(v3.x, 4);
        assert.equal(v3.y, -8);

        var v4 = Vector.zero();
        assert.equal(v4.x, 0);
        assert.equal(v4.y, 0);
    });

    it("basic operations", function(){
        var v1 = new Vector(1, 2);
        var v2 = new Vector(2, 1);

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

        var v6 = new Vector(3, 4);
        assert(ZeroTest.isEqual(v6.size(), 5));

        var v7 = v6.normalize();
        assert(ZeroTest.isEqual(v7.x, 3/5));
        assert(ZeroTest.isEqual(v7.y, 4/5));

        assert.equal((new Vector(0, 0)).isZero(), true);
        assert.equal((new Vector(0.00001, 0)).isZero(), false);
        assert.equal((new Vector(0, 0.00001)).isZero(), false);
        assert.equal((new Vector(1, 1)).isZero(), false);

        assert.equal((new Vector(1, 2)).toString(), '(1, 2)');

    });

    it("angle operations", function(){
        //universal angle operations
        var angle = Angle.deg(30);
        var v1 = new Vector(1, 0);
        var v2 = v1.rot(angle);
        assert(ZeroTest.isEqual(v2.x, Math.sqrt(3/4)));
        assert(ZeroTest.isEqual(v2.y, 1/2));
        var v3 = v2.rot(angle);
        assert(ZeroTest.isEqual(v3.x, 1/2));
        assert(ZeroTest.isEqual(v3.y, Math.sqrt(3/4)));

        var angle2 = v2.angleTo(v3);
        assert(ZeroTest.isEqual(angle2.deg(), 30));
        var angle3 = v3.angleTo(v2);
        assert(ZeroTest.isEqual(angle3.deg(), 330));

        //test all rotations 10 degrees
        var b = new Vector(1, 0);
        var b2 = b.rot(Angle.deg(20));
        for (var i = 0; i < 36; i++) {
            var a = Angle.deg(i*10);
            var v = b.rot(a);
            assert(ZeroTest.isEqual(v.x, Math.cos(i * Math.PI / 18)));
            assert(ZeroTest.isEqual(v.y, Math.sin(i * Math.PI / 18)));

            v = b2.rot(a);
            assert(ZeroTest.isEqual(v.x, Math.cos((i + 2) * Math.PI / 18)));
            assert(ZeroTest.isEqual(v.y, Math.sin((i + 2) * Math.PI / 18)));
        }
    });

    it("translation", function(){
        var v = new Vector(2, -3);
        var t = v.translation();
        assert.equal(t.matrix.m[0][0], 1);
        assert.equal(t.matrix.m[1][0], 0);
        assert.equal(t.matrix.m[0][1], 0);
        assert.equal(t.matrix.m[1][1], 1);
        assert.equal(t.matrix.m[0][2], 2);
        assert.equal(t.matrix.m[1][2], -3);
    });
};
