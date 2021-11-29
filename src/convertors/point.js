import CoupleConvertor from "./couple.js";

import Point from "../geometry/point.js";

export default class PointConvertor extends CoupleConvertor
{
    static getName = () => {
        return 'point';
    }

    static accepts = (object) => {
        return (object instanceof Point);
    }

    static coupleToObject = (couple) => {
        return new Point(couple[0], couple[1]);
    }

    static objectToCouple = (object) => {
        return [object.x, object.y];
    }
}
