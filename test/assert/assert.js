import assert from "assert";
import ZeroTest from "../../src/utility/zerotest.js";

export default class
{
    static throws(block, error = undefined, message = undefined)
    {
        assert.throws(block, error, message)
    }

    static ok(value, message)
    {
        assert.ok(value, message);
    }

    static equal(...args)
    {
        return assert.equal(...args);
    }

    static deepStrictEqual(...args)
    {
        return assert.deepStrictEqual(...args)
    }

    static approxEqual(a, b, msg)
    {
        return assert.ok(ZeroTest.isEqual(a, b), msg);
    }
}
