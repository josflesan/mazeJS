let ANIMATE = false

let activeText = document.createElement('span')
activeText.innerHTML = "I"
activeText.id = "active-toggle-text"

let inactiveText = document.createElement('span')
inactiveText.innerHTML = "O"
inactiveText.id = "inactive-toggle-text"

let toggle = document.getElementsByClassName("theme-toggle")[0]

function initToggle() {
    toggle.classList.add('theme-toggle-inactive')
    toggle.appendChild(inactiveText)  // Add inactive text by default
    toggle.addEventListener("click", listenToggle)
}

function listenToggle() {

    if (toggle.classList.contains('theme-toggle-inactive')) {
        toggle.classList.remove('theme-toggle-inactive')
        toggle.classList.add('theme-toggle-active')

        toggle.replaceChild(activeText, inactiveText)
        ANIMATE = true
    }
    else if (toggle.classList.contains('theme-toggle-active')) {
        toggle.classList.remove('theme-toggle-active')
        toggle.classList.add('theme-toggle-inactive')

        toggle.replaceChild(inactiveText, activeText)
        ANIMATE = false
    }
}

function getAnimate() {
    return ANIMATE
}

export { initToggle, getAnimate };