// Priority Queue Data Structure Used for A* Algorithm

class PriorityQueue {

    /**
     * Constructor for PQ that initializes it to an empty list
     */
    constructor() {
        this._items = []
    }

    /**
     * Function that heapifies the tree if not already heapified.
     * A heapified tree satisfies the heap invariant such that every
     * parent node in the tree is ordered with respect to its children
     * @param {Integer} i       The position of the root node in the items array
     */
    heapify(i) {
        let lengthQueue = this._items.length

        // Find the largest among the roots, left child and right child
        largest = i
        leftChild = 2 * i + 1
        rightChild = 2 * i + 1

        if (leftChild < lengthQueue && this._items[i] < this._items[leftChild]) {
            largest = leftChild
        }

        if (rightChild < lengthQueue && this._items[largest] < this._items[rightChild]) {
            largest = rightChild
        }

        // Swap and continue heapifying if the root is not the largest
        if (largest != i) {
            let temp = this._items[i]
            this._items[i] = this._items[largest]
            this._items[largest] = temp
            this.heapify(lengthQueue, largest)
        }
    }

    /**
     * Function that inserts an element into the priority queue, 
     * making sure to heapify the tree after doing so
     * @param {Any} newElement      The new element being inserted into the PQ
     */
    insert(newElement) {
        if (this._items.length == 0) {
            this._items.push(newElement)
        } 
        else {
            this._items.push(newElement)
            for (let i = (this._items.length / 2) - 1; i > -1; i--) {
                this.heapify(this._items, this._items.length, i)
            }
        }
    }

    /**
     * Function that deletes a node in the Priority Queue
     * by moving it to the end and popping it from the list
     * @param {Integer} num         The value in the PQ to be deleted
     */
    deleteNode(num) {
        let lengthPQ = this._items.length
        let pos = 0
        for (let i = 0; i < lengthPQ; i++) {
            if (num == this._items[i]) {
                pos = i
                break
            }
        }

        let temp = this._items[pos]
        this._items[pos] = this._items[lengthPQ - 1]
        this._items[lengthPQ - 1] = temp  // Move node to be deleted to end of PQ

        this._items.pop()  // Remove the last element in the PQ

        for (let i = (lengthPQ / 2) - 1; i > -1; i--) {
            this.heapify(this._items, this._items.length, i)
        }
    }
    
}

export { PriorityQueue }