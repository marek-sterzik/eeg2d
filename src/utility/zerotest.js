export default class ZeroTest
{
    static isZero(number)
    {
        return (number == 0) || Math.abs(number) < zeroTestEpsilon;
    }

    static isEqual(a, b)
    {
        return this.isZero(a-b);
    }
}

var zeroTestEpsilon = 0.0000000000001;
