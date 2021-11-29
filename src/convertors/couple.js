import Convertor from "./convertor.js";
import NumberConvertor from "./number.js";

import RegexpUtil from "../utility/regexp_util.js"

export default class CoupleConvertor extends Convertor
{
    static parse(string, params, fnName)
    {   
        var couple = this.parseStringCouple(string, params);
        if (couple === null) {
            throw "cannot parse " + this.getName();
        }

        couple = couple.map(x => params.invokeParse(NumberConvertor, x));

        return this.coupleToObject(couple);
    }

    static parseStringCouple(string, params)
    {
        var name = this.getName();
        var space = new RegexpUtil(params.get(name + '.input.space'));
        var delimeter = new RegexpUtil(params.get(name + '.input.delimeter'));
        var parenthesis = params.get(name + '.input.parenthesis').map(x => new RegexpUtil(x));

        string = space.trim(string);

        var par;

        [par, string] = parenthesis[0].readToken(string);

        if (par === null) {
            return null;
        }

        [par, string] = parenthesis[1].readTokenFromEnd(string);
        
        if (par === null) {
            return null;
        }

        string = space.trim(string);

        var ar = delimeter.split2(string);
        
        if (ar.length != 2) {
            return null;
        }

        var ar2 = delimeter.split2(ar[1]);

        if (ar2.length != 1) {
            return null;
        }

        return ar.map(x => space.trim(x));
    }

    static toString(object, params, fnName)
    {
        var couple = this.objectToCouple(object);
        var delimeter = params.get(this.getName() + '.output.delimeter');
        var parenthesis = params.get(this.getName() + '.output.parenthesis');
        return "" +
            parenthesis[0] +
            params.invokeToString(NumberConvertor, couple[0]) +
            delimeter +
            params.invokeToString(NumberConvertor, couple[1]) +
            parenthesis[1];
    }
}
