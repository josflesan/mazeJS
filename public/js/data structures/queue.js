class Queue {

    /**
     * Constructor function that initialises the Queue
     */
    constructor() {
        this.items = []
        this.rear = 0
    }

    /**
     * Queues an element to the queue
     * @param {Any} element         Element to be queued
     */
    enqueue(element) {
        this.items.push(element)
    }

    /**
     * Function used to dequeue element from queue and return it
     * @returns {Any}           Element aat the front of the queue being returned
     */
    dequeue() {
        let nextItem = this.items[0]  // Save current last item
        this.items.shift()  // Delete last item in queue
        return nextItem
    }

    /**
     * Function that returns the length of the queue
     * @returns {Integer}       The length of the items array
     */
    length() {
        return this.items.length
    }

    /**
     * Function that returns whether or not the queue is empty
     * @returns {Boolean}       True if the length of the items property is 0, otherwise False
     */
    isEmpty() {
        return this.items.length === 0
    }

    /**
     * Function that returns the element at the front of the queue
     * @returns {Any}           The element at position 0 in the items property
     */
    getFront() {
        if (!this.isEmpty()) {
            return this.items[0]
        }
    }

    /**
     * Function that returns the last element added to the queue
     * @returns {Any}           The element at the last index of the items property
     */
    getLast() {
        if (!this.isEmpty()) {
            return this.items[this.length() - 1]
        }
    }

    /**
     * Function that prints out the contents of the queue to the console
     */
    printQueue() {
        this.items.forEach((el) => {
            console.log(el)
        })
    }

}

export { Queue }