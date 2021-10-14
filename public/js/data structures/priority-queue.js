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
     * Perform a down-heap or heapify-down operation for a min heap
     * @param {Integer} i   The index to start at when heapifying down
     */
    minHeapifyDown(i) {
        let leftChild = 2*i
        let rightChild = 2*i + 1
        let smallest = i

        if (leftChild < this._items.length && 
            this._items[leftChild].fScore < this._items[smallest].fScore) {
            smallest = leftChild
        }

        if (rightChild < this._items.length && 
            this._items[rightChild].fScore < this._items[smallest].fScore) {
            smallest = rightChild
        }

        if (smallest != i) {
            // Swap items[i] and items[smallest]
            let temp = this._items[i]
            this._items[i] = this._items[smallest]
            this._items[smallest] = temp

            this.minHeapify(smallest)
        }
    }

    /**
     * Function that sorts the tree up if it's not heapified.
     * A heapified tree satisfies the heap invariant such that every
     * parent node in the tree is ordered with respect to its children
     * @param {Integer} i       The position of the new node in the items array
     */
    minHeapifyUp(i) {
        // let lengthQueue = this._items.length
        let parentIndex = Math.floor((i - 1) / 2)
        let itemIndex = i

        while (true) {
            let parentItem = this._items[parentIndex]
            let item = this._items[itemIndex]
            if (item.fCost < parentItem.fCost) 
            {
                // Swap item with parent item
                this._items[parentIndex] = item
                this._items[itemIndex] = parentItem
                itemIndex = parentIndex
            }
            else {
                break
            }
            parentIndex = Math.floor((parentIndex - 1) / 2)
            if (parentIndex < 0) {
                break
            }
        }

        // // Find the smallest among the roots, left child and right child
        // let smallest = i
        // let leftChild = 2 * i + 1
        // let rightChild = 2 * i + 2

        // if (leftChild < lengthQueue && this._items[smallest].fScore > this._items[leftChild].fScore) {
        //     smallest = leftChild
        // }

        // if (rightChild < lengthQueue && this._items[smallest].fScore > this._items[rightChild].fScore) {
        //     smallest = rightChild
        // }

        // // Swap and continue heapifying if the root is not the largest
        // if (smallest != i) {
        //     let temp = this._items[i]
        //     this._items[i] = this._items[smallest]
        //     this._items[smallest] = temp
        //     this.heapify(smallest)
        // }
    }

    /**
     * Function that pops the minimum value from the PQ
     * @return {Cell} The root node of the PQ
     */
    popHeap() {
        let lengthPQ = this._items.length

        // Save the head of the PQ and reduce current item count
        let headPQ = this._items[0]

        // Swap last leaf and root node
        let temp = this._items[0]
        this._items[0] = this._items[lengthPQ - 1]
        this._items[lengthPQ - 1] = temp  // Move node to be deleted to end of PQ

        // Remove last leaf from consideration
        this._items.pop()

        // Repair downward
        this.minHeapifyDown(0)

        return headPQ
    }

    /**
     * Function that returns the smallest value in the PQ without
     * popping it from the Priority Queue
     * @return {Cell}  The object at the root of the heap
     */
    peek() {
        return this._items[0]
    }

    /**
     * Function that checks if the list contains a particular element
     * @param {Cell} element    The element we are searching for
     * @return {Boolean}        Whether or not the element was found in the PQ
     */
    contains(element) {
        this._items.forEach((el) => {
            if (el == element) {
                return true
            }
        })

        return false
    }

    /**
     * Function that inserts an element into the priority queue, 
     * making sure to heapify the tree after doing so
     * @param {Cell} newElement      The new element being inserted into the PQ
     */
    insert(newElement) {
        if (this._items.length == 0) {
            this._items.push(newElement)  // Place item at root
        } 
        else {
            this._items.push(newElement)
            this.minHeapifyUp(this._items.length - 1)
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

        this.minHeapifyDown(pos)  // Pass the index of the new item
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