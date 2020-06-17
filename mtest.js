#!/usr/bin/node

import {Vector, Point, Angle, Transformation, StringConvertor} from "./src/eeg2d.js";
import RegexpUtil from './src/utility/regexp_util.js';

StringConvertor.get({
    "number.output.percision": 4,
}).setDefault();

//var transformation = Transformation.skewY(Angle.deg(45));
//var transformation = Transformation.scale(2, -3);
var t1 = Transformation.translate(1, 1);
var t2 = Transformation.rotate(Angle.deg(45));
var t3 = Transformation.scale(2, -3);
var t4 = Transformation.skewX(Angle.deg(45));

var transformation = t1.compose(t2).compose(t3).compose(t4);

transformation = transformation.decompose();

console.log(transformation.toString());

var v = new Vector(1, 2);
console.log(v.toString())

var p = new Point(1, 2);
console.log(p.toString())

var stringTransformation = "translate( 1 , 1 ) rotate( 200grad ) scale( 2 , -3 ) skewX( 45 )";
transformation = new Transformation(stringTransformation);

console.log(transformation.toString());


var v = new Point("[4 2]");
console.log(v);
