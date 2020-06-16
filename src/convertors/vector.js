import Convertor from "./convertor.js";
import NumberConvertor from "./number.js";

import Vector from "../geometry/vector.js";

export default class VectorConvertor extends Convertor
{
    static getName()
    {
        return 'vector';
    }

    static accepts(object)
    {
        return (object instanceof Vector);
    }

    static parse(string, params, fnName)
    {
        return new Vector(1, 1);
    }

    static toString(vector, params, fnName)
    {
        var delimeter = params.get('vector.output.delimeter');
        var parenthesis = params.get('vector.output.parenthesis');
        return "" +
            parenthesis[0] +
            params.invokeToString(NumberConvertor, vector.x) +
            delimeter +
            params.invokeToString(NumberConvertor, vector.y) +
            parenthesis[1];
    }
}
