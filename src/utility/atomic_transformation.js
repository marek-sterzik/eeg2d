import AtomicTransformation from "../atomic_transformations/atomic_transformation.js"

import Matrix from "../atomic_transformations/matrix.js"
import Rotate from "../atomic_transformations/rotate.js"
import Scale from "../atomic_transformations/scale.js"
import Skew from "../atomic_transformations/skew.js"
import SkewX from "../atomic_transformations/skew_x.js"
import SkewY from "../atomic_transformations/skew_y.js"
import Translate from "../atomic_transformations/translate.js"


AtomicTransformation.register(Matrix)
AtomicTransformation.register(Rotate)
AtomicTransformation.register(Scale)
AtomicTransformation.register(Skew)
AtomicTransformation.register(SkewX)
AtomicTransformation.register(SkewY)
AtomicTransformation.register(Translate)

export default AtomicTransformation
