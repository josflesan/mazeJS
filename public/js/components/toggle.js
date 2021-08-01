import { getGrid } from "../solve.js"

let ANIMATE = false
let PERFECT_MAZE = false

let toggles = document.getElementsByClassName("theme-toggle")

function initToggle(screen) {

    for (let i = 0; i < toggles.length; i++) {

        let toggle = toggles[i]

        if (toggle.classList.contains('theme-toggle-active')) toggle.classList.remove('theme-toggle-active')
        if (!toggle.classList.contains('theme-toggle-inactive')) toggle.classList.add('theme-toggle-inactive')

        toggle.childNodes[3].innerHTML = "O"  // Add inactive text by default
        updateToggle(toggle, screen)
        toggle.addEventListener("click", listenToggle.bind(toggle), false)

    }

}

function updateToggle(toggle, screen="") {

    if (!getGrid() && screen == "solve") {
        toggle.classList.add('theme-toggle-hidden')
        
        if (toggle.classList.contains('theme-toggle-active')) toggle.classList.remove('theme-toggle-active')
        if (!toggle.classList.contains('theme-toggle-inactive')) toggle.classList.add('theme-toggle-inactive')

        toggle.childNodes[3].innerHTML = "O"
    } else if (getGrid() || screen != "solve") {
        if (screen == "solve")  toggle.classList.remove('theme-toggle-hidden')
    }

}

function listenToggle(element) {

    let toggle = element.path[1]

    if (toggle.classList.contains('theme-toggle-inactive')) {
        toggle.classList.remove('theme-toggle-inactive')
        toggle.classList.add('theme-toggle-active')

        toggle.childNodes[3].innerHTML = "I"

        if (toggle.id == "animateToggle") {
            ANIMATE = true
        } else if (toggle.id == "perfectMazeToggle") {
            PERFECT_MAZE = true
        }
    }
    else if (toggle.classList.contains('theme-toggle-active')) {
        toggle.classList.remove('theme-toggle-active')
        toggle.classList.add('theme-toggle-inactive')

        toggle.childNodes[3].innerHTML = "O"

        if (toggle.id == "animateToggle") {
            ANIMATE = false
        } else if (toggle.id == "perfectMazeToggle") {
            PERFECT_MAZE = false
        }
    }
}

function getAnimate() {
    return ANIMATE
}

function getPerfectMaze() {
    return PERFECT_MAZE
}

function setAnimate(value) {
    ANIMATE = value
}

export { initToggle, updateToggle, getAnimate, setAnimate, getPerfectMaze };