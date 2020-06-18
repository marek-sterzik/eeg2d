import assert from "assert";
import ZeroTest from "../../src/utility/zerotest.js";

export default class
{
    static equal(a, b)
    {
        return assert.equal(a, b);
    }

    static approxEqual(a, b)
    {
        return assert(ZeroTest.isEqual(a, b));
    }
}
