import { Algorithms } from "../components/algorithms.js"

let modal = document.getElementById("saveModal")
let screenFilter = document.getElementById("screen-filter")
let btn = document.getElementById("savebtn")
let submitBtn = document.getElementById("saveSubmit")
let textBox = document.getElementById("modal-content-text")
let span = document.getElementsByClassName("close")[0]

let finalGrid = null;
let savedMazeNames = [];

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

export function setGrid(grid) {
    finalGrid = grid.grid
}

export function revealSaveBtn() {
    if (btn) {
        btn.classList.add("screen-footer-savebtn-active")
        btn.classList.remove("screen-footer-savebtn-inactive")
    }
}

export function hideSaveBtn() {
    if (btn) {
        btn.classList.remove("screen-footer-savebtn-active")
        btn.classList.add("screen-footer-savebtn-inactive")
    }
}

export function handleSaveBtn() {

    btn.onclick = () => {

        // If there is a maze to save...
        if (Algorithms.isFinished() && btn.classList.contains('screen-footer-savebtn-active')) {
            modal.style.display = "block"
            screenFilter.style.display = "block"
        }

    }

    submitBtn.onclick = () => {

        if (savedMazeNames.includes(textBox.value)) {
            alert("Please choose a new name for your maze...")
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