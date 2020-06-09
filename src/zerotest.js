export default class ZeroTest
{
    static isZero(number)
    {
        return (number == 0) || Math.abs(number) < 0.000000000000001;
    }
}
