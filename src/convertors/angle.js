import Convertor from "./convertor.js";
import NumberConvertor from "./number.js";
import Angle from "../angle.js";

export default class AngleConvertor extends Convertor
{
    static getObjectClass()
    {
        return Angle;
    }

    static parseDefault(string)
    {
        return new Angle(0);
    }

    static toStringDefault(angle)
    {
        var angleUnit = this.getRealUnit(this.getArg('output.angleUnit', 'deg'));
        var angleDefaultUnit = this.getRealUnit(this.getArg('output.angleDefaultUnit', 'deg'));
        var number;
        if (angleUnit === 'rad') {
            number = angle.rad();
        } else if (angleUnit === 'grad') {
            number = angle.grad();
        } else {
            number = angle.deg();
        }

        var string = NumberConvertor.toString(number, this.getArgs());

        if (this.getArg('output.showAngleDefaultUnit', false) || angleUnit !== angleDefaultUnit) {
            string += this.getArg('output.unitSeparator', '');
            string += this.getAngleOutputUnit(angleUnit);
        }

        return string;
    }

    static getAngleOutputUnit(unit)
    {
        var convertor = this.getArg('output.angleOutputUnit', {"deg": "deg", "rad": "rad", "grad": "grad"});
        if (typeof convertor === 'string') {
            return convertor;
        }
        if (convertor instanceof Object && unit in convertor) {
            return convertor[unit];
        }

        return unit;
    }

    static getRealUnit(u)
    {
        if (u !== 'deg' && u !== 'rad' && u !== 'grad') {
            u = 'deg';
        }

        return u;
    }

    static getCustomParserKey()
    {
        return 'angleParser';
    }

    static getCustomToStringKey()
    {
        return 'angleToString';
    }
}
