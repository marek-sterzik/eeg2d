export default class Convertor extends Convertor
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

        var objectClass = null;
        if (this.getObjectClass) {
            objectClass = this.getObjectClass();
        }

        if (objectClass !== null && !(parsedObject instanceof objectClass)) {
            throw "Cannot parse "+this.name;
        }

        return parsedObject;
    }

    static toString(data, args)
    {
        var objectClass = null;
        if (this.getObjectClass) {
            objectClass = this.getObjectClass();
        }

        if (objectClass !== null && !(data instanceof objectClass)) {
            throw "Cannot convert to string, " + this.name + " expected";
        }

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
}
