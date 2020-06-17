import CoupleConvertor from "./couple.js";

import Vector from "../geometry/vector.js";

export default class VectorConvertor extends CoupleConvertor
{
    static getName()
    {
        return 'vector';
    }

    static accepts(object)
    {
        return (object instanceof Vector);
    }

    static coupleToObject(couple)
    {
        return new Vector(couple[0], couple[1]);
    }

    static objectToCouple(object)
    {
        return [object.x, object.y];
    }
}
