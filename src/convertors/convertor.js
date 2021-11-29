export default class Convertor
{

    static getName = () => {
        throw "This method is abstract";
    }

    static accepts = (object) => {
        return true;
    }

    static parse = (string, params, fnName) => {
        throw "This method is abstract";
    }

    static toString = (object, params, fnName) => {
        throw "This method is abstract";
    }
}
