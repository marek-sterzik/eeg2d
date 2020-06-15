export default class Convertor
{
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
            parsedObject = this.parseDefault(string, args);
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
            string = this.toStringDefault(data, args);
        }

        return string;
    }

    static _matchType(data, parseMode)
    {
        var objectClasses = null;
        if (this.getObjectClass) {
            objectClasses = this.getObjectClass();
        }

        if (objectClasses === null) {
            return;
        }

        if (!(objectClasses instanceof Array)) {
            objectClasses = [objectClasses];
        }

        var names = [];
        for (var i = 0; i < objectClasses.length; i++) {
            if (data instanceof objectClasses[i]) {
                return;
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

    static getArg(convertorArgs, args, defaultValue)
    {
        if (typeof args === 'string') {
            args = [args];
        }

        var arg = undefined;
        for (var i = 0; i < args.length; i++) {
            if (args[i] in convertorArgs && convertorArgs[args[i]] !== undefined) {
                arg = convertorArgs[args[i]];
            }
        }

        if (arg === undefined) {
            arg = defaultValue;
        }

        return arg;
    }
}
