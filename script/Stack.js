class Stack {
    
    constructor() {
        this.items = [];
    }

    push(element) {
        this.items.push(element);
    }

    pop() {
        if (this.items.length == 0)
            return null;
        return this.items.pop();
    }

    peek() {
        return this.items[this.items.length - 1];
    }

    printStack() {
        var str = "";
        for (let el of this.items)
            str += el.toString() + " ";
        return str;
    }

    isEmpty() {
        return this.items.length == 0;
    }

    
}