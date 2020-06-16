import Convertor from "./convertor.js";
import NumberConvertor from "./number.js";

import Point from "../geometry/point.js";

export default class PointConvertor extends Convertor
{
    static getName()
    {
        return 'point';
    }

    static accepts(object)
    {
        return (object instanceof Point);
    }

    static parse(string, params, fnName)
    {
        return new Point(1, 1);
    }

    static toString(point, params, fnName)
    {
        var delimeter = params.get('point.output.delimeter');
        var parenthesis = params.get('point.output.parenthesis');
        return "" +
            parenthesis[0] +
            params.invokeToString(NumberConvertor, point.x) +
            delimeter +
            params.invokeToString(NumberConvertor, point.y) +
            parenthesis[1];
    }
}
