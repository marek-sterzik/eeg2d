# eeg2d - extended euclidian 2d geometry library for JavaScript

This package contains a library being to able to manipulate 2d objects in the euclidian space.
The biggest advantage of this library is a very powerful representation of 2d linear transformations. It is possible
to represent any linear transformation while being able to decompose it into the basic transformation as
translate, rotate, scale and skew.

The current state of the project is just to provide a preview and to test npm publishing. Therefore there is no documentation
yet for this library and no examples how to use it. But hope both will be added soon. The intention is to document the
library as soon as possible.


# TODO

* complete tests for transformation <-> string conversions
    * transformation.output.transformationDelimeter
    * transformation.output.fieldDelimeter
    * transformation.output.parenthesis
    * transformation.output.convertToCanonicalForm
    * transformation.output.nonCanonicalSuffix
    * transformation.input.space
    * transformation.input.identifier
    * transformation.input.transformationDelimeter
    * transformation.input.fieldDelimeter
    * transformation.input.nonCanonicalSuffix
    * transformation.input.parenthesis
    * fn.transformation.parse
    * fn.transformation.toString
* other tests?
* write documentation
* transformation interpolation
