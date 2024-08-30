import assert from "../assert/assert.js";

import diff from "../../src/utility/diff.js";

const testDiff = (a, b, result) => {
    assert.equal(diff(a, b).join(''), result)
}

export default () => {
    testDiff(["a"], ["b"], "+-")
    testDiff(["a", "b"], ["b"], "+=")
    testDiff(["a", "b", "x", "c", "d"], ["a", "b", "c", "d"], "==+==")
    testDiff(["a", "b", "c", "d"], ["c", "d", "a"], "++==-")
    
};
