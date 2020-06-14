import Point from './point.js';
import Vector from './vector.js';
import ZeroTest from './zerotest.js';

export default class TransformMatrix
{
    constructor(a, b, c, d, e, f)
    {
        this.m = [
            [a, c, e],
            [b, d, f],
            [0, 0, 1]
        ];
        Object.freeze(this);
        Object.freeze(this.m);
        Object.freeze(this.m[0]);
        Object.freeze(this.m[1]);
    }

    inv()
    {
        var mx = [
            this.m[0].concat([1, 0, 0]),
            this.m[1].concat([0, 1, 0]),
            this.m[2].concat([0, 0, 1])
        ];
        var _mulRow = function(row, c) {
            for (var i = 0; i < 6; i++) {
                mx[row][i] = mx[row][i] * c;
            }
        }
        var _addRow = function(baseRow, addedRow, c) {
            for (var i = 0; i < 6; i++) {
                mx[baseRow][i] += mx[addedRow][i] * c;
            }
        }
        var _swapRow = function(row1, row2) {
            var tmp;
            for (var i = 0; i < 6; i++) {
                tmp = mx[row1][i];
                mx[row1][i] = mx[row2][i];
                mx[row2][i] = tmp;
            }
        }

        if (Math.abs(mx[0][0]) < Math.abs(mx[1][0])) {
            _swapRow(0, 1);
        }
        _addRow(1, 2, -mx[1][2]);
        _addRow(0, 2, -mx[0][2]);
        _mulRow(0, 1/mx[0][0]);
        _addRow(1, 0, -mx[1][0]);
        _mulRow(1, 1/mx[1][1]);
        _addRow(0, 1, -mx[0][1]);
        return new TransformMatrix(
            mx[0][3], mx[1][3],
            mx[0][4], mx[1][4],
            mx[0][5], mx[1][5],
        );
    }

    mul(m2)
    {
        var m1 = this;
        var _scMul = function(row, col) {
            var x = 0;
            for (var i = 0; i < 3; i++) {
                x += m1.m[row][i] * m2.m[i][col];
            }
            return x;
        };
        return new TransformMatrix(
            _scMul(0, 0), _scMul(1, 0),
            _scMul(0, 1), _scMul(1, 1),
            _scMul(0, 2), _scMul(1, 2),
        );
    }

    det()
    {
        return this.m[0][0] * this.m[1][1] - this.m[0][1] * this.m[1][0];
    }

    isRegular()
    {
        return !ZeroTest.isZero(this.det());
    }

    isSingular()
    {
        return ZeroTest.isZero(this.det());
    }

    getSingleSingularVector()
    {
        var a, b;
        if (!ZeroTest.isZero(this.m[0][0]) || !ZeroTest.isZero(this.m[0][1])) {
            return (new Vector(this.m[0][1], -this.m[0][0])).normalize();
        } else if (!ZeroTest.isZero(this.m[1][0]) || !ZeroTest.isZero(this.m[1][1])) {
            return (new Vector(this.m[1][1], -this.m[1][0])).normalize();
        } else {
            return null;
        }
    }

    _transform(data)
    {
        var m1 = this;
        var _scMul = function(row) {
            var x = 0;
            for (var i = 0; i < 3; i++) {
                x += m1.m[row][i] * data[i];
            }
            return x;
        };
        return [_scMul(0), _scMul(1)];
    }

    transformPoint(p)
    {
        var transformed = this._transform([p.x, p.y, 1]);
        return new Point(transformed[0], transformed[1]);
    }

    transformVector(v)
    {
        var transformed = this._transform([v.x, v.y, 0]);
        return new Vector(transformed[0], transformed[1]);
    }
}
