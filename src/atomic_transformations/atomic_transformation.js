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

    static instantiate(params)
    {
        if (! 'type' in params) {
            throw "missing field: type";
        }
        var type = params.type;

        if (!type in registeredAtomicTransformations) {
            throw "Unknown atomic transformation: " + type;
        }

        var atomicTransformation = registeredAtomicTransformations[type];
        
        return new atomicTransformation(params);
    }

    static getName()
    {
        throw "This method is abstract";
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
