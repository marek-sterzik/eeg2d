import assert from "assert";

import {Vector} from "../../src/eeg2d.js";

export default function() {
    describe('Vector', function(){
        it("construction", function() {
            var v = new Vector(1, -3);
            assert.equal(v.x, 1);
            assert.equal(v.y, -3);

            var v2 = new Vector(v);
            assert.equal(v2.x, 1);
            assert.equal(v2.y, -3);

            var v3 = new Vector("4, -8");
            assert.equal(v3.x, 4);
            assert.equal(v3.y, -8);
        });
    });
}
