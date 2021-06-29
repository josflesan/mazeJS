class Stack {
    
    /**
     * Constructor function that initiates the Stack
     */
    constructor() {
        this.items = [];
    }

    /**
     * Pushes an element onto the stack
     * @param {Cell} element    Cell object to be pushed onto the stack
     */
    push(element) {
        this.items.push(element);
    }

    /**
     * Pops an element from the stack and returns it
     * @returns {Cell}  Returns the Cell object at the top of the Stack
     */
    pop() {
        if (this.items.length == 0)
            return null;
        return this.items.pop();
    }

    /**
     * Function that returns the object at the top of
     * the stack without popping it
     * @returns {Cell}  The Cell object at the top of the Stack
     */
    peek() {
        return this.items[this.items.length - 1];
    }

    /**
     * Function that prints the Stack's contents onto the console
     * @returns {String}    String representation of Stack elements
     */
    printStack() {
        var str = "";
        for (let el of this.items)
            str += el.toString();
        return str;
    }

    /**
     * Function to check whether the Stack is empty
     * @returns {Boolean}   True if the Stack is empty, else false
     */
    isEmpty() {
        return this.items.length == 0;
    }

    
}

export { Stack };