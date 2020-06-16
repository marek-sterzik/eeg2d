import Convertor from "./convertor.js";
import NumberConvertor from "./number.js";

import Angle from "../geometry/angle.js";

export default class AngleConvertor extends Convertor
{
    static getName()
    {
        return 'angle';
    }

    static accepts(object)
    {
        return (object instanceof Angle);
    }

    static parse(string, params, fnName)
    {
        return new Angle(0);
    }

    static toString(angle, params, fnName)
    {
        var angleUnit = this.getRealUnit(params.get('angle.output.unit'), false);
        var angleDefaultUnit = this.getRealUnit(params.get('angle.defaultUnit'), true);
        var number;
        if (angleUnit === 'rad') {
            number = angle.rad();
        } else if (angleUnit === 'grad') {
            number = angle.grad();
        } else if (angleUnit === 'turn') {
            number = angle.turn();
        } else {
            number = angle.deg();
        }

        var string = params.invokeToString(NumberConvertor, number);

        if (params.get('angle.output.showDefaultUnit') || angleUnit !== angleDefaultUnit) {
            string += params.get('angle.output.unitSeparator');
            string += this.getAngleOutputUnit(angleUnit, params);
        }

        return string;
    }

    static getAngleOutputUnit(unit, params)
    {
        var convertor = params.get('angle.units');
        if (unit in convertor) {
            return convertor[unit];
        }

        return unit;
    }

    static getRealUnit(u, allowEmpty)
    {
        if (u !== 'deg' && u !== 'rad' && u !== 'grad' && u !== 'turn') {
            u = null;
        }

        if (!allowEmpty && u === null) {
            u = 'deg';
        }

        return u;
    }
}
