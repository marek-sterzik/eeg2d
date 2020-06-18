export default class AtomicTransformation
{
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
