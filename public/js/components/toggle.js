import { getGrid } from "../solve.js"

let ANIMATE = false

let activeText = document.createElement('span')
activeText.innerHTML = "I"
activeText.id = "active-toggle-text"

let inactiveText = document.createElement('span')
inactiveText.innerHTML = "O"
inactiveText.id = "inactive-toggle-text"

let toggle = document.getElementsByClassName("theme-toggle")[0]

function initToggle(screen) {

    toggle.classList.add('theme-toggle-inactive')
    toggle.appendChild(inactiveText)  // Add inactive text by default

    if (screen == "solve" && getGrid() || screen == "generate") {
        if (screen == "solve") {
            toggle.classList.remove('theme-toggle-hidden')
        }
        toggle.addEventListener("click", listenToggle)
    } else {
        toggle.classList.add('theme-toggle-hidden')
    }
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

function setAnimate(value) {
    ANIMATE = value
}

export { initToggle, getAnimate, setAnimate };