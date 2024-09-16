import TransformationMatrix from "./matrix.js"
import Point from "../geometry/point.js"

export default class MatrixGenerator
{
    static translate = (v) => {
        return new TransformationMatrix(1, 0, 0, 1, v.x, v.y)
    }

    static rotate = (angle, center = Point.origin()) => {
        var tr = new TransformationMatrix(angle.cos(), angle.sin(), -angle.sin(), angle.cos(), 0, 0)
        return this._moveCenter(tr, center)
    }

    static scale = (a, b, center = Point.origin()) => {
        var tr = new TransformationMatrix(a, 0, 0, b, 0, 0)
        return this._moveCenter(tr, center)
    }

    static skewX = (angle, center = Point.origin()) => {
        var tr = new TransformationMatrix(1, angle.tan(), 0, 1, 0, 0)

        return this._moveCenter(tr, center)
    }

    static skew = (skewX, skewY, center = Point.origin()) => {
        var tr = new TransformationMatrix(1, skewX.tan(), skewY.tan(), 1, 0, 0)
        
        return this._moveCenter(tr, center)
    }

    static skewY = (angle, center = Point.origin()) => {
        var tr = new TransformationMatrix(1, 0, angle.tan(), 1, 0, 0)

        return this._moveCenter(tr, center)
    }

    static _moveCenter = (m, center = Point.origin()) => {
        if (center !== null) {
            var v = Point.origin().vectorTo(center)
            if (!v.isZero()) {
                var t1 = this.translate(v)
                var t2 = this.translate(v.mul(-1))
                m = t1.mul(m).mul(t2)
            }
        }
        return m
    }

    static identity = () => {
        return new TransformationMatrix(1, 0, 0, 1, 0, 0)
    }

}

