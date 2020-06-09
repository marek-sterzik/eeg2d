export default class Utility
{
    constructor()
    {
        console.log("construct Utility");
    }

    static args()
    {
        if (arguments.length == 0) {
            return null;
        }

        var argsToProcess = arguments[0];
        var argDescriptions = [];
        var wasVariadic = false;
        var wasDefault = false;
        var minArguments = 0;
        var maxArguments = 0;
        for (var i = 1; i < arguments.length; i++) {
            var arg = this._normalizeArg(arguments[i]);
            if (arg === null) {
                throw "unknown argument definition";
            }

            if (wasVariadic) {
                throw "only the last argument is allowed to be variadic";
            }

            maxArguments++;
            if ("default" in arg) {
                wasDefault = true;
            } else {
                if (!arg.variadic) {
                    minArguments++;
                }
                if (wasDefault) {
                    throw "default arguments needs to be at the end of the argument list";
                }
            }

            if (arg.variadic) {
                wasVariadic = true;
            }

            argDescriptions.push(arg);
        }

        if (wasVariadic) {
            maxArguments = argsToProcess.length;
        }

        if (argsToProcess.length < minArguments) {
            return null;
        }

        if (maxArguments !== null && argsToProcess.length > maxArguments) {
            return null;
        }

        var argsToReturn = {};
        for (var i = 0; i < argDescriptions.length; i++) {
            var arg = argDescriptions[i];
            if (arg.variadic) {
                if (i < argsToProcess.length) {
                    var value = [];
                    for (var j = i; j < argsToProcess.length; j++) {
                        if (!this._testArg(arg, argsToProcess[j])) {
                            return null;
                        }
                        value.push(argsToProcess[j]);
                    }
                    argsToReturn[arg.name] = value;
                } else {
                    if ("default" in arg) {
                        argsToReturn[arg.name] = arg.default;
                    } else {
                        argsToReturn[arg.name] = [];
                    }
                }
            } else {
                if (i < argsToProcess.length) {
                    var value = argsToProcess[i];
                    if (!this._testArg(arg, value)) {
                        return null;
                    }
                    argsToReturn[arg.name] = value;
                } else {
                    argsToReturn[arg.name] = arg.default;
                }
            }
        }

        return argsToReturn;
    }

    static _normalizeArg(arg)
    {
        if (typeof arg === 'string') {
            arg = [arg];
        }

        if (arg instanceof Array) {
            arg = this._argFromArray(arg);
        }

        if (typeof arg !== 'object') {
            throw "invalid argument";
        }

        if ('variadic' in arg) {
            arg.variadic = arg.variadic ? true : false;
        } else {
            arg.variadic = false;
        }
        if (!('name' in arg)) {
            throw "each argument needs a name";
        }

        if (typeof arg.name !== 'string') {
            throw "argument names needs to be strings";
        }

        return arg;
    }

    static _argFromArray(ar)
    {
        ar = this._flattenArray(ar);
        
        if (ar.length < 1) {
            throw "invalid argument description: description too short";
        }

        if (typeof ar[0] !== 'string') {
            throw "invalid argument description: missing name";
        }

        var mode = 'type';
        var arg = {};
        arg.name = ar[0];
        arg.variadic = false;

        for (var i = 1; i < ar.length; i++) {
            var item = ar[i];
            if (typeof item === 'string') {
                if (item === 'variadic') {
                    arg.variadic = true;
                } else if (item === 'check' || item === 'type' || item === 'default') {
                    mode = item;
                } else {
                    if ('type' in arg) {
                        throw "invalid argument description: type already defined";
                    }
                    arg.type = item;
                }
            } else {
                if (mode in arg) {
                    throw "invalid argument description: "+mode+" already defined";
                }
                if (mode === 'check' && typeof item !== 'function') {
                    throw "invalid argument description";
                }
                arg[mode] = item;
            }
        }

        return arg;
    }

    static _flattenArray(ar)
    {
        var flatArray = [];
        for (var i = 0; i < ar.length; i++) {
            var item = ar[i];
            if (typeof item === 'string') {
                var splitted = item.split(/:/);
                for (var j = 0; j < splitted.length; j++) {
                    if (splitted[j] !== '') {
                        flatArray.push(splitted[j]);
                    }
                }
            } else if (item instanceof Array) {
                var partialFlatArray = this._flattenArray(item);
                for (var j = 0; j < partialFlatArray.length; j++) {
                    flatArray.push(partialFlatArray[j]);
                }
            } else {
                flatArray.push(item);
            }
        }
        return flatArray;
    }

    static _testArg(arg, value)
    {
        if ("type" in arg) {
            var typeType = typeof arg.type;
            if (typeType === 'string') {
                if (typeof value !== arg.type) {
                    return false;
                }
            } else if (typeType === 'function') {
                if (!(value instanceof arg.type)) {
                    return false;
                }
            } else {
                return false;
            }
        }

        if ("check" in arg) {
            var checker = arg.check;
            if (!checker(value)) {
                return false;
            }
        }

        return true;
    }
}
