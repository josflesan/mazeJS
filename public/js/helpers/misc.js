let randomProperty = function (obj) {
    let selectedProperty = {}

    let keys = Object.keys(obj)
    let randomKeyIndex = keys.length * Math.random() << 0
    let selectedKey = keys[randomKeyIndex]
    let selectedValue = obj[selectedKey]

    selectedProperty[selectedKey] = selectedValue

    return selectedProperty
} 

export { randomProperty };