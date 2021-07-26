import { Algorithms } from "../components/algorithms.js"

let modal = document.getElementById("saveModal")
let screenFilter = document.getElementById("screen-filter")
let btn = document.getElementById("savebtn")
let submitBtn = document.getElementById("saveSubmit")
let textBox = document.getElementById("modal-content-text")
let span = document.getElementsByClassName("close")[0]

let finalGrid = null;
let savedMazeNames = [];

let req = new XMLHttpRequest();
let url = "/data"

/**
 * Function that is executed once the http async GET request call is fulfilled.
 * Parses the JSON returned by the request and uses it to populate an array
 * of saved maze names
 */
function onLoad() {
    let response = this.responseText
    let parsedResponse = JSON.parse(response)

    let mazes = parsedResponse.mazes
    mazes.forEach((maze) => {
        savedMazeNames.push(maze.name)
    })
}

/**
 * Function that is run if the GET request to the server fails
 */
function onError() {
    console.log('error receiving async AJAX call')
}

/**
 * Function that saves the maze by sending a POST request to the server containing
 * the new maze's name and grid contents
 */
function saveMaze() {

    let data = {
        name: textBox.value,
        grid: finalGrid
    }

    savedMazeNames.push(textBox.value)

    fetch('/save', {
        method: 'POST', // or 'PUT'
        body: JSON.stringify(data), // data can be `string` or {object}!
        headers:{
          'Content-Type': 'application/json'
        }
      }).then(res => res.json())
      .catch(error => console.error('Error:', error))
      .then(response => console.log('Success:', response));
}

/**
 * Function that sets the global variable finalGrid to the grid's contents so as to save it in the
 * saveMaze function
 * 
 * @param {Grid} grid           The grid object being saved
 */
export function setGrid(grid) {
    finalGrid = grid.grid
}

/**
 * Function that makes the save button active and clickable if there is one.
 * Exported as it is used in the Algorithms.js file
 */
export function revealSaveBtn() {
    if (btn) {
        btn.classList.add("screen-footer-savebtn-active")
        btn.classList.remove("screen-footer-savebtn-inactive")
    }
}

/**
 * Function that makes the save button inactive and unclickable if there is one.
 * Exported as it is used in the Algorithms.js file
 */
export function hideSaveBtn() {
    if (btn) {
        btn.classList.remove("screen-footer-savebtn-active")
        btn.classList.add("screen-footer-savebtn-inactive")
    }
}

/**
 * Save Button Listener Function.
 * 
 * Handles the logic of and declares the event listeners for the different divs
 * Associated to the save button and its modal, including sending the GET request
 * To the server to load the saved maze names so as to avoid repeats when saving
 */
export function handleSaveBtn() {

    btn.onclick = () => {

        // If there is a maze to save...
        if (Algorithms.isFinished() && btn.classList.contains('screen-footer-savebtn-active')) {

            req.open('GET', url, true)
            req.addEventListener('load', onLoad)
            req.addEventListener('error', onError)
        
            req.send()

            modal.style.display = "block"
            screenFilter.style.display = "block"
        }

    }

    submitBtn.onclick = () => {

        if (savedMazeNames.includes(textBox.value)) {
            alert(`The maze \"${textBox.value}\" already exists, please give this maze a new name`)
        } else {
            saveMaze()
        }

        screenFilter.style.display = "none"
        modal.style.display = "none"
        textBox.value = ""  // Reset text box
    }

    span.onclick = () => {
        modal.style.display = "none"
        screenFilter.style.display = "none"
    }

    window.onclick = (e) => {
        if (e.target == modal) {
            modal.style.display = "none"
        }
    }

}