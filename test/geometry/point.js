import assert from "assert";

import {Point} from "../../src/eeg2d.js";

export default function() {
    describe('Point', function(){
        it("construction", function() {
            var p = new Point(1, -3);
            assert.equal(p.x, 1);
            assert.equal(p.y, -3);

            var p2 = new Point(p);
            assert.equal(p2.x, 1);
            assert.equal(p2.y, -3);

            var p3 = new Point("4, -8");
            assert.equal(p3.x, 4);
            assert.equal(p3.y, -8);
        });
    });
}
