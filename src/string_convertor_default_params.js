export let StringConvertorDefaultParams = {
    // the angle unit considered as default ['deg', 'rad', 'grad', 'turn', null]:
    'angle.defaultUnit': 'deg',
    
    // the real units being used (object defining for each unit the input/output)
    'angle.units':  {'deg': ['deg'], 'rad': ['rad'], 'grad': ['grad'], 'turn': ['turn']},
    
    // the unit used to output angles ['deg', 'rad', 'grad', 'turn']:
    'angle.output.unit': 'deg',

    // set to true if the default unit should be output [true, false]:
    'angle.output.showDefaultUnit': false,

    // the string to be used as unit separator for angles:
    'angle.output.unitSeparator': '',

    // the space being ignored in the angle (also used for trimming the unit separator)
    'angle.input.space': /\s+/,

    // specify if the unit reader is case sensitive or not
    'angle.input.unitsCaseSensitive': true,

    // the percision to be used to output numbers (number or null)
    'number.output.percision': null,

    // space accepted arround numbers
    'number.input.space': /\s+/,

    // the delimeter between point coordinates
    'point.output.delimeter': ', ',
    
    // the parenthesis used to output a point
    'point.output.parenthesis': ['[', ']'],
    
    // the space being ignored in the point
    'point.input.space': /\s+/,

    // the delimeter between point coordinates
    'point.input.delimeter': /\s*[, ]\s*/,
    
    // the delimeter between point coordinates
    'point.input.parenthesis': [/[\[\(]?/, /[\]\)]?/],
    
    // the delimeter between vector coordinates
    'vector.output.delimeter': ', ',
    
    // the parenthesis used to output a vector
    'vector.output.parenthesis': ['(', ')'],
    
    // the space being ignored in the point
    'vector.input.space': /\s+/,

    // the delimeter between point coordinates
    'vector.input.delimeter': /\s*[, ]\s*/,
    
    // the delimeter between point coordinates
    'vector.input.parenthesis': [/[\[\(]?/, /[\]\)]?/],

    // the delimeter between transformations
    'transformation.output.transformationDelimeter': ' ',

    // the delimeter between fields of the transformation
    'transformation.output.fieldDelimeter': ', ',

    // the parenthesis used to output a transformation
    'transformation.output.parenthesis': ['(', ')'],

    // convert the transformation automatically to canonical form
    'transformation.output.convertToCanonicalForm': true,
    
    // use this suffix in case a transformation should be output as non-canonical
    'transformation.output.nonCanonicalSuffix': '!',

    // the space accepted in the transformation on various places
    'transformation.input.space': /\s+/,

    // the transformation identifier
    'transformation.input.identifier': /[a-zA-Z_][a-zA-Z0-9_]*/,

    // the delimeter between transformations being read
    'transformation.input.transformationDelimeter': /\s/,

    // the delimeter between fields of the transformation
    'transformation.input.fieldDelimeter': /\s*[,\s]\s*/,

    // the parenthesis being parsed for a transformation
    'transformation.input.parenthesis': [ /\s*\(/ , ')'],

    
    // all 'fn.*' params expect either a custom function or null.
    // The function is used to parse/stringify an object.
    // All these functions gets 3 arguments:
    //   1. the string/object itself to be parsed/stringified
    //   2. the string convertor params (use params.get('<param>') to get a single param value)
    //   3. the name of the conversion operation, i.e. the name of the param 'fn.*' itself
    // parser function to be used for transformation

    //vector parser
    'fn.vector.parse': null,

    //vector stringifier
    'fn.vector.toString': null,
    
    //point parser
    'fn.point.parse': null,

    //point stringifier
    'fn.point.toString': null,

    //angle parser
    'fn.angle.parse': null,

    //angle stringifier
    'fn.angle.toString': null,
    
    //transformation parser
    'fn.transformation.parse': null,

    //transformation stringifier
    'fn.transformation.toString': null,

};

export class Reference
{
}
