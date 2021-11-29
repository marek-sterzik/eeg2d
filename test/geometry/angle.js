import assert from "../assert/assert.js";

import {Point, Vector, Angle} from "../../src/eeg2d.js";

export default function AngleTest() {
    it("construction", function() {
        var a1 = Angle.create(2 * Math.PI);
        assertAngle(a1, 360, "deg");

        assertAngle(Angle.create(a1), 360, "deg");

        assertAngle(Angle.create("120"), 120, "deg");

        assertAngle(Angle.zero(), 0, "deg");

        assertAngle(Angle.full(), 360, "deg");
        
        assertAngle(Angle.straight(), 180, "deg");
        
        assertAngle(Angle.right(), 90, "deg");

        assertAngle(Angle.deg(45), 45, "deg");
        assertAngle(Angle.rad(Math.PI / 4), 45, "deg");
        assertAngle(Angle.grad(50), 45, "deg");
        assertAngle(Angle.turn(1/8), 45, "deg");

        assertAngle(Angle.atan(-1), -45, "deg");
        assertAngle(Angle.atan(1), 45, "deg");
    });

    it("basic operations", function(){
        var angle = Angle.deg(45);
        assertAngle(angle, 45, "deg");
        assertAngle(angle, Math.PI / 4, "rad");
        assertAngle(angle, 50, "grad");
        assertAngle(angle, 1/8, "turn");

        assertAngle(angle.mul(-3), -135, "deg");

        var angle2 = Angle.deg(30);
        assertAngle(angle.add(angle2), 75, "deg");
        assertAngle(angle.add(Math.PI / 6), 75, "deg");
        
        assertAngle(angle.sub(angle2), 15, "deg");
        assertAngle(angle.sub(Math.PI / 6), 15, "deg");

        assertAngle(angle.normalize(), 45, "deg");
        assertAngle(Angle.deg(360).normalize(), 0, "deg");
        assertAngle(Angle.deg(359).normalize(), 359, "deg");
        assertAngle(Angle.deg(-45).normalize(), 315, "deg");
        assertAngle(Angle.deg(-405).normalize(), 315, "deg");
        assertAngle(Angle.deg(0).normalize(), 0, "deg");
        assertAngle(Angle.deg(-1).normalize(), 359, "deg");
        assertAngle(Angle.deg(405).normalize(), 45, "deg");
        assertAngle(Angle.deg(765).normalize(), 45, "deg");

        assert.approxEqual(Angle.deg(30).sin(), 1/2);
        assert.approxEqual(Angle.deg(30).cos(), Math.sqrt(3/4));
        assert.approxEqual(Angle.deg(30).tan(), Math.sqrt(1/3));
        assert.approxEqual(Angle.deg(30).cotan(), Math.sqrt(3));


        assert.equal(Angle.deg(0).isZero(), true);
        assert.equal(Angle.deg(0.00001).isZero(), false);
        assert.equal(Angle.deg(-0.00001).isZero(), false);
        assert.equal(Angle.deg(360).isZero(), false);

        assert.equal(Angle.deg(45).toString(), "45");
    });

    it("rotation", function(){
        var angle = Angle.deg(90);

        var t = angle.getRotation();
        var matrix = t.getMatrix();
        assert.approxEqual(matrix.m[0][0], 0);
        assert.approxEqual(matrix.m[1][0], 1);
        assert.approxEqual(matrix.m[0][1], -1);
        assert.approxEqual(matrix.m[1][1], 0);
        assert.approxEqual(matrix.m[0][2], 0);
        assert.approxEqual(matrix.m[1][2], 0);
        
        var t = angle.getRotation(Point.create(2, 2));
        assert.approxEqual(t.matrix.m[0][0], 0);
        assert.approxEqual(t.matrix.m[1][0], 1);
        assert.approxEqual(t.matrix.m[0][1], -1);
        assert.approxEqual(t.matrix.m[1][1], 0);
        assert.approxEqual(t.matrix.m[0][2], 4);
        assert.approxEqual(t.matrix.m[1][2], 0);
    });
}

function assertAngle(angle, value, unit)
{
    assert.approxEqual(angle[unit].call(angle), value);
}
