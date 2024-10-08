import Args from "../utility/args.js"
import ZeroTest from "../utility/zerotest.js"

import Point from '../geometry/point.js'
import Vector from '../geometry/vector.js'

export default class TransformMatrix
{
    static create = (a, b, c, d, e, f) => {
        return new TransformMatrix(a, b, c, d, e, f)
    }

    constructor(a, b, c, d, e, f)
    {
        this.m = [
            [a, c, e],
            [b, d, f],
            [0, 0, 1]
        ]
        Object.freeze(this)
        Object.freeze(this.m)
        Object.freeze(this.m[0])
        Object.freeze(this.m[1])
    }

    data()
    {
        return [this.m[0][0], this.m[1][0], this.m[0][1], this.m[1][1], this.m[0][2], this.m[1][2]]
    }

    inv = () => {
        var mx = [
            this.m[0].concat([1, 0, 0]),
            this.m[1].concat([0, 1, 0]),
            this.m[2].concat([0, 0, 1])
        ]
        const _mulRow = (row, c) => {
            for (var i = 0; i < 6; i++) {
                mx[row][i] = mx[row][i] * c
            }
        }
        const _addRow = (baseRow, addedRow, c) => {
            for (var i = 0; i < 6; i++) {
                mx[baseRow][i] += mx[addedRow][i] * c
            }
        }
        const _swapRow = (row1, row2) => {
            var tmp
            for (var i = 0; i < 6; i++) {
                tmp = mx[row1][i]
                mx[row1][i] = mx[row2][i]
                mx[row2][i] = tmp
            }
        }

        if (Math.abs(mx[0][0]) < Math.abs(mx[1][0])) {
            _swapRow(0, 1)
        }
        _addRow(1, 2, -mx[1][2])
        _addRow(0, 2, -mx[0][2])
        _mulRow(0, 1/mx[0][0])
        _addRow(1, 0, -mx[1][0])
        _mulRow(1, 1/mx[1][1])
        _addRow(0, 1, -mx[0][1])

        return new TransformMatrix(
            mx[0][3], mx[1][3],
            mx[0][4], mx[1][4],
            mx[0][5], mx[1][5]
        )
    }

    mul = (m2) => {
        if (typeof m2 == 'number') {
            //scalar multiplication
            return new TransformMatrix(
                this.m[0][0] * args.scalar, this.m[1][0] * m2,
                this.m[0][1] * args.scalar, this.m[1][1] * m2,
                this.m[0][2] * args.scalar, this.m[1][2] * m2
            )
        } else if (m2 instanceof TransformMatrix) {
            //matrix multiplication
            var m1 = this
            const _scMul = (row, col) => {
                var x = 0
                for (var i = 0; i < 3; i++) {
                    x += m1.m[row][i] * m2.m[i][col]
                }
                return x
            }
            return new TransformMatrix(
                _scMul(0, 0), _scMul(1, 0),
                _scMul(0, 1), _scMul(1, 1),
                _scMul(0, 2), _scMul(1, 2)
            )
        } else {
            throw "invalid arguments"
        }
    }

    add = (m2) => {
        return new TransformMatrix(
            this.m[0][0] + m2.m[0][0], this.m[1][0] + m2.m[1][0],
            this.m[0][1] + m2.m[0][1], this.m[1][1] + m2.m[1][1],
            this.m[0][2] + m2.m[0][2], this.m[1][2] + m2.m[1][2]
        )
    }

    sub = (m2) => {
        return new TransformMatrix(
            this.m[0][0] - m2.m[0][0], this.m[1][0] - m2.m[1][0],
            this.m[0][1] - m2.m[0][1], this.m[1][1] - m2.m[1][1],
            this.m[0][2] - m2.m[0][2], this.m[1][2] - m2.m[1][2]
        )
    }

    det = () => {
        return this.m[0][0] * this.m[1][1] - this.m[0][1] * this.m[1][0]
    }

    isRegular = () => {
        return !ZeroTest.isZero(this.det())
    }

    isSingular = () => {
        return ZeroTest.isZero(this.det())
    }

    _transform = (data) => {
        var m1 = this
        const _scMul = (row) => {
            var x = 0
            for (var i = 0; i < 3; i++) {
                x += m1.m[row][i] * data[i]
            }
            return x
        }
        return [_scMul(0), _scMul(1)]
    }

    transformPoint = (p) => {
        var transformed = this._transform([p.x, p.y, 1])
        return new Point(transformed[0], transformed[1])
    }

    transformVector = (v) => {
        var transformed = this._transform([v.x, v.y, 0])
        return new Vector(transformed[0], transformed[1])
    }
}
