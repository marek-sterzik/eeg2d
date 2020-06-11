#!/usr/bin/node



function main(geometry)
{
    const {Vector, Angle, Transformation} = geometry
    var v = new Vector(1,2);
    var transformation = Transformation.skewY(Angle.inDegrees(45));
    //var transformation = Transformation.scale(2, -3);
    //var transformation = Transformation.rotation(Angle.inDegrees(45));

    var decomposition = transformation.decompose();

    console.log(decomposition.toString());
}

import('./geometry.js').then(main);
