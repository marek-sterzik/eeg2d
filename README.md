# eeg2d - extended euclidian 2d geometry library for JavaScript

This package contains a library being to able to manipulate 2d objects in the euclidian space.
The biggest advantage of this library is a very powerful representation of 2d linear transformations. It is possible
to represent any linear transformation while being able to decompose it into the basic transformation as
translate, rotate, scale and skew.

## Angles

Creating an angle:
```js
import {Angle} from "eeg2d"

Angle.create(Math.PI) // angle as radians
Angle.zero()          // zero angle
Angle.full()          // 360 degrees, 2PI radians, 1 turn
Angle.straight()      // 180 degrees, PI radians, 1/2 turn
Angle.right()         // 90 degrees, PI/2 radians, 1/4 turn
Angle.rad(Math.PI)    // angle as radians
Angle.deg(180)        // angle as degrees
Angle.grad(200)       // angle as grads
Angle.turn(0.5)       // angle as whole turns
Angle.atan(10)        // arc tangens of 10
```

Angle operations:
```js
angle.deg()           // return angle in degrees
angle.rad()           // return angle in radians
angle.grad()          // return angle in grads
angle.turn()          // return angle in turns

angle.mul(5)          // multiply angle by 5
angle1.add(angle2)    // add two angles
angle1.sub(angle2)    // subtract two angles

angle.normalize()     // get the normalized angle (0 to 360 deg)

angle.sin()           // sinus
angle.cos()           // cosinus
angle.tan()           // tangens
angle.cotan()         // cotangens

angle.isZero()        // test if angle is zero

```

## Vectors

A vector represents a shift in the euclidian 2-dimensional space.

Creating a vector:
```js
import {Vector} from "eeg2d"

Vector.create(1, 2)   // create a vector
Vector.zero()         // zero vector
```

Vector operations:
```js
vector.size()         // size of the vector
vector.sizeSquare()   // the square of the vector (faster than size() because it does not need to comupte the square root)
vector1.add(vector2)  // add two vectors
vector1.sub(vector2)  // subtract two vectors
vector.mul(2)         // multiply vector by 2

vector1.mul(vector2)  // scalar product of two vectors

vector.rot(angle)     // rotate the vector by a given angle clockwise
vector.rot()          // equal to vector.rot(Angle.right())

vector.normalize()    // make unit vector of the same direction

vector1.angleTo(vector2) // angle between two vectors

vector.isZero()       // test if the vector is zero

```

## Points

A point represents a point in the euclidian 2-dimensional space

Creating points:
```js
import {Point} from "eeg2d"

Point.create(1, 2)    // create a point of coordinates x=1 and y=2
Point.origin()        // the origin of the coordinates
```

Point operations:
```js
point1.rot(point2, angle)         // rotate the vector from point1 to point2 by the given angle and get the new point as a result
point.rot(vector, angle)          // similar as above, but point2 is replaced by the vector from point1 to point2

point.addVector(vector)           // add vector to point
point.add(vector)                 // add vector to point (same as addVector)
point1.interpolate(point2)        // find center between two points
point1.interpolate(point2, ratio) // find weighted center between two point (ratio=0 means point1, ratio=1 means point2, ratio=0.5 means the exact center)
point1.distanceTo(point2)         // distance between two points
point1.vectorTo(point2)           // vector from point1 to point2

point.isOrigin()                  // test if the point is the origin

```


## Transformations

Transfromations represent linear (affine) transformations. It is internally represented as a sequence of atomic transformations.

The given sequence of atomic transformations does not affect the point/vector transformations, but may be important for some reasons
(i.e. for interpolations of transformations etc.).


Creating basic transformations:
```js
import {Transformation} from "eeg2d"

angle.getRotation()                // get the rotation transformation according the origin
angle.getRotation(centerPoint)     // get the rotation transformation according the center point
vector.getTranslation()            // get the translation transformation

Transformation.matrix(a, b, c, d, e, f) // get transformation by transformation matrix

Transformation.translate(vector)   // get translation by vector
Transformation.translate(x, y)     // get translation by two numbers representing the translation vector

Transformation.rotate(angle)       // get the rotation according to the origin
Transformation.rotate(angle, centerPoint) // get the rotation according to the centerPoint

Transformation.scale(scaleFactor)
Transformation.scale(scaleFactorX, scaleFactorY)
Transformation.scale(scaleFactor, centerPoint)
Transformation.scale(scaleFactorX, scaleFactorY, centerPoint)

Transformation.skewX(angle)
Transformation.skewX(angle, centerPoint)

Transformation.skewY(angle)
Transformation.skewY(angle, centerPoint)

Transformation.skew(angleX)
Transformation.skew(angleX, angleY)
Transformation.skew(angleX, angleY, centerPoint)

Transformation.identity()         // get the identity transformation

Transformation.twoPoint(a1, b1, a2, b2)  // find the angle-preserving transformation transforming a1 to a2 and b1 to b2
```

Transformation operations:
```js
transformation.getAtomicOperations()     // get the list of atomic operations
transformation.getMatrix()               // get the transformation matrix for the transformation
transformation1.compose(transformation2) // compose two transformations (result is a matrix transformation)
transformation1.concat(transformation2)  // same as compose(), but result is the sequence of both operations
transformation1.join(transformation2)    // exactly the same as concat()
transformation.flatten()                 // make from a sequence of transformation one single matrix transformation
transformation.inv()                     // get the inverse transformation
transfomration.transformPoint(point)     // transform a point according to the transformation
transformation.transformVector(vector)   // transform a vector according to the transformation
transformation.transform(point)          // same as transformPoint()
transformation.transform(vector)         // same as transformVector()

transformation.decompose()               // inverse to flatten() - decompose the transformation to multiple atomic transformations
transformation.canonize()                // convert transformation to a canonical form (use canonical transformations only to represent the result)

atomicTransformation.getName()           // get the name of a single atomic transformation (returned by getAtomicOperations)
atomicTransformation.getArgs()           // get the arguments of the atomic transformation

```

## String conversions

```js
angle.toString()                   // convert angle to string
vector.toString()                  // convert vector to string
point.toString()                   // convert point to string
transformation.toString()          // convert transformation to string
```

**Warning:** String conversions needs to be described more detailed.

# TODO

* transformation interpolation
* better string conversion documentation
