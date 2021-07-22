
class CustomWeakMap {

    constructor(init) {
        this._wm = new WeakMap(init)
        this._length = 0
        this._keys = []
    }

    clear() {
        this._wm = new WeakMap()
    }

    length() {
        return this._length
    }

    keys() {
        return this._keys
    }

    delete(k) {
        this._length--
        this._keys = this._keys.filter(key => key != k)
        return this._wm.delete(k)
    }

    get(k) {
        return this._wm.get(k)
    }

    has(k) {
        return this._wm.has(k)
    }

    set(k, v) {
        this._wm.set(k, v)
        this._length++
        this._keys.push(k)
        return this
    }


}

export { CustomWeakMap };