class Control {

    static sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }
}

export { Control };