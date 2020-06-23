import NumberConvertor from '../convertors/number.js';

import MatrixGenerator from '../math/matrix_generator.js';

import AtomicTransformation from './atomic_transformation.js';

import Vector from '../geometry/vector.js';

export default class Translate extends AtomicTransformation
{
    constructor(params)
    {
        super();
        this._checkParam(params, 'vector', Vector);
        this.vector = params.vector;
    }

    getMatrix()
    {
        return MatrixGenerator.translate(this.vector);
    }

    getArgs()
    {
        return [this.vector.x, this.vector.y]
    }

    isCanonical()
    {
        return true;
    }

    static getName()
    {
        return 'translate';
    }

    static getArgsConvertors()
    {
        return [NumberConvertor, NumberConvertor];
    }

    static argsToParams(args)
    {
        var x, y;
        if (args.length < 1 || args.length > 3) {
            throw "Invalid number of arguments for a translation";
        }

        x = args[1];
        y = (args.length >= 2) ? args[2] : 0;

        return {"vector": new Vector(x, y)};
    }
}
