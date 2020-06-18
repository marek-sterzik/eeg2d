import assert from "assert";

import {Point, Vector, Angle} from "../../src/eeg2d.js";
import ZeroTest from "../../src/utility/zerotest.js";

export default function PointTest() {
    it("construction", function() {
        var p1 = new Point(1, -3);
        assert.equal(p1.x, 1);
        assert.equal(p1.y, -3);

        var p2 = new Point(p1);
        assert.equal(p2.x, 1);
        assert.equal(p2.y, -3);

        var p3 = new Point("4, -8");
        assert.equal(p3.x, 4);
        assert.equal(p3.y, -8);
        
        var p4 = Point.origin();
        assert.equal(p4.x, 0);
        assert.equal(p4.y, 0);
    });

    it("basic operations", function(){
        var p1 = new Point(1, 2);
        var v1 = new Vector(2, 1);

        var p2 = p1.addVector(v1);
        assert.equal(p2.x, 3);
        assert.equal(p2.y, 3);

        var v2 = p1.vectorTo(p2);
        assert.equal(v2.x, 2);
        assert.equal(v2.y, 1);

        var p3 = new Point(4, 6);
        assert(ZeroTest.isEqual(p1.distanceTo(p3), 5));
        assert(ZeroTest.isEqual(p3.distanceTo(p1), 5));
        
        assert.equal((new Point(0, 0)).isOrigin(), true);
        assert.equal((new Point(0.00001, 0)).isOrigin(), false);
        assert.equal((new Point(0, 0.00001)).isOrigin(), false);
        assert.equal((new Point(1, 1)).isOrigin(), false);

        var angle = Angle.deg(90);
        var p4 = new Point(3, 4);
        var p5 = p1.rot(p4, angle);
        assert(ZeroTest.isEqual(p5.x, -1));
        assert(ZeroTest.isEqual(p5.y, 4));

        var p6 = p1.rot(p1.vectorTo(p4), angle);
        assert(ZeroTest.isEqual(p6.x, -1));
        assert(ZeroTest.isEqual(p6.y, 4));

        assert.equal(p1.toString(), "[1, 2]");
    });
};
