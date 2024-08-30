const intdiv = (a, b) => (a - (a%b))/b
const getParentIndex = (index) => intdiv(index + 1, 2) - 1
const getFirstChildIndex = (index) => index * 2 + 1
const getSmallestChildIndex = (index, heap, comparator) => {
    const firstChild = getFirstChildIndex(index)
    if (firstChild >= heap.length) {
        return null
    }
    const secondChild = firstChild + 1
    if (secondChild >= heap.length) {
        return firstChild
    }
    if (comparator(heap[firstChild].data, heap[secondChild].data) > 0) {
        return secondChild
    }
    return firstChild
}
const swapWithParent = (index, heap) => {
    if (index > 0) {
        const parentIndex = getParentIndex(index)
        const tmp = heap[parentIndex]
        heap[parentIndex] = heap[index]
        heap[index] = tmp
        heap[parentIndex].index = parentIndex
        heap[index].index = index
    }
}

const shouldBeSwappedWithParent = (index, heap, comparator) => {
    if (index > 0) {
        const parentIndex = getParentIndex(index)
        if (comparator(heap[parentIndex].data, heap[index].data) > 0) {
            return true
        }
    }
    return false
}

export default class Heap
{
    constructor(comparator)
    {
        this.comparator = comparator
        this.heap = []
        this.weakMap = new WeakMap()
    }

    findMin()
    {
        if (this.heap.length > 0) {
            return this.heap[0].data
        }
        return null
    }

    removeMin()
    {
        const item = this.findMin()
        this.remove(item)
        return item
    }

    remove(item)
    {
        if (item !== null && item !== undefined && this.weakMap.has(item)) {
            const heapItem = this.weakMap.get(item)
            const index = heapItem.index
            this.weakMap.delete(item)
            const heapItem2 = this.heap.pop()
            if (index < this.heap.length) {
                heapItem2.index = index
                this.heap[index] = heapItem2
                this.bubble(index)
            }
        }
    }

    all()
    {
        return this.heap.map(x => x.data)
    }
    
    put(item)
    {
        if (item !== null && item !== undefined) {
            var i
            if (!this.weakMap.has(item)) {
                i = this.heap.length
                const record = {"index": i, "data": item}
                this.heap[i] = record
                this.weakMap.set(item, record)
            } else {
                item = this.weakMap.get(item)
                i = item.index
            }
            this.bubble(i)
        }
    }

    has(item)
    {
        return this.weakMap.has(item)
    }

    bubble(index)
    {
        var bubbleDown = true
        while (shouldBeSwappedWithParent(index, this.heap, this.comparator)) {
            bubbleDown = false
            swapWithParent(index, this.heap)
            index = getParentIndex(index)
        }

        if (bubbleDown) {
            index = getSmallestChildIndex(index, this.heap, this.comparator)
            while (index !== null && shouldBeSwappedWithParent(index, this.heap, this.comparator)) {
                swapWithParent(index, this.heap)
                index = getSmallestChildIndex(index, this.heap, this.comparator)
            }
        }
    }
}

