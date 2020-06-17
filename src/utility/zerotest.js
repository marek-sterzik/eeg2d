export default class ZeroTest
{
    static epsilon = 0.0000000000001;
    static isZero(number)
    {
        return (number == 0) || Math.abs(number) < this.epsilon;
    }

    static isEqual(a, b)
    {
        return this.isZero(a-b);
    }
}
