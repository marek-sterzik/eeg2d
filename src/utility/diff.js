import Heap from "./heap.js"

class State
{
    constructor(x, y, len, a, b)
    {
        this.x = x
        this.y = y
        this.len = len
        const add = Math.min(a-x, b-y)
        this.expectedLen = a + b - x - y - 2 * add
    }
}

class StateHeap
{
    constructor(a, b)
    {
        this.a = a
        this.b = b
        this.heap = new Heap((a, b) => a.expectedLen - b.expectedLen)
    }

    put(x, y, len)
    {
        const state = new State(x, y, len, this.a, this.b)
        this.heap.put(state)
    }

    empty()
    {
        return this.heap.findMin() === null
    }

    removeMin()
    {
        return this.heap.removeMin()
    }
}

class Map
{
    constructor(a, b)
    {
        this.a = a
        this.b = b
        this.map = {}
    }

    put(x, y, len, dir)
    {
        const key = x + "-" + y
        this.map[key] = {len, dir}
    }

    get(x, y)
    {
        const key = x + "-" + y
        if (key in this.map) {
            return this.map[key]
        }
        return null
    }

    getFinal()
    {
        return this.get(this.a, this.b)
    }

    path()
    {
        var x = this.a
        var y = this.b
        var path = ""
        while(x > 0 || y > 0) {
            var current = this.get(x, y)
            if (current === null) {
                throw "Bug"
            }
            var dir = current.dir
            path = dir + path
            if (dir === "+") {
                x--
            } else if (dir === '-') {
                y--
            } else if (dir === '=') {
                x--
                y--
            } else {
                throw "Bug 2"
            }
            if (x < 0 || y < 0) {
                throw "Bug 3"
            }
        }
        const flush = (state) => {
            for (var i = 0; i < state.plus; i++) {
                state.result.push("+")
            }
            for (var i = 0; i < state.minus; i++) {
                state.result.push("-")
            }
            state.plus = 0
            state.minus = 0
        }
        var state = {"result": [], "plus": 0, "minus": 0}
        for (var x of path.split('')) {
            if (x === '+') {
                state.plus++
            } else if (x === '-') {
                state.minus++
            } else {
                flush(state)
                state.result.push(x)
            }
        }
        flush(state)
        return state.result
    }
}

const doStep = (heap, map, item, xShift, yShift, lenShift, dir) => {
    const x = item.x + xShift
    const y = item.y + yShift
    const len = item.len + lenShift
    const current = map.get(x, y)
    if (current === null || current.len > len) {
        map.put(x, y, len, dir)
        heap.put(x, y, len)
    }
}

const diff = (a, b) => {
    const heap = new StateHeap(a.length, b.length)
    const map = new Map(a.length, b.length)
    var finalRecord = null
    heap.put(0, 0, 0)
    map.put(0, 0, 0, "")
    while(!heap.empty()) {
        var item = heap.removeMin()
        if (finalRecord !== null && finalRecord.len <= item.expectedLen) {
            break
        }
        var goRight = (item.x < a.length)
        var goDown  = (item.y < b.length)
        if (goRight && goDown && a[item.x] === b[item.y]) {
            doStep(heap, map, item, 1, 1, 0, "=")
        }
        if (goRight) {
            doStep(heap, map, item, 1, 0, 1, "+")
        }
        if (goDown) {
            doStep(heap, map, item, 0, 1, 1, "-")
        }
        finalRecord = map.getFinal()
    }
    if (finalRecord !== null) {
        return map.path()
    }
    return null
}

export default diff
