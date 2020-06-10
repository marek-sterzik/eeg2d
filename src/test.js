#!/usr/bin/node

import {Vector, Angle} from "./geometry";
import Utility from "./utility";
import Transformation from "./transformation";


var v = new Vector(1,2);
var transformation = Transformation.skewY(Angle.inDegrees(45));
//var transformation = Transformation.scale(2, -3);
//var transformation = Transformation.rotation(Angle.inDegrees(45));

var decomposition = transformation.decompose();

console.log(decomposition.toString());
