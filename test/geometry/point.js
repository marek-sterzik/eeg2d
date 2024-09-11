import assert from "../assert/assert.js";

import {Point, Vector, Angle} from "../../src/eeg2d.js";

export default () => {
    it("construction", () => {
        var p0 = new Point(6, 7);
        assert.equal(p0.x, 6);
        assert.equal(p0.y, 7);

        var p1 = Point.create(1, -3);
        assert.equal(p1.x, 1);
        assert.equal(p1.y, -3);

        var p2 = Point.create(p1);
        assert.equal(p2.x, 1);
        assert.equal(p2.y, -3);

        var p3 = Point.create("4, -8");
        assert.equal(p3.x, 4);
        assert.equal(p3.y, -8);
        
        var p4 = Point.origin();
        assert.equal(p4.x, 0);
        assert.equal(p4.y, 0);
    });

    it("basic operations", () => {
        var p1 = Point.create(1, 2);
        var v1 = Vector.create(2, 1);

        var p2 = p1.addVector(v1);
        assert.equal(p2.x, 3);
        assert.equal(p2.y, 3);

        p2 = p1.add(v1)
        assert.equal(p2.x, 3);
        assert.equal(p2.y, 3);

        var v2 = p1.vectorTo(p2);
        assert.equal(v2.x, 2);
        assert.equal(v2.y, 1);

        var p3 = Point.create(4, 6);
        assert.approxEqual(p1.distanceTo(p3), 5);
        assert.approxEqual(p3.distanceTo(p1), 5);
        
        assert.equal((Point.create(0, 0)).isOrigin(), true);
        assert.equal((Point.create(0.00001, 0)).isOrigin(), false);
        assert.equal((Point.create(0, 0.00001)).isOrigin(), false);
        assert.equal((Point.create(1, 1)).isOrigin(), false);

        var angle = Angle.deg(90);
        var p4 = Point.create(3, 4);
        var p5 = p1.rot(p4, angle);
        assert.approxEqual(p5.x, -1);
        assert.approxEqual(p5.y, 4);

        var p6 = p1.rot(p1.vectorTo(p4), angle);
        assert.approxEqual(p6.x, -1);
        assert.approxEqual(p6.y, 4);

        p2 = Point.create(2, 1)
        var p7 = p1.interpolate(p2)
        assert.approxEqual(p7.x, 1.5)
        assert.approxEqual(p7.y, 1.5)
        p7 = p1.interpolate(p2, 0.5)
        assert.approxEqual(p7.x, 1.5)
        assert.approxEqual(p7.y, 1.5)
        p7 = p1.interpolate(p2, 0)
        assert.approxEqual(p7.x, p1.x)
        assert.approxEqual(p7.y, p1.y)
        p7 = p1.interpolate(p2, 1)
        assert.approxEqual(p7.x, p2.x)
        assert.approxEqual(p7.y, p2.y)

        assert.equal(p1.toString(), "[1, 2]");
    });
};
