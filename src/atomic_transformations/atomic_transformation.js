import Point from "../geometry/point.js";

var registeredAtomicTransformations = {};

export default class AtomicTransformation
{
    static register(transformation)
    {
        if (!transformation instanceof this) {
            throw "Cannot register an object not being an instance of AtomicTransformation";
        }

        var name = transformation.getName();

        if (name in registeredAtomicTransformations) {
            throw "Atomic transformation of name '" + name + "' is already defined";
        }

        registeredAtomicTransformations[name] = transformation;
    }

    static getAtomicTransformationClassByType(type)
    {
        if (!type in registeredAtomicTransformations) {
            throw "Unknown atomic transformation: " + type;
        }

        return registeredAtomicTransformations[type];
    }

    static instantiate(params)
    {
        if (! 'type' in params) {
            throw "missing field: type";
        }

        var atomicTransformation = this.getAtomicTransformationClassByType(params.type);
        
        return new atomicTransformation(params);
    }

    static getName()
    {
        throw "This method is abstract";
    }

    static getArgsConvertors()
    {
        throw "This method is abstract";
    }

    static getNonCanonicalArgsConvertors()
    {
        return this.getArgsConvertors();
    }

    getCanonizedTransformations()
    {
        if(this.isCanonical()) {
            return [this];
        } else {
            return this.getNonNanonicalToCanonizedTransformations();
        }
    }

    getNonCanonicalToCanonizedTransformations()
    {
        return [AtomicTransformation.instantiate({"type": "matrix", "matrix": this.getMatrix()})];
    }

    getShiftTransformations(transformation, centerPoint)
    {
        var v = Point.origin().vectorTo(centerPoint);
        var t1 = {"type": "translate", "vector": v.mul(-1)};
        var t2 = {"type": "translate", "vector": v.mul};
        return [
            AtomicTransformation.instantiate(t1),
            AtomicTransformation.instantiate(transformation),
            AtomicTransformation.instantiate(t2)
        ];
    }

    getClass()
    {
        return this.constructor;
    }

    getName()
    {
        return this.getClass().getName();
    }

    getArgsConvertors()
    {
        return this.getClass().getArgsConvertors();
    }

    getNonCanonicalArgsConvertors()
    {
        return this.getClass().getNonCanonicalArgsConvertors();
    }

    getArgs()
    {
        throw "This method is abstract";
    }

    getNonCanonicalArgs()
    {
        return this.getArgs();
    }

    _checkParam(params, key, type)
    {
        if (!key in params) {
            throw "expected param " + key;
        }

        if (typeof type === 'string') {
            if (typeof params[key] !== type) {
                throw "" + key + " is expected to be " + type + ", " + (typeof params[key]) + " given";
            }
        } else {
            if (!params[key] instanceof type) {
                throw "" + key + " has invalid type";
            }
        }
    }
}
