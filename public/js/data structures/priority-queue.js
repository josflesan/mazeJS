// Priority Queue Data Structure Used for A* Algorithm

class PriorityQueue {

    /**
     * Constructor for PQ that initializes it to an empty list
     * Items in the PQ qwil
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

        // Find the smallest among the roots, left child and right child
        let smallest = i
        let leftChild = 2 * i + 1
        let rightChild = 2 * i + 2

        if (leftChild < lengthQueue && this._items[smallest].fScore > this._items[leftChild].fScore) {
            smallest = leftChild
        }

        if (rightChild < lengthQueue && this._items[smallest].fScore > this._items[rightChild].fScore) {
            smallest = rightChild
        }

        // Swap and continue heapifying if the root is not the largest
        if (smallest != i) {
            let temp = this._items[i]
            this._items[i] = this._items[smallest]
            this._items[smallest] = temp
            this.heapify(smallest)
        }
    }

    /**
     * Function that pops the minimum value from the PQ
     * @return {Object} The root node of the PQ
     */
    popHeap() {
        let lengthPQ = this._items.length

        // Save the head of the PQ
        let headPQ = this._items[0]

        // Swap last leaf and root node
        let temp = this._items[0]
        this._items[0] = this._items[lengthPQ - 1]
        this._items[lengthPQ - 1] = temp  // Move node to be deleted to end of PQ

        // Remove last leaf from consideration
        this._items.pop()

        // Repair downward
        this.heapify(0)

        return headPQ
    }

    /**
     * Function that returns the smallest value in the PQ without
     * popping it from the Priority Queue
     * @return {Object}  The object at the root of the heap
     */
    peek() {
        return this._items[0]
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
            for (let i = (this._items.length - 1) / 2; i > -1; i--) {
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
    
    /**
     * Simple function to determine whether PQ is empty or not
     * @returns {Boolean}   True if the PQ is empty, otherwise false
     */
    isEmpty() {
        return this._items.length == 0
    }

    /**
     * Function that prints out the items in the heap
     */
    print() {
        console.log(this._items)
    }

}

export { PriorityQueue }