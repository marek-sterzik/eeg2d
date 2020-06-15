#!/usr/bin/node

function main(geometry)
{
    const {Vector, Point, Angle, Transformation, StringConvertor} = geometry

    StringConvertor.getDefault({
        "output.percision": 4,
        "output.showAngleDefaultUnit": true,
    }).setDefault();
    
    //var transformation = Transformation.skewY(Angle.inDegrees(45));
    //var transformation = Transformation.scale(2, -3);
    var t1 = Transformation.translate(1, 1);
    var t2 = Transformation.rotate(Angle.inDegrees(45));
    var t3 = Transformation.scale(2, -3);
    var t4 = Transformation.skewX(Angle.inDegrees(45));

    var transformation = t1.compose(t2).compose(t3).compose(t4);

    transformation = transformation.decompose();

    console.log(transformation.toString());

    var v = new Vector(1, 2);
    console.log(v.toString())
    
    var p = new Point(1, 2);
    console.log(p.toString())
}

import('../src/eeg2d.js').then(main);
