import { getGrid } from "../solve.js"

let ANIMATE = false
let PERFECT_MAZE = false

let toggles = document.getElementsByClassName("theme-toggle")

function initToggle(screen) {

    for (let i = 0; i < toggles.length; i++) {

        let toggle = toggles[i]

        toggle.classList.add('theme-toggle-inactive')
        toggle.childNodes[3].innerHTML = "O"  // Add inactive text by default
    
        if (screen == "solve" && getGrid() || screen == "generate") {
            if (screen == "solve") {
                toggle.classList.remove('theme-toggle-hidden')
            }
            toggles[i].addEventListener("click", listenToggle.bind(toggles[i]), false)
        } else {
            toggle.classList.remove('theme-toggle-active')
            toggle.classList.add('theme-toggle-hidden')
            if (toggle.querySelector('#active-toggle-text')) {
                toggle.childNodes[3].innerHTML = "O"
    
                if (toggle.id == "animateToggle") {
                    ANIMATE = false
                } else if (toggle.id == "perfectMazeToggle") {
                    PERFECT_MAZE = false
                }
            }
            toggle.removeEventListener("click", listenToggle)
        }

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

export { initToggle, getAnimate, setAnimate, getPerfectMaze };