import NumberConvertor from '../convertors/number.js';

import TransformationMatrix from '../math/matrix.js';

import AtomicTransformation from './atomic_transformation.js';

export default class Matrix extends AtomicTransformation
{
    constructor(params)
    {
        super();
        this._checkParam(params, 'matrix', TransformationMatrix);
        this.matrix = params.matrix;
    }

    getMatrix()
    {
        return this.matrix;
    }

    getArgs()
    {
        return [
            this.matrix.m[0][0], this.matrix.m[1][0],
            this.matrix.m[0][1], this.matrix.m[1][1],
            this.matrix.m[0][2], this.matrix.m[1][2]
        ];
    }

    isCanonical()
    {
        return true;
    }

    static getName()
    {
        return 'matrix';
    }

    static getArgsConvertors()
    {
        return [NumberConvertor, NumberConvertor, NumberConvertor, NumberConvertor, NumberConvertor, NumberConvertor];
    }

    static argsToParams(args)
    {
        if (args.length != 6) {
            throw "Invalid number of arguments for a matrix transformation";
        }

        var matrix = new TransformationMatrix(args[0], args[1], args[2], args[3], args[4], args[5]);

        return {"matrix": matrix};
    }
}
