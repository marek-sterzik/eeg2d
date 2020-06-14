#!/usr/bin/node



function main(geometry)
{
    const {Vector, Angle, Transformation} = geometry
    var v = new Vector(1, 2);
    //var transformation = Transformation.skewY(Angle.inDegrees(45));
    //var transformation = Transformation.scale(2, -3);
    var t1 = Transformation.translate(1, 1);
    var t2 = Transformation.rotate(Angle.inDegrees(45));
    var t3 = Transformation.scale(2, -3);
    var t4 = Transformation.skewX(Angle.inDegrees(45));

    var transformation = t1.compose(t2).compose(t3).compose(t4);

    var decomposition = transformation.decompose();

    console.log(decomposition.toString());
}

import('./geometry.js').then(main);
