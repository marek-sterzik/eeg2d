export default class Convertor
{
    static _args = null;

    static parse(string, args)
    {
        var key = null;
        if (this.getCustomParserKey) {
            key = this.getCustomParserKey();
        }
        var parsedObject;
        if (key !== null && key in args && args.key !== null) {
            parsedObject = args[key].call(string, string, args);
        } else {
            var tmpArgs = this._args;
            this._args = args;
            parsedObject = this.parseDefault(string);
            this._args = tmpArgs;
        }

        this._matchType(parsedObject, true);

        return parsedObject;
    }

    static toString(data, args)
    {
        this._matchType(data, false);

        var key = null;
        if (this.getCustomToStringKey) {
            key = this.getCustomToStringKey();
        }
        var string;
        if (key !== null && key in args && args.key !== null) {
            string = args[key].call(data, data, args);
        } else {
            var tmpArgs = this._args;
            this._args = args;
            string = this.toStringDefault(data);
            this._args = tmpArgs;
        }

        return string;
    }

    static _matchType(data, parseMode)
    {
        var objectClasses = null;
        if (this.getObjectClass) {
            objectClasses = this.getObjectClass();
        }

        if (objectClasses === null || objectClasses === undefined) {
            return;
        }

        if (!(objectClasses instanceof Array)) {
            objectClasses = [objectClasses];
        }

        var names = [];
        for (var i = 0; i < objectClasses.length; i++) {
            if (typeof objectClasses[i] === 'string') {
                if (typeof data === objectClasses[i]) {
                    return;
                }
            } else {
                if (data instanceof objectClasses[i]) {
                    return;
                }
            }
            names.push(objectClasses[i].name);
        }
        
        var error;

        if (parseMode) {
            error = "Cannot parse string: got an object of type " + data.constructor.name + " but expected one of " + names.join(', ');
        } else {
            error = "Cannot convert to string: got an object of type " + data.constructor.name + " but expected one of " + names.join(', ');
        }

        throw error;
    }

    static getArgs()
    {
        return this._args;
    }

    static getArg(args, defaultValue)
    {
        if (typeof args === 'string') {
            args = [args];
        }

        var arg = undefined;
        for (var i = 0; i < args.length; i++) {
            if (args[i] in this._args && this._args[args[i]] !== undefined) {
                arg = this._args[args[i]];
            }
        }

        if (arg === undefined) {
            arg = (defaultValue === undefined) ? null : defaultValue;
        }

        return arg;
    }
}
